import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  approveContent, contactName, fetchQueue, rejectContent, rejectMessage, sendMessage, updateContent,
  type ContentItem, type MarketingQueue as Queue, type OwnerMessage,
} from '../lib/marketing';

/**
 * Marketing — what the system wrote, waiting on Otis.
 *
 * Decide mode. This gets opened to say yes or no to a handful of drafts, so
 * the items needing a decision come first and each carries everything needed
 * to make it: the words, the picture or the clip, who it is aimed at, and the
 * two buttons. Nothing here posts on its own — the database refuses to publish
 * or send anything without the owner's stamp, and these buttons are the only
 * things that apply it.
 *
 * Every state is named. A post that was approved with no platform connected
 * says so, rather than reading as "published" when nothing reached anyone.
 */

const REFRESH_MS = 60_000;

const ago = (iso: string | null): string => {
  if (!iso) return '';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const Pill: React.FC<{ tone?: 'slate' | 'amber' | 'green' | 'red' | 'blue'; children: React.ReactNode }> = ({
  tone = 'slate', children,
}) => (
  <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${
    tone === 'amber' ? 'bg-amber-50 text-amber-800'
      : tone === 'green' ? 'bg-emerald-50 text-emerald-800'
      : tone === 'red' ? 'bg-red-50 text-red-800'
      : tone === 'blue' ? 'bg-blue-50 text-blue-800'
      : 'bg-slate-100 text-slate-700'
  }`}>{children}</span>
);

const Button: React.FC<{
  onClick: () => void; icon: string; tone?: 'primary' | 'ghost' | 'danger'; disabled?: boolean; title?: string;
  children: React.ReactNode;
}> = ({ onClick, icon, tone = 'ghost', disabled, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
      tone === 'primary' ? 'bg-[#0f172a] text-white hover:bg-slate-800 shadow-sm'
        : tone === 'danger' ? 'bg-white border border-red-200 text-red-700 hover:bg-red-50'
        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
    }`}
  >
    <span className="material-symbols-outlined text-base" aria-hidden="true">{icon}</span>
    {children}
  </button>
);

/** What happened to an item after approval, in words rather than a status code. */
function outcome(item: ContentItem, channelLabel: string): { text: string; tone: 'amber' | 'green' | 'red' | 'blue' } {
  const m = item.meta ?? {};
  if (item.status === 'published') {
    return m.publish?.mocked
      ? { text: `Approved — not posted: no ${channelLabel} account connected yet`, tone: 'amber' }
      : { text: `Posted to ${channelLabel}`, tone: 'green' };
  }
  if (item.status === 'scheduled') {
    return { text: m.publish_pending?.note ?? `${channelLabel} is processing it`, tone: 'blue' };
  }
  if (item.status === 'approved') return { text: 'Approved — posting shortly', tone: 'blue' };
  if (item.status === 'failed') {
    const why = m.publish?.error ?? m.video?.error ?? 'failed';
    return { text: `Failed: ${why}`, tone: 'red' };
  }
  return { text: item.status, tone: 'amber' };
}

const Media: React.FC<{ item: ContentItem }> = ({ item }) => {
  const v = item.meta?.video;
  if (item.kind === 'video' && v?.state === 'ready' && v.url) {
    return (
      <video
        src={v.url}
        poster={v.poster ?? item.image_url ?? undefined}
        controls
        playsInline
        preload="metadata"
        className="w-full max-w-[240px] rounded-xl border border-slate-200 bg-black aspect-[9/16] object-cover"
      />
    );
  }
  if (item.image_url) {
    return (
      <img
        src={item.image_url}
        alt=""
        className="w-full max-w-[240px] rounded-xl border border-slate-200 aspect-square object-cover bg-slate-50"
      />
    );
  }
  return <div className="w-full max-w-[240px] aspect-square rounded-xl border border-dashed border-slate-300 bg-slate-50" />;
};

