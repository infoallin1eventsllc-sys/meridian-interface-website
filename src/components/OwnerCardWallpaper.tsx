import React, { useState } from 'react';
import { getImageOverrides, useImageOverrides, applyServerOverrides, fileToBase64 } from '../lib/imageStore';
import { publishImageUrl, publishImageFile } from '../lib/ownerStore';
import {
  CARD_BACKGROUND_KEY,
  CARD_BACKGROUNDS,
  CARD_DEFAULT_STEM,
  cardBackgroundStem,
  cardBackgroundUrl,
} from '../data/cardBackgrounds';

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/**
 * Card wallpaper: the background of the digital business card at /card/.
 *
 * Like changing a phone's wallpaper: the owner picks one here and every visitor
 * sees it. Visitors have no control over it. Each choice waits for the server
 * to confirm before saying it is live, the same rule as the rest of Photo
 * Control.
 */
export const OwnerCardWallpaper: React.FC = () => {
  useImageOverrides();
  const current = getImageOverrides()[CARD_BACKGROUND_KEY]?.trim() ?? '';
  const liveStem = current ? cardBackgroundStem(current) : CARD_DEFAULT_STEM;
  const isUpload = !!current && !liveStem;
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const run = async (work: () => Promise<Record<string, string>>, done: string) => {
    setBusy(true);
    setMsg(null);
    try {
      applyServerOverrides(await work());
      setMsg({ type: 'ok', text: done });
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : 'That did not save. Try again.' });
    } finally {
      setBusy(false);
    }
  };

  const choose = (stem: string, label: string) =>
    run(() => publishImageUrl(CARD_BACKGROUND_KEY, cardBackgroundUrl(stem)), `${label} is now your card wallpaper.`);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setMsg({ type: 'err', text: 'That file is over 8 MB. Resize it and try again.' });
      return;
    }
    const base64 = await fileToBase64(file);
    await run(
      async () => (await publishImageFile(CARD_BACKGROUND_KEY, base64, file.type)).overrides,
      'Your photo is now your card wallpaper.',
    );
  };

  return (
    <div className="space-y-4 border-b border-slate-200 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600">
            <span className="material-symbols-outlined text-sm">palette</span>
            Card wallpaper
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900">Your digital business card</h2>
          <p className="font-body text-sm text-slate-500 leading-relaxed max-w-2xl">
            Pick the background people see when they open your card. It changes for everyone right
            away. Only you can change it.
          </p>
        </div>
        <a
          href="/card/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 hover:border-slate-900"
        >
          <span className="material-symbols-outlined text-sm">visibility</span>
          Open my card
        </a>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CARD_BACKGROUNDS.map((b) => {
          const live = !isUpload && liveStem === b.stem;
          const label = b.colour === 'Blue' ? b.name : `${b.name}, ${b.colour}`;
          return (
            <button
              key={b.stem}
              type="button"
              disabled={busy || live}
              onClick={() => void choose(b.stem, label)}
              aria-pressed={live}
              aria-label={`Use ${label} as my card wallpaper`}
              className={`text-left rounded-xl overflow-hidden border-2 transition-colors disabled:cursor-default ${
                live ? 'border-blue-600' : 'border-transparent hover:border-slate-300'
              }`}
            >
              <div className="relative aspect-[9/16] bg-slate-900">
                <img
                  src={`/card/bg/thumbs/${b.stem}.jpg`}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {live && (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    Live
                  </span>
                )}
              </div>
              <div className="px-1 pt-1.5 pb-1">
                <div className="text-[11px] font-bold text-slate-900 leading-tight">{b.name}</div>
                <div className="text-[10px] text-slate-500">{b.colour}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer">
          <span className="material-symbols-outlined text-sm">upload</span>
          {busy ? 'Working…' : 'Use my own photo'}
          <input type="file" accept="image/*" onChange={onFile} disabled={busy} className="hidden" />
        </label>
        {isUpload && <span className="text-xs font-semibold text-blue-700">Your own photo is live.</span>}
        <button
          type="button"
          disabled={busy || !current}
          onClick={() => void run(() => publishImageUrl(CARD_BACKGROUND_KEY, ''), 'Back to the default, Blue Ribbon.')}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          Reset to default
        </button>
      </div>

      {msg && (
        <p className={`text-xs font-semibold ${msg.type === 'ok' ? 'text-blue-700' : 'text-red-600'}`}>{msg.text}</p>
      )}
    </div>
  );
};
