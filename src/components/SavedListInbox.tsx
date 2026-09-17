/**
 * What the client picked — the screen that has to exist before an invoice can.
 *
 * A client saves products on the site and sends the list as a booking. Until
 * now that list reached the CRM and stopped there: nothing emails the owner
 * when a booking lands, and the portal had no leads screen, so the only way to
 * see what someone chose was to query the database by hand.
 *
 * NO PRICES LIVE HERE, AND NONE MAY BE ADDED. This screen says what to price.
 * What it costs is decided by Meridian Interface staff and reaches the client
 * as an itemised invoice, after the conversation.
 */
import { useEffect, useState } from 'react';
import { fetchLeads, itemsAsInvoiceLines, receivedLabel, type InboxLead } from '../lib/inbox';

export function SavedListInbox() {
  const [leads, setLeads] = useState<InboxLead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const rows = await fetchLeads(50);
      if (!alive) return;
      setLeads(rows);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const copyLines = async (lead: InboxLead) => {
    const text = itemsAsInvoiceLines(lead).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(lead.appointmentId ?? '');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard is blocked in some browsers and over plain http. The items
      // are on screen either way, so this is a convenience, not the feature.
      setCopied(null);
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-500 py-8">Loading bookings…</div>;
  }

  // Null means the request failed. An empty list means nobody has sent one yet.
  // Saying "no bookings" when we simply could not ask would be a lie that costs
  // a sale.
  if (leads === null) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
        <div className="font-bold mb-1">Could not reach the bookings service</div>
        Your session may have expired — sign out and back in. This is not the same
        as having no bookings; nothing has been lost.
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <span className="material-symbols-outlined text-4xl text-slate-300">shopping_cart</span>
        <div className="mt-2 font-bold text-slate-700">No saved lists yet</div>
        <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
          When a client saves products on the site and sends them through, the list
          shows up here — with everything they picked, ready to price.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        What clients picked, newest first. Price each list yourself and send it back
        as an itemised invoice — nothing here shows a client a figure.
      </p>

      {leads.map((lead) => (
        <article
          key={lead.appointmentId ?? `${lead.contactId}-${lead.receivedAt}`}
          className="rounded-xl border border-slate-200 bg-white overflow-hidden"
        >
          <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
            <div className="min-w-0">
              <div className="font-bold text-slate-900 truncate">
                {lead.client.name || 'Someone'}
                {lead.client.company ? (
                  <span className="font-normal text-slate-500"> · {lead.client.company}</span>
                ) : null}
              </div>
              <div className="mt-0.5 text-xs text-slate-500 break-all">
                {lead.client.email || 'no email'}
                {lead.client.phone ? ` · ${lead.client.phone}` : ''}
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 shrink-0">
              <div className="font-mono font-semibold text-slate-700">
                {lead.appointmentId ?? '—'}
              </div>
              <div>{receivedLabel(lead.receivedAt)}</div>
            </div>
          </header>

          <div className="px-5 py-4">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Picked {lead.itemCount} item{lead.itemCount === 1 ? '' : 's'}
            </div>

            {lead.items.length > 0 ? (
              <ol className="mt-2 space-y-1.5">
                {lead.items.map((item, n) => (
                  <li key={n} className="flex gap-3 text-sm">
                    <span className="font-mono text-slate-400 shrink-0">{n + 1}.</span>
                    <span className="min-w-0">
                      <span className="font-semibold text-slate-900">{item.title}</span>
                      {item.detail ? (
                        <span className="text-slate-500"> — {item.detail}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              // An older booking, or one where someone typed instead of saving.
              // Show what they actually wrote rather than an empty box.
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                {lead.rawNote || 'No items were attached to this booking.'}
              </p>
            )}

            {lead.saidByClient ? (
              <div className="mt-4 rounded-lg border-l-4 border-slate-300 bg-slate-50 px-4 py-3">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  What they said
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                  {lead.saidByClient}
                </p>
              </div>
            ) : null}

            {lead.items.length > 0 ? (
              <button
                type="button"
                onClick={() => copyLines(lead)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0f172a] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-base">content_copy</span>
                {copied === (lead.appointmentId ?? '') ? 'Copied' : 'Copy as invoice lines'}
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