/** The five on-screen lines of a video, in order, when there is no clip to play yet. */
const ScriptSheet: React.FC<{ item: ContentItem }> = ({ item }) => {
  const s = item.meta?.script;
  const v = item.meta?.video;
  if (item.kind !== 'video' || !s) return null;
  const note =
    v?.state === 'ready' ? null
      : v?.state === 'rendering' ? 'The clip is rendering — it will appear here in a minute or two.'
      : v?.state === 'failed' ? `The clip did not render: ${v.error ?? 'unknown error'}. The script is still usable.`
      : 'Script only — no video renderer is connected yet. Add a Shotstack key and the next video renders on its own.';
  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
      <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
        On screen, in order
      </div>
      <ol className="space-y-1.5 text-[13px] leading-snug text-slate-800">
        <li><span className="font-mono text-[11px] text-slate-400 mr-2">1</span><strong>{s.hook}</strong></li>
        {s.beats.map((b, i) => (
          <li key={i}><span className="font-mono text-[11px] text-slate-400 mr-2">{i + 2}</span>{b}</li>
        ))}
        <li><span className="font-mono text-[11px] text-slate-400 mr-2">{s.beats.length + 2}</span><strong>{s.price_line}</strong></li>
        <li><span className="font-mono text-[11px] text-slate-400 mr-2">{s.beats.length + 3}</span>{s.cta}</li>
      </ol>
      {note && (
        <p className={`mt-3 text-[12px] leading-relaxed ${v?.state === 'failed' ? 'text-red-800' : 'text-slate-600'}`}>
          {note}
        </p>
      )}
    </div>
  );
};

