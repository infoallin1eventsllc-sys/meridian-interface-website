import React, { useState } from 'react';
import { PORTFOLIO, HOTLINK_IMAGES } from '../data/mockData';
import { ImageWithFallback } from './ImageWithFallback';
import {
  resolveImage,
  getImageOverrides,
  useImageOverrides,
  applyServerOverrides,
  fileToBase64,
} from '../lib/imageStore';
import { publishImageUrl, publishImageFile } from '../lib/ownerStore';

interface ManagedImage {
  id: string;
  label: string;
  sublabel: string;
  fallback: string;
  /** Material symbol shown on the blank panel while no image is set. */
  icon: string;
}

// Matches the bucket's own limit. Files go to storage now, not into a
// localStorage string, so the old ~1.5 MB ceiling no longer applies.
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const ImageCard: React.FC<{ img: ManagedImage; isCustom: boolean }> = ({ img, isCustom }) => {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const current = resolveImage(img.id, img.fallback);

  // Every one of these waits for the server to confirm before saying anything.
  // The previous version reported success the instant it wrote to localStorage,
  // which is how "the live site now shows it" came to be printed under an image
  // no visitor could see.
  const applyUrl = async (value: string) => {
    setBusy(true);
    setMsg(null);
    try {
      applyServerOverrides(await publishImageUrl(img.id, value));
      setMsg({ type: 'ok', text: 'Published. Every visitor sees this now.' });
      setUrl('');
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : 'Could not publish that image.' });
    } finally {
      setBusy(false);
    }
  };

  const revert = async () => {
    setBusy(true);
    setMsg(null);
    try {
      applyServerOverrides(await publishImageUrl(img.id, ''));
      setMsg({ type: 'ok', text: 'Reverted to the default, for everyone.' });
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : 'Could not revert that image.' });
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setMsg({ type: 'err', text: 'That file is over 8 MB — resize it and try again.' });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const base64 = await fileToBase64(file);
      const { overrides } = await publishImageFile(img.id, base64, file.type);
      applyServerOverrides(overrides);
      setMsg({ type: 'ok', text: 'Uploaded and published. Every visitor sees this now.' });
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : 'Could not upload that file.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
      <div className="aspect-video bg-slate-900 relative">
        {/* The same panel the public site shows for an unset image, rather than
            a bare <img src="">, which makes the browser re-request the page and
            renders as a broken icon. */}
        <ImageWithFallback
          src={current}
          alt={img.label}
          icon={img.icon}
          label={img.sublabel}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            isCustom ? 'bg-blue-600 text-white' : 'bg-slate-900/80 text-slate-200'
          }`}
        >
          {isCustom ? 'Custom' : 'Default'}
        </span>
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div>
          <h4 className="font-display font-bold text-sm text-slate-900 leading-tight">{img.label}</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">{img.sublabel}</p>
        </div>

        <div className="flex gap-2 mt-auto">
          <input
            type="url"
            inputMode="url"
            placeholder="Paste image URL…"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setMsg(null);
            }}
            className="flex-1 min-w-0 border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-slate-900"
          />
          <button
            type="button"
            disabled={!url.trim() || busy}
            onClick={() => void applyUrl(url)}
            className="px-3 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? 'Saving…' : 'Update'}
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <label className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-sm">upload</span>
            {busy ? 'Working…' : 'Upload file'}
            <input type="file" accept="image/*" onChange={onFile} disabled={busy} className="hidden" />
          </label>
          <button
            type="button"
            disabled={!isCustom || busy}
            onClick={() => void revert()}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            Reset
          </button>
        </div>

        {msg && (
          <p className={`text-[11px] font-semibold ${msg.type === 'ok' ? 'text-blue-700' : 'text-red-600'}`}>
            {msg.text}
          </p>
        )}
      </div>
    </div>
  );
};

export const OwnerPhotoControl: React.FC = () => {
  useImageOverrides();
  const overrides = getImageOverrides();

  const managed: ManagedImage[] = [
    {
      id: 'hero',
      label: 'Homepage Hero Image',
      sublabel: 'Background image behind the homepage headline',
      fallback: HOTLINK_IMAGES.globalEarthBg,
      icon: 'landscape',
    },
    ...PORTFOLIO.map((p) => ({
      id: p.id,
      label: p.title,
      sublabel: p.categoryLabel,
      fallback: p.image,
      icon: 'palette',
    })),
  ];

  const customCount = managed.filter((m) => overrides[m.id]?.trim()).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600">
            <span className="material-symbols-outlined text-sm">photo_camera</span>
            Photo Control
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900">Manage site images</h2>
          <p className="font-body text-sm text-slate-500 leading-relaxed max-w-2xl">
            Update the homepage hero and every portfolio image by pasting an image URL or uploading a
            file (up to 8&nbsp;MB). Changes are published to the live site for every visitor, on every
            device — not just this browser.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Published</div>
          <div className="font-display font-black text-2xl text-slate-900">
            {customCount}<span className="text-slate-400 text-base"> / {managed.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {managed.map((img) => (
          <ImageCard key={img.id} img={img} isCustom={!!overrides[img.id]?.trim()} />
        ))}
      </div>
    </section>
  );
};
