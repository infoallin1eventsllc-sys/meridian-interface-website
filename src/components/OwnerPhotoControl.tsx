import React, { useState } from 'react';
import { PORTFOLIO, HOTLINK_IMAGES } from '../data/mockData';
import {
  resolveImage,
  setImageOverride,
  clearImageOverride,
  getImageOverrides,
  useImageOverrides,
  fileToDataUrl,
} from '../lib/imageStore';

interface ManagedImage {
  id: string;
  label: string;
  sublabel: string;
  fallback: string;
}

const MAX_UPLOAD_BYTES = 1.5 * 1024 * 1024; // localStorage-safe ceiling for data-URL uploads

const ImageCard: React.FC<{ img: ManagedImage; isCustom: boolean }> = ({ img, isCustom }) => {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const current = resolveImage(img.id, img.fallback);

  const apply = (value: string) => {
    try {
      setImageOverride(img.id, value);
      setMsg({ type: 'ok', text: 'Image updated — the live site now shows it.' });
      setUrl('');
    } catch {
      setMsg({ type: 'err', text: 'Could not save. The image may be too large — try a smaller file or a hosted URL.' });
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setMsg({ type: 'err', text: 'File too large (max ~1.5 MB). Use a hosted image URL instead.' });
      return;
    }
    setBusy(true);
    try {
      apply(await fileToDataUrl(file));
    } catch {
      setMsg({ type: 'err', text: 'Could not read that file.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
      <div className="aspect-video bg-slate-900 relative">
        <img
          src={current}
          alt={img.label}
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden';
          }}
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
            disabled={!url.trim()}
            onClick={() => apply(url)}
            className="px-3 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Update
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <label className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-sm">upload</span>
            {busy ? 'Uploading…' : 'Upload file'}
            <input type="file" accept="image/*" onChange={onFile} disabled={busy} className="hidden" />
          </label>
          <button
            type="button"
            disabled={!isCustom}
            onClick={() => {
              clearImageOverride(img.id);
              setMsg({ type: 'ok', text: 'Reverted to the default image.' });
            }}
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
    },
    ...PORTFOLIO.map((p) => ({
      id: p.id,
      label: p.title,
      sublabel: `${p.categoryLabel} · portfolio image`,
      fallback: p.image,
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
            file. Changes apply to the live site immediately. Uploaded files are stored in this browser
            (max ~1.5&nbsp;MB each); hosted URLs are recommended.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Custom Images</div>
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
