# Security measures — meridianinterface.com

Last verified against production on 16 September 2026, after the fixes below. Every line below was
tested, not assumed. Where something is unverified or still open, it says so.

This file describes how the site defends itself and what Otis has to do to keep
that true. It is not a marketing document and should not be handed to a client
as one — it names internal endpoints and limits.

---

## 1. What there is to protect

Three things, in order of how much damage losing them would do:

1. **The CRM** — real people's names, email addresses and phone numbers, and
   what they asked for. Losing this is a privacy breach and a legal problem.
2. **The sending domain** — the ability to send email as
   `meridianinterface.com`. Losing this means spam goes out under the studio's
   name, SendGrid suspends the account, and the domain's reputation takes
   months to rebuild. This is the one most often left undefended, and it was.
3. **The invoices and rate card** — commercial information about what the
   studio charges and who it bills.

The website itself is not the valuable part. It is a set of static files. The
value is behind it.

---

## 2. The shape of the defence

The browser is never trusted with a decision. Every check that matters happens
on a Supabase edge function, against secrets the browser never receives.

```
visitor's browser
   │  (public: anyone can call these)
   ├── intake         booking form      → rate limited, length capped
   ├── site-images    which pictures    → rate limited, read-only
   ├── unsubscribe    opt-out link      → rate limited, HMAC token IS the auth
   ├── pay            payment status    → rate limited; everything else needs a token
   ├── planner        AI advisor        → rate limited, origin checked, spend capped
   ├── pay-webhook    Stripe callback   → Stripe's signature IS the auth
   └── owner          the studio portal → passcode → signed session token
                                          │
                                          └── Postgres, RLS deny-by-default
```

Nothing in the browser can read the database directly. The public API key is
refused by every table.

---

## 3. Verified controls

### Database

| Control | Verified how |
|---|---|
| Row Level Security on all 21 tables, no policies — deny by default | Read attempts with the public key against `contacts`, `settings`, `owner_invoices` all returned empty |
| Storage writes blocked to the public key | Upload attempt returned `403 new row violates row-level security policy` |
| `rate_allow` reachable only by the service role | `revoke` on the function, confirmed in migration 0027 |

### The studio portal

| Control | Verified how |
|---|---|
| Passcode compared on the server, never in the browser | Login POSTs to the `owner` function; the bundle contains no passcode |
| Constant-time comparison | Source: `constantTimeEqual` folds the result rather than returning early, so guessing cannot be timed |
| 8 wrong passcodes per 15 minutes per address | Source + live 401 with a `remaining` count |
| Session token is HMAC-signed and expires in 8 hours | One working day, not forever |
| Token derived from, not equal to, the service key | A stolen token cannot be reversed into the key |
| Token in `sessionStorage`, never `localStorage`, never a cookie | Dies when the tab closes; being in no cookie is why CORS `*` is not a CSRF hole |
| A forged token cannot open the portal | Browser test: portal re-locks, cache wiped, gate returns |
| Locking clears the cached records too | Browser test: `localStorage` empty afterwards |
| Passcode field is masked, and never appears in the URL | Browser test |

### Public endpoints

| Endpoint | Limit | Additional |
|---|---|---|
| `intake` | 5/hour per address | Every field length-capped, address shape-checked, 60 acknowledgement emails/day site-wide |
| `unsubscribe` | 60/hour | HMAC token; GET previews, POST acts, so a scanner cannot unsubscribe anyone |
| `site-images` | 300/hour | Read-only; writes need the owner token |
| `pay` | 240/hour | Only `status` is unauthenticated, and it returns three booleans |
| `planner` | hourly per address + daily spend cap | Rejects foreign origins |
| `pay-webhook` | none, deliberately | Stripe's signature is the gate; throttling risks dropping a real payment notification |
| `owner` | 600/hour, plus 8 failed logins per 15 min | Deployed 16 Sep, v39 |

### The site itself