const ContentCard: React.FC<{
  item: ContentItem;
  channelLabel: string;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
  onSave: (patch: { title: string; body: string }) => Promise<void>;
}> = ({ item, channelLabel, busy, onApprove, onReject, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title ?? '');
  const [body, setBody] = useState(item.body ?? '');
  const [expanded, setExpanded] = useState(false);
  const decidable = item.status === 'pending_approval';
  const retryable = item.status === 'failed' && !item.meta?.video?.error;
  const m = item.meta ?? {};
  const long = (item.body ?? '').length > 320;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="shrink-0">
          <Media item={item} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <Pill tone="blue">{channelLabel}</Pill>
            <Pill>{item.kind === 'video' ? 'short video' : item.kind}</Pill>
            {m.icp && <Pill>for: {m.icp}</Pill>}
            {m.mocked && <Pill tone="amber">placeholder text</Pill>}
            <span className="text-[11px] text-slate-400 ml-auto">{ago(item.created_at)}</span>
          </div>

          {editing ? (
            <div className="space-y-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Title"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              {item.kind === 'video' && (
                <p className="text-[11px] text-slate-500">
                  This edits the caption under the video. The words on screen come from the script and do not change here.
                </p>
              )}
              <div className="flex gap-2">
                <Button icon="check" tone="primary" disabled={busy} onClick={() => { void onSave({ title, body }).then(() => setEditing(false)); }}>Save</Button>
                <Button icon="close" disabled={busy} onClick={() => { setTitle(item.title ?? ''); setBody(item.body ?? ''); setEditing(false); }}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-display font-black text-lg text-slate-900 leading-tight">
                {item.title ?? 'Untitled'}
              </h3>
              <p className={`mt-1.5 text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap ${expanded || !long ? '' : 'line-clamp-5'}`}>
                {item.body}
              </p>
              {long && (
                <button type="button" onClick={() => setExpanded((x) => !x)} className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900">
                  {expanded ? 'Show less' : 'Read all'}
                </button>
              )}
              <ScriptSheet item={item} />
            </>
          )}

          {!decidable && (
            <div className="mt-3">
              {(() => { const o = outcome(item, channelLabel); return <Pill tone={o.tone}>{o.text}</Pill>; })()}
            </div>
          )}

          {!editing && (
            <div className="mt-4 flex flex-wrap gap-2">
              {decidable && (
                <>
                  <Button icon="check" tone="primary" disabled={busy} onClick={onApprove}>Approve &amp; post</Button>
                  <Button icon="edit" disabled={busy} onClick={() => setEditing(true)}>Edit</Button>
                  <Button icon="close" tone="danger" disabled={busy} onClick={onReject}>Reject</Button>
                </>
              )}
              {retryable && (
                <Button icon="refresh" disabled={busy} onClick={onApprove}>Try again</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

const MessageCard: React.FC<{
  msg: OwnerMessage; emailConnected: boolean; busy: boolean; onSend: () => void; onReject: () => void;
}> = ({ msg, emailConnected, busy, onSend, onReject }) => {
  const decidable = msg.status === 'draft';
  const mocked = (msg.meta as { mocked?: boolean } | null)?.mocked;
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <Pill tone="blue">{msg.channel}</Pill>
        <span className="text-[12px] text-slate-600">
          to <strong className="text-slate-900">{contactName(msg)}</strong>
          {msg.to_addr && <span className="text-slate-400"> · {msg.to_addr}</span>}
        </span>
        {mocked && <Pill tone="amber">placeholder text</Pill>}
        <span className="text-[11px] text-slate-400 ml-auto">{ago(msg.created_at)}</span>
      </div>
      <h3 className="font-display font-black text-base text-slate-900">{msg.subject ?? '(no subject)'}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap">{msg.body}</p>

      {!decidable && (
        <div className="mt-3">
          {msg.status === 'sent' || msg.status === 'delivered'
            ? <Pill tone="green">Sent {ago(msg.sent_at)}</Pill>
            : msg.status === 'queued'
            ? <Pill tone="blue">Sending</Pill>
            : <Pill tone="red">Not sent: {msg.error ?? 'failed'}</Pill>}
        </div>
      )}

      {decidable && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            icon="send" tone="primary" disabled={busy || !emailConnected} onClick={onSend}
            title={emailConnected ? undefined : 'Connect an email provider (SendGrid) first'}
          >
            Send
          </Button>
          <Button icon="close" tone="danger" disabled={busy} onClick={onReject}>Reject</Button>
          {!emailConnected && (
            <span className="text-[11px] text-amber-800">
              No email account is connected yet, so Send is off. The draft is kept.
            </span>
          )}
        </div>
      )}
    </article>
  );
};

export const MarketingQueue: React.FC = () => {
  const [q, setQ] = useState<Queue | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'bad'; text: string } | null>(null);

  const load = useCallback(async () => {
    const r = await fetchQueue();
    setQ(r);
    setFailed(r === null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const t = window.setInterval(() => { void load(); }, REFRESH_MS);
    return () => window.clearInterval(t);
  }, [load]);

  const act = useCallback(async (id: string, fn: () => Promise<unknown>, done: string) => {
    setBusyId(id);
    setNotice(null);
    try {
      await fn();
      setNotice({ tone: 'ok', text: done });
      await load();
    } catch (err) {
      setNotice({ tone: 'bad', text: err instanceof Error ? err.message : String(err) });
    } finally {
      setBusyId(null);
    }
  }, [load]);

  const groups = useMemo(() => {
    const items = q?.items ?? [];
    const msgs = q?.messages ?? [];
    return {
      waiting: items.filter((i) => i.status === 'pending_approval'),
      inFlight: items.filter((i) => i.status === 'approved' || i.status === 'scheduled'),
      done: items.filter((i) => i.status === 'published' || i.status === 'failed').slice(0, 12),
      drafts: msgs.filter((m) => m.status === 'draft'),
      sentOrFailed: msgs.filter((m) => m.status !== 'draft').slice(0, 8),
    };
  }, [q]);

  if (loading) {
    return (
      <section className="mb-10 bg-white border border-slate-200 rounded-2xl shadow-md p-6">
        <p className="text-xs text-slate-500">Fetching the queue…</p>
      </section>
    );
  }

  if (failed || !q) {
    return (
      <section className="mb-10 bg-white border border-slate-200 rounded-2xl shadow-md p-6">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="material-symbols-outlined text-amber-600 text-lg shrink-0" aria-hidden="true">cloud_off</span>
          <div className="text-[12px] leading-relaxed text-amber-900">
            <strong className="font-bold">Couldn't reach the queue.</strong> This panel asks the server
            for the drafts waiting on you, and that request failed. Try again, or sign in afresh.
          </div>
        </div>
      </section>
    );
  }

  const label = (key: string) => q.channels[key] ?? key;
  const waitingCount = groups.waiting.length + groups.drafts.length;

  return (
    <section className="mb-10 space-y-6">
      {/* ---- the answer, first ---- */}
      <div className={`rounded-2xl border p-5 shadow-md ${waitingCount ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-300'}`}>
        <div className="flex items-start gap-3">
          <span className={`material-symbols-outlined text-2xl shrink-0 ${waitingCount ? 'text-amber-700' : 'text-emerald-700'}`} aria-hidden="true">
            {waitingCount ? 'campaign' : 'check_circle'}
          </span>
          <div>
            <h2 className={`font-display font-black text-xl ${waitingCount ? 'text-amber-900' : 'text-emerald-900'}`}>
              {waitingCount
                ? `${waitingCount} item${waitingCount === 1 ? '' : 's'} waiting for your approval`
                : 'Nothing waiting on you'}
            </h2>
            <p className="text-xs text-slate-600 pt-1">
              Nothing the system writes goes out until you approve it here. Refreshes every minute.
            </p>
          </div>
        </div>
      </div>

      {notice && (
        <div role="status" className={`rounded-xl border px-4 py-3 text-[12px] ${
          notice.tone === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-900'
        }`}>
          {notice.text}
        </div>
      )}

      {/* ---- decisions ---- */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
          Posts &amp; videos waiting for you <span className="text-slate-400">({groups.waiting.length})</span>
        </h3>
        {groups.waiting.length === 0 && (
          <p className="text-[12px] text-slate-500 italic">No drafts waiting. The planner runs every morning at 8:00.</p>
        )}
        {groups.waiting.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            channelLabel={label(item.channel)}
            busy={busyId === item.id}
            onApprove={() => { void act(item.id, () => approveContent(item.id), 'Approved. It is being posted now.'); }}
            onReject={() => { void act(item.id, () => rejectContent(item.id), 'Rejected. It will not be posted.'); }}
            onSave={async (patch) => { await act(item.id, () => updateContent(item.id, patch), 'Saved.'); }}
          />
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
          Lead follow-ups waiting for you <span className="text-slate-400">({groups.drafts.length})</span>
        </h3>
        {groups.drafts.length === 0 && (
          <p className="text-[12px] text-slate-500 italic">No follow-ups drafted. New enquiries get one within the hour.</p>
        )}
        {groups.drafts.map((m) => (
          <MessageCard
            key={m.id}
            msg={m}
            emailConnected={q.emailConnected}
            busy={busyId === m.id}
            onSend={() => { void act(m.id, () => sendMessage(m.id), 'Queued to send.'); }}
            onReject={() => { void act(m.id, () => rejectMessage(m.id), 'Rejected. It will not be sent.'); }}
          />
        ))}
      </div>

      {/* ---- in flight, then history ---- */}
      {groups.inFlight.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Posting now</h3>
          {groups.inFlight.map((item) => (
            <ContentCard key={item.id} item={item} channelLabel={label(item.channel)} busy
              onApprove={() => {}} onReject={() => {}} onSave={async () => {}} />
          ))}
        </div>
      )}

      {(groups.done.length > 0 || groups.sentOrFailed.length > 0) && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Recently decided</h3>
          {groups.done.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              channelLabel={label(item.channel)}
              busy={busyId === item.id}
              onApprove={() => { void act(item.id, () => approveContent(item.id), 'Trying again.'); }}
              onReject={() => {}}
              onSave={async () => {}}
            />
          ))}
          {groups.sentOrFailed.map((m) => (
            <MessageCard key={m.id} msg={m} emailConnected={q.emailConnected} busy onSend={() => {}} onReject={() => {}} />
          ))}
        </div>
      )}
    </section>
  );
};
