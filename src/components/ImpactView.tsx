import { SaveToListButton } from './SaveToListButton';
import React, { useState } from 'react';
import { TabType, PortfolioItem } from '../types';
import { PORTFOLIO } from '../data/mockData';
import { useImageOverrides, resolveImage } from '../lib/imageStore';
import { ImageWithFallback } from './ImageWithFallback';
import { ConceptModal } from './ConceptModal';

interface ImpactViewProps {
  onTabChange: (tab: TabType) => void;
  onOpenBookModal: () => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({ onTabChange, onOpenBookModal }) => {
  const [filter, setFilter] = useState<'all' | 'systems' | 'dashboards' | 'web_design' | 'app_design' | 'logo_brand'>('all');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);
  // The detail panel's picture opens full screen; a concept with no picture stays inert.

  // Re-render when the owner updates any managed image from the Photo Control portal.
  useImageOverrides();

  const filteredPortfolio = filter === 'all'
    ? PORTFOLIO
    : PORTFOLIO.filter(p => p.category === filter);

  return (
    <main className="pt-24 pb-24 md:pb-16 px-4 md:px-12 max-w-[1440px] mx-auto animate-fadeIn bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="mb-10 max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-800 rounded-full text-xs font-bold uppercase tracking-widest">
          <span className="material-symbols-outlined text-sm">photo_library</span>
          Concept &amp; Sample Work
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 font-extrabold leading-tight tracking-tight">
          Web, app &amp; brand concepts
        </h1>
        <p className="font-body text-base md:text-lg text-slate-600 leading-relaxed">
          Representative concepts across web, mobile, dashboards, and brand identity. Client case studies are shared on request.
        </p>
      </section>

      {/* Filter Category Bar */}
      <section className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'all', label: 'All Projects', icon: 'apps' },
          { id: 'web_design', label: 'Web Design', icon: 'language' },
          { id: 'app_design', label: 'Mobile Apps', icon: 'phone_iphone' },
          { id: 'systems', label: 'Business Systems', icon: 'account_tree' },
          { id: 'dashboards', label: 'Dashboards', icon: 'dashboard' },
          { id: 'logo_brand', label: 'Logo & Branding', icon: 'draw' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              filter === cat.id
                ? 'bg-[#0f172a] text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-base">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </section>

      {/* Portfolio Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredPortfolio.map((item) => (
          /* One card, three things a visitor can do: save it, open the real
             thing, or read the concept. Those used to be split across two
             pages — the demo only on the home page, saving only here — so
             someone had to leave the page they were on to do the other half.
             The card body is no longer the <button> it was: a link cannot be
             nested inside a button, which is exactly why the demo could not
             live here before. The body is the concept trigger; the actions are
             its siblings. */
          <div key={item.id} className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all group flex flex-col">
          <SaveToListButton
            variant="compact"
            className="absolute top-3 right-3 z-10"
            item={{ id: item.id, kind: 'work', title: item.title, subtitle: item.categoryLabel, explainerId: item.explainerId, image: resolveImage(item.id, item.image) }}
          />
          <button
            type="button"
            onClick={() => setActiveItem(item)}
            aria-label={`View concept: ${item.title}`}
            className="text-left w-full flex-1"
          >
            <div>
              <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
                <ImageWithFallback
                  frame
                  src={resolveImage(item.id, item.image)}
                  alt={item.title}
                  icon="palette"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                />
                <div className="absolute top-3 left-3 bg-slate-900 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                  {item.categoryLabel}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                  <span>{item.client}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider">{item.year}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="font-body text-xs text-slate-600 leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.highlights.map((h, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-md">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </button>

          {/* Stacked, not side by side: at three columns "Open the working
              demo" and "View concept" side by side both wrap to two lines. */}
          <div className="p-6 pt-0 space-y-2">
            {item.demo && (
              <a
                href={item.demo}
                className="w-full py-2.5 bg-[#0f172a] text-white font-body font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">open_in_new</span>
                Open the working demo
              </a>
            )}
            <button
              type="button"
              onClick={() => setActiveItem(item)}
              className="w-full py-2.5 bg-slate-50 text-slate-900 font-body font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
            >
              View concept
              <span className="material-symbols-outlined text-sm" aria-hidden="true">visibility</span>
            </button>
          </div>
          </div>
        ))}
      </section>

      <ConceptModal
        item={activeItem}
        onClose={() => setActiveItem(null)}
        onBook={() => onTabChange('booking')}
      />

      {/* Banner CTA */}
      <section className="bg-[#0f172a] text-white rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-xl">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
          Start with a conversation, not a price tag
        </h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Book a one-to-one call and we'll turn your web, app, dashboard, or brand goals into a
          written quote that itemises every line — once we understand what the work actually is.
        </p>
        <button
          onClick={() => onTabChange('booking')}
          className="px-8 py-3.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-blue-500 transition-all shadow-md"
        >
          Book a Design Appointment
        </button>
      </section>

    </main>
  );
};