| Control | Verified how |
|---|---|
| HTTPS enforced, HSTS one year including subdomains | Live header check |
| Content-Security-Policy: scripts only from self + PostHog | Live header; no inline scripts, no plugins |
| Cannot be embedded in a frame | `X-Frame-Options: DENY`, `frame-ancestors 'none'` |
| No MIME sniffing, referrer trimmed cross-origin | Live headers |
| Geolocation, microphone, camera, USB all denied | `Permissions-Policy` |
| `.env`, `.env.production`, `.git/config`, `package.json`, raw source | All return **404** on the live domain |
| No secret in the shipped JavaScript | Bundle scanned for Anthropic, SendGrid, Stripe and service-role patterns — none |
| No secret in git history | All 215 system commits and 116 website commits scanned; only a placeholder |
| Dependencies | `npm audit`: 0 vulnerabilities |
| Nightly CRM snapshot, restorable | `take_crm_snapshot` at 08:15 UTC; rows rebuilt from snapshot 1 with `jsonb_populate_recordset` were byte-identical to live, zero differences in either direction |
| A backup that stops running raises an alert | `crm-snapshot` is covered by the same cron sweep as everything else (migration 0029) |
| Nothing sensitive logged | 3 `console.error` calls across 16 functions, all message strings; the booking handler deliberately logs nothing, because the appointment carries a name, email and phone |

---

## 4. Rules that keep this true

These are the ones that get broken by accident.

1. **Never put a real secret in anything starting `VITE_`.** Vite compiles
   those into the files the site serves. Anything prefixed that way is public
   by definition — the PostHog project key is there on purpose and is designed
   to be public.
2. **Secrets go in Supabase → Edge Functions → Secrets.** Not in Vercel, not in
   the repository, not in a chat message.
3. **`intake` must keep `verify_jwt = false`.** The booking form calls it from
   a visitor's browser with no session. Requiring a JWT does not add security,
   it just breaks the form — it did, for two and a half minutes on 16 Sep,
   because a redeploy silently defaulted it back to true.
4. **After touching the Vercel Domains page, check the Production badge is
   still on `meridianinterface.com` and that it has no redirect arrow.**
   Adding a domain silently makes the new one primary. This took the site down
   on 16 Sep.
5. **`vercel.json` cannot contain comments.** JSON has no comment syntax and
   Vercel rejects unknown keys, failing the deployment before it builds. Notes
   belong in `VERCEL-CONFIG.md`.
6. **Rotate the owner passcode if it is ever typed on a machine you do not
   control.** Supabase → Edge Functions → Secrets → `OWNER_PASSCODE`. It takes
   effect immediately; existing sessions still run until they expire.

---

## 5. Open items

Stated plainly rather than left for someone to discover.

| Item | Risk | What closes it |
|---|---|---|
| Safari and Firefox untested | Unknown rendering or behaviour differences. Everything here was driven in Chromium, which is what this environment has | A real device, or BrowserStack |
| Demo client names shown publicly | Not a breach — the appointments page shows seeded examples, not real bookings — but fabricated clients presented as real is a credibility question | Decide whether to keep them |
| Snapshots live in the same database they protect | They defend against a bad `DELETE`, which is what actually happened on 9 Sep. They do not defend against losing the Supabase project itself | Supabase paid-tier backups, or periodically download a snapshot |
| Stripe not connected | No invoice can be paid online | `STRIPE_SECRET_KEY` as a Supabase secret |
| No postal address on file | Marketing email is refused without one, by design. Transactional mail is unaffected | A PO box, then `settings.business_profile.postal_address` |

### Closed on 16 September

| Was | Now |
|---|---|
| `owner` rate limit written but not deployed | Deployed, v39, 600/hour, verified live |
| No backup of the CRM | Nightly snapshot at 08:15 UTC, 30-day retention, restore path tested against live rows |
| Three alerts firing on stale conditions (946 / 663 / 607 repeats) | One accurate alert. See migration 0029 |

---

## 6. If something goes wrong

**Data deleted by mistake.** Snapshots go back 30 days. List them with
`select * from public.list_crm_snapshots();`, then read a table back with
`select * from jsonb_populate_recordset(null::public.deals,
public.read_crm_snapshot(<id>, 'deals'));`. Inspect before inserting — restore
is deliberately not one command, because overwriting good data with old data at
2am is its own disaster.

**Suspected portal compromise.** Change `OWNER_PASSCODE` in Supabase secrets.
Sessions last at most 8 hours, so the window closes on its own; changing the
passcode stops any new one being issued.

**Spam going out as Meridian.** Check `messages` in the CRM for a burst of
`booking_confirmation` rows. The daily cap of 60 is the ceiling. Set
`WEBHOOK_SECRET` to close `intake` to the website only — but note that this
also stops the public booking form, so it is an emergency measure, not a
default.

**Site unreachable.** Check Vercel → Domains first: the Production badge
belongs on `meridianinterface.com` with no redirect. That has been the cause
both times so far, and neither was DNS.

**A key is exposed.** Revoke it at the provider before doing anything else.
Rotating beats investigating; the investigation can happen after the key is
dead.
