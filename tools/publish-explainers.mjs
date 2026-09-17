/**
 * Publish the Client Answers to the database, so the agents can use them.
 *
 * The explainers in src/data/clientExplainers.ts are Otis's own words for
 * "what am I actually paying for?". They were only ever compiled into the
 * website bundle, which meant the marketing agents could not read them: a
 * drafted client reply was written from general service descriptions instead
 * of from the answers he had already written and approved.
 *
 * This prints the SQL that puts them in settings.client_explainers, where
 * the edge functions can reach them. Run it after editing the explainers:
 *
 *   node tools/publish-explainers.mjs > /tmp/explainers.sql
 *
 * then apply that SQL to the Supabase project. The source of truth stays the
 * TypeScript file — this is a one-way publish, never an import.
 *
 * NO PRICES TRAVEL THROUGH HERE. The explainer text carries none by design
 * (`price` is filled in at runtime, owner-side, from pricing_catalogue), and
 * this script refuses to emit anything that looks like a figure rather than
 * quietly handing the agents a number to repeat at a client.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SRC = 'src/data/clientExplainers.ts';

// The source is TypeScript, so strip the types before importing it rather than
// parsing it by hand — a regex that reads a data file is a bug waiting for the
// first apostrophe.
const out = join(mkdtempSync(join(tmpdir(), 'explainers-')), 'ce.mjs');
execFileSync('npx', ['esbuild', SRC, '--format=esm', '--platform=node', `--outfile=${out}`, '--log-level=error'], {
  stdio: ['ignore', 'ignore', 'inherit'],
});
const { CLIENT_EXPLAINERS } = await import(out);

const items = CLIENT_EXPLAINERS.map((e) => ({
  id: e.id,
  title: e.title,
  matches: e.matches,
  summary: e.summary,
  short: e.short,
  outcome: e.outcome,
  // Only `what` — the `why` is for the owner reading the reference desk, and
  // doubles the prompt for a reply the client will skim.
  included: (e.included ?? []).map((s) => s.what),
  excluded: e.excluded ?? [],
}));

const json = JSON.stringify(items);

const money = json.match(/[$£€]\s?[0-9][0-9,.]*|\b[0-9][0-9,]*\s?(dollars|usd)\b/gi);
if (money) {
  console.error(`Refusing to publish: the explainer text names money (${money.join(', ')}).`);
  console.error('Pricing is decided by Meridian Interface staff and belongs in an invoice, not in text an agent can repeat.');
  process.exit(1);
}

// $json$ dollar-quoting, so apostrophes and em dashes need no escaping.
if (json.includes('$json$')) {
  console.error('Refusing to publish: the text contains the dollar-quote delimiter.');
  process.exit(1);
}

const why =
  "Otis's own client-facing answers to \"what am I actually paying for?\". " +
  'Published from src/data/clientExplainers.ts in the website repo, which stays the source of truth — ' +
  're-run tools/publish-explainers.mjs after editing. NO PRICES LIVE HERE AND NONE MAY BE ADDED.';

process.stdout.write(
  `insert into settings (key, value) values ('client_explainers', jsonb_build_object(\n` +
  `  '_why', ${JSON.stringify(why).replace(/'/g, "''").replace(/^"|"$/g, "'")},\n` +
  `  'items', $json$${json}$json$::jsonb\n` +
  `))\non conflict (key) do update set value = excluded.value, updated_at = now();\n` +
  `\n-- ${items.length} explainers, ${json.length} bytes\n`,
);
