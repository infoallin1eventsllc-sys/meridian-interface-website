import React, { useEffect, useState } from 'react';
import { PortfolioItem } from '../types';
import { resolveImage } from '../lib/imageStore';
import { ImageWithFallback } from './ImageWithFallback';
import { Lightbox, type LightboxItem } from './Lightbox';
import { ReelPlayer } from './ReelPlayer';
import { SaveToListButton } from './SaveToListButton';

/**
 * The concept panel — one piece, everything a visitor can do with it.
 *
 * It lived inside the Portfolio page, which meant the front page could show a
 * piece but not open it: someone browsing the demos on the home page had no way
 * to reach the write-up, the highlights, or the Book button without changing
 * page first. Otis asked for it in both places, so it moved out here rather
 * than being copied — a second copy is a second thing to forget to change.
 *
 * It owns its own zoom state, so a caller only has to say which piece is open.
 */
export const ConceptModal: React.FC<{
  item: PortfolioItem | null;
  onClose: () => void;
  /** Take the visitor to booking. The panel closes itself first. */
  onBook: () => void;
}> = ({ item, onClose, onBook }) => {
  const [zoomed, setZoomed] = useState<number | null>(null);

  // Escape closes the panel, unless the full-screen view is open on top of it,
  // in which case the Lightbox handles Escape and the panel stays.
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && zoomed === null) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, zoomed, onClose]);

  if (!item) return null;

  return (
    <>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div role="dialog" aria-modal="true" aria-label={item.title} className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 relative border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="space-y-4">
              <div className="inline-block bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {item.categoryLabel}
              </div>

              <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
                {item.title}
              </h2>

              {/* A piece with a film plays it here. Moving work makes its own
                  case better than a screenshot of it does, and the still is
                  still reachable through the grid behind this panel. */}
              {item.video ? (
                <ReelPlayer src={item.video} label={`Watch ${item.title}`} />
              ) : (
                <div
                  {...(resolveImage(item.id, item.image)
                    ? {
                        role: 'button' as const,
                        tabIndex: 0,
                        'aria-label': `View ${item.title} full screen`,
                        onClick: () => setZoomed(0),
                        onKeyDown: (e: React.KeyboardEvent) => {
                          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setZoomed(0); }
                        },
                        className: 'aspect-video w-full rounded-xl overflow-hidden bg-slate-900 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600',
                      }
                    : { className: 'aspect-video w-full rounded-xl overflow-hidden bg-slate-900' })}
                >
                  <ImageWithFallback
                    frame
                    src={resolveImage(item.id, item.image)}
                    alt={item.title}
                    icon="palette"
                    label={item.categoryLabel}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {item.demo && (
                <a
                  href={item.demo}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0f172a] text-white font-body font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors self-start"
                >
                  <span className="material-symbols-outlined text-lg leading-none" aria-hidden="true">open_in_new</span>
                  Open the working demo
                </a>
              )}

              <div className="flex justify-between items-center text-xs text-slate-500 font-bold border-b border-slate-100 pb-3">
                <span>Sector: {item.client}</span>
                <span>{item.year}</span>
              </div>

              {/* Just the piece's own words. This used to append "clean visual
                  hierarchy, responsive layout, and scalable front-end
                  architecture" to EVERY concept - true of none of them in
                  particular, and plainly wrong under an agent system that has
                  no front end to speak of. */}
              <p className="font-body text-slate-700 text-sm leading-relaxed">
                {item.summary}
              </p>

              <div className="space-y-2">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900">
                  What it gives you:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.highlights.map((h, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg">
                      • {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 border-t border-slate-100">
                {/* Saving is the lower-commitment of the two, and the one most
                    people want after looking at a single piece: keep it first
                    and quiet, with booking beside it for anyone already sure. */}
                <SaveToListButton
                  className="w-full sm:flex-1"
                  item={{
                    id: item.id,
                    kind: 'work',
                    title: item.title,
                    subtitle: item.categoryLabel,
                    explainerId: item.explainerId,
                    image: resolveImage(item.id, item.image),
                  }}
                />
                <button
                  onClick={() => {
                    onClose();
                    onBook();
                  }}
                  className="w-full sm:flex-1 py-3 bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  Book an appointment
                </button>
              </div>
            </div>
          </div>
        </div>

              <Lightbox
          items={
            (item.gallery?.length
              ? item.gallery.map((g) => ({ src: g.src, alt: `${item.title} — ${g.caption}`, caption: `${item.title} — ${g.caption}` }))
              : [{ src: resolveImage(item.id, item.image), alt: item.title, caption: `${item.title} — ${item.categoryLabel}` }]) as LightboxItem[]
          }
          index={zoomed}
          onClose={() => setZoomed(null)}
          onIndexChange={setZoomed}
        />
    </>
  );
};
