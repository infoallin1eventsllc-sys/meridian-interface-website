import React, { useEffect, useState } from 'react';
import { TabType, Appointment, ServiceCategory } from '../types';
import { submitAppointment, newAppointmentId, NOT_DISCUSSED } from '../lib/leads';
import {
  getBucket, removeSaved, clearBucket, onBucketChange, bucketAsNote, type SavedItem,
} from '../lib/bucket';

/**
 * The client's list, and the one button that sends it to the studio.
 *
 * The flow this completes: they go through the demos, save what they want,
 * and send the list. It arrives as a booked appointment with the items named
 * in the note, so Otis can talk it through and then send an itemised invoice
 * for exactly those items.
 *
 * There is no total on this page and no "proceed to payment", because a price
 * has not been decided yet and inventing one here is the thing the whole
 * mechanism exists to prevent. What the page promises instead is a reply with
 * an itemised quote, which is a promise the studio can actually keep.
 */

const INPUT =
  'w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-900 transition-colors';

/** The service bucket the list most looks like, so the CRM files it usefully. */
function dominantService(items: SavedItem[]): ServiceCategory {
  const s = items.find((i) => i.kind === 'service');
  if (s) return s.id as ServiceCategory;
  return 'web_design';
}

export const BucketView: React.FC<{ onTabChange: (tab: TabType) => void }> = ({ onTabChange }) => {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ id: string; delivered: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(getBucket());
    return onBucketChange(setItems);
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length || sending) return;
    setError(null);

    if (!name.trim() || (!email.trim() && !phone.trim())) {
      setError('Add your name, and an email address or phone number so we can reply.');
      return;
    }

    setSending(true);
    const appointment: Appointment = {
      id: newAppointmentId(),
      clientName: name.trim(),
      clientEmail: email.trim(),
      clientPhone: phone.trim(),
      companyName: company.trim() || undefined,
      serviceType: dominantService(items),
      serviceTitle: `Saved list — ${items.length} item${items.length === 1 ? '' : 's'}`,
      preferredDate: '',
      preferredTimeSlot: 'To be arranged',
      // Never guessed at. The quote decides the money, after the conversation.
      budgetRange: NOT_DISCUSSED,
      notes: [bucketAsNote(items), note.trim() ? `\nWhat they said:\n${note.trim()}` : '']
        .filter(Boolean).join('\n'),
      status: 'In Review',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const result = await submitAppointment(appointment);
    setSending(false);
    setSent({ id: appointment.id, delivered: result.delivered });
    // The list has been sent; keeping it would invite a second identical send.
    clearBucket();
  };

  if (sent) {
    return (
      <section className="max-w-2xl mx-auto px-4 md:px-12 pt-24 pb-24 md:pb-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
          <span className="material-symbols-outlined text-5xl text-blue-600" aria-hidden="true">mark_email_read</span>
          <h1 className="font-display font-bold text-2xl text-slate-900 mt-3">Your list is with us</h1>
          <p className="font-body text-sm text-slate-600 mt-2 leading-relaxed">
            Reference <span className="font-mono font-bold text-slate-900">{sent.id}</span>. A Meridian Interface
            agent will go through what you picked and come back with an itemised quote — every line saying what it is
            for, so you can see how the figure is put together rather than being handed a total.
          </p>
          {!sent.delivered && (
            <p className="font-body text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              We could not reach the studio's system just now, so your list is saved on this device only. If you do not
              hear back within a day, email <a className="underline font-semibold" href="mailto:otis@meridianinterface.com">otis@meridianinterface.com</a> and it will not be lost.
            </p>
          )}
          <button
            onClick={() => onTabChange('portfolio')}
            className="mt-6 px-6 py-3 bg-[#0f172a] text-white font-body font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all"
          >
            Back to the work
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-12 pt-24 pb-24 md:pb-16">
      <div className="mb-8">
        <p className="font-body text-xs font-bold uppercase tracking-widest text-blue-600">Your list</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mt-1">
          What you have picked out
        </h1>
        <p className="font-body text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Send it over and a Meridian Interface agent will talk it through with you, then put an itemised quote
          together — each line saying what it covers. Nothing here is an order and nothing is charged.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300" aria-hidden="true">bookmark_add</span>
          <h2 className="font-display font-bold text-lg text-slate-900 mt-2">Nothing saved yet</h2>
          <p className="font-body text-sm text-slate-600 mt-1.5 max-w-md mx-auto leading-relaxed">
            Go through the work and the services, and save anything you would want for your own business. The saved
            items gather here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              onClick={() => onTabChange('portfolio')}
              className="px-6 py-3 bg-[#0f172a] text-white font-body font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all"
            >
              See the work
            </button>
            <button
              onClick={() => onTabChange('services')}
              className="px-6 py-3 bg-white text-slate-900 border border-slate-300 font-body font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-all"
            >
              Browse services
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                {item.image ? (
                  <img src={item.image} alt="" aria-hidden="true" className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-100 grid place-items-center shrink-0">
                    <span className="material-symbols-outlined text-slate-400" aria-hidden="true">category</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-body text-[11px] font-bold uppercase tracking-widest text-blue-600">
                    {item.kind === 'service' ? 'Service' : 'Work'}
                  </p>
                  <p className="font-display font-bold text-sm text-slate-900 truncate">{item.title}</p>
                  {item.subtitle && <p className="font-body text-xs text-slate-500 truncate">{item.subtitle}</p>}
                </div>
                <button
                  onClick={() => removeSaved(item.id)}
                  aria-label={`Remove ${item.title} from your list`}
                  className="w-9 h-9 grid place-items-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-lg" aria-hidden="true">close</span>
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3 h-fit shadow-xs">
            <h2 className="font-display font-bold text-lg text-slate-900">Send it to the studio</h2>
            <p className="font-body text-xs text-slate-500 leading-relaxed">
              So we know who to reply to. We answer with a quote, not an invoice to pay.
            </p>

            <div>
              <label htmlFor="bucket-name" className="block font-body text-xs font-semibold text-slate-700 mb-1">Your name</label>
              <input id="bucket-name" value={name} onChange={(e) => setName(e.target.value)} className={INPUT} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="bucket-email" className="block font-body text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input id="bucket-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} autoComplete="email" />
            </div>
            <div>
              <label htmlFor="bucket-phone" className="block font-body text-xs font-semibold text-slate-700 mb-1">Phone <span className="font-normal text-slate-400">(or email above)</span></label>
              <input id="bucket-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT} autoComplete="tel" />
            </div>
            <div>
              <label htmlFor="bucket-company" className="block font-body text-xs font-semibold text-slate-700 mb-1">Business <span className="font-normal text-slate-400">(optional)</span></label>
              <input id="bucket-company" value={company} onChange={(e) => setCompany(e.target.value)} className={INPUT} autoComplete="organization" />
            </div>
            <div>
              <label htmlFor="bucket-note" className="block font-body text-xs font-semibold text-slate-700 mb-1">Anything we should know <span className="font-normal text-slate-400">(optional)</span></label>
              <textarea id="bucket-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} className={INPUT} placeholder="What the business does, when you need it, anything you already have." />
            </div>

            {error && (
              <p role="alert" className="font-body text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2.5">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full px-6 py-3.5 bg-[#0f172a] text-white font-body font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">send</span>
              {sending ? 'Sending…' : `Send ${items.length} item${items.length === 1 ? '' : 's'} for a quote`}
            </button>
          </form>
        </div>
      )}
    </section>
  );
};
