import React, { useState } from 'react';
import { TabType, PortfolioItem } from '../types';
import { PORTFOLIO } from '../data/mockData';
import { useImageOverrides, resolveImage } from '../lib/imageStore';
import { ImageWithFallback } from './ImageWithFallback';
import { Lightbox } from './Lightbox';

interface ImpactViewProps {
  onTabChange: (tab: TabType) => void;
  onOpenBookModal: () => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({ onTabChange, onOpenBookModal }) => {
  const [filter, setFilter] = useState<'all' | 'systems' | 'dashboards' | 'web_design' | 'app_design' | 'logo_brand'>('all');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);
  // The detail panel's picture opens full screen; a concept with no picture stays inert.
  const [zoomed, setZoomed] = useState(false);

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
          { id: 'systems', label: 'Agentic Systems', icon: 'account_tree' },
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
          <button
            type="button"
            key={item.id}
            onClick={() => { setZoomed(false); setActiveItem(item); }}
            aria-label={`View concept: ${item.title}`}
            className="text-left w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between"
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
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] uppercase tracking-wider">{item.year}</span>
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

            <div className="p-6 pt-0">
              <span
                className="w-full py-2.5 bg-slate-50 text-slate-900 font-body font-bold text-xs uppercase tracking-wider rounded-lg group-hover:bg-[#0f172a] group-hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                View concept
                <span className="material-symbols-outlined text-sm">visibility</span>
              </span>
            </div>
          </button>
        ))}
      </section>

      {/* Case Study Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 relative border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="space-y-4">
              <div className="inline-block bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {activeItem.categoryLabel}
              </div>

              <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
                {activeItem.title}
              </h2>

              <div
                {...(resolveImage(activeItem.id, activeItem.image)
                  ? {
                      role: 'button' as const,
                      tabIndex: 0,
                      'aria-label': `View ${activeItem.title} full screen`,
                      onClick: () => setZoomed(true),
                      onKeyDown: (e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setZoomed(true); }
                      },
                      className: 'aspect-video w-full rounded-xl overflow-hidden bg-slate-900 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600',
                    }
                  : { className: 'aspect-video w-full rounded-xl overflow-hidden bg-slate-900' })}
              >
                <ImageWithFallback
                  frame
                  src={resolveImage(activeItem.id, activeItem.image)}
                  alt={activeItem.title}
                  icon="palette"
                  label={activeItem.categoryLabel}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 font-bold border-b border-slate-100 pb-3">
                <span>Sector: {activeItem.client}</span>
                <span>{activeItem.year}</span>
              </div>

              <p className="font-body text-slate-700 text-sm leading-relaxed">
                {activeItem.summary} This concept demonstrates our approach — clean visual hierarchy, responsive layout, and scalable front-end architecture.
              </p>

              <div className="space-y-2">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900">
                  Project Technical Highlights:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeItem.highlights.map((h, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg">
                      • {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setActiveItem(null);
                    onTabChange('booking');
                  }}
                  className="w-full py-3 bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  Book Appointment for Similar Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
      {activeItem && (
        <Lightbox
          items={[{ src: resolveImage(activeItem.id, activeItem.image), alt: activeItem.title, caption: `${activeItem.title} — ${activeItem.categoryLabel}` }]}
          index={zoomed ? 0 : null}
          onClose={() => setZoomed(false)}
          onIndexChange={() => {}}
        />
      )}

    </main>
  );
};
