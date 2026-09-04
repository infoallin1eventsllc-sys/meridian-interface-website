import React, { useState } from 'react';
import { TabType, ServiceCategory } from '../types';
import { SERVICES, PORTFOLIO, HOTLINK_IMAGES } from '../data/mockData';
import { useImageOverrides, resolveImage } from '../lib/imageStore';
import { HeroBackdrop } from './HeroBackdrop';
import { ImageWithFallback } from './ImageWithFallback';
import { StackPlannerFeature } from './StackPlannerFeature';
import { Lightbox, type LightboxItem } from './Lightbox';

interface HomeViewProps {
  onTabChange: (tab: TabType) => void;
  onOpenBookModal: () => void;
  onQuickBookService?: (serviceId: ServiceCategory) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onTabChange,
  onOpenBookModal,
  onQuickBookService
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'web_design' | 'app_design' | 'dashboards' | 'logo_brand'>('all');

  // Re-render when the owner updates any managed image from the Photo Control portal.
  useImageOverrides();

  // Quick Inline Appointment Widget State
  const [quickService, setQuickService] = useState<ServiceCategory>('web_design');
  const [quickDate, setQuickDate] = useState('2026-08-05');
  const [quickTime, setQuickTime] = useState('10:00 AM - 11:00 AM EST');

  // The Stack Planner has its own section above this grid, because it is a
  // finished product and everything in the grid is a concept. Showing it twice
  // would also put a real 2026 build under a heading that says "concepts".
  const concepts = PORTFOLIO.filter(item => item.id !== 'p10');
  const filteredPortfolio = selectedCategory === 'all'
    ? concepts
    : concepts.filter(item => item.category === selectedCategory);

  // Only pieces that actually have a picture can be enlarged; an empty frame
  // opening to a bigger empty frame would be a worse experience than no zoom.
  // A piece with several screens contributes all of them, so a visitor can
  // arrow through the product rather than seeing one frame of it.
  // One set per piece, not one set for the whole grid: arrowing through
  // ORCHESTRA should walk its four screens, not wander into the next product,
  // and the counter should read "1 / 4" rather than "5 / 10".
  const screensFor = (item: typeof PORTFOLIO[number]): LightboxItem[] => {
    const cover = resolveImage(item.id, item.image);
    if (!cover) return [];
    if (!item.gallery?.length) return [{ src: cover, alt: item.title, caption: `${item.title} — ${item.categoryLabel}` }];
    return item.gallery.map((g) => ({ src: g.src, alt: `${item.title} — ${g.caption}`, caption: `${item.title} — ${g.caption}` }));
  };
  const [zoom, setZoom] = useState<{ items: LightboxItem[]; index: number } | null>(null);
  const openZoom = (item: typeof PORTFOLIO[number]) => {
    const items = screensFor(item);
    if (items.length) setZoom({ items, index: 0 });
  };

  const handleInlineBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (onQuickBookService) {
      onQuickBookService(quickService);
    } else {
      onTabChange('booking');
    }
  };

  return (
    <main className="pt-16 pb-24 md:pb-16 animate-fadeIn bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-center px-4 md:px-12 py-20 overflow-hidden bg-[#0f172a] border-b border-slate-800">
        {/* Full-bleed scene in slow orbit — photograph still owner-swappable via
            Photo Control; the motion layer never depends on what it shows. */}
        <HeroBackdrop imageUrl={resolveImage('hero', HOTLINK_IMAGES.globalEarthBg)} />

        <div className="hero-stagger relative z-10 max-w-[1200px] mx-auto w-full space-y-7">
          {/* Eyebrow — thin rule + label, no chips or pulsing dots */}
          <div className="inline-flex items-center gap-3 text-blue-400">
            <span className="h-px w-8 bg-blue-500" />
            <span className="font-body text-xs font-bold uppercase tracking-[0.22em]">
              Digital Design &amp; Development Studio
            </span>
          </div>

          {/* Brand + headline — one sharp, specific claim */}
          <div className="space-y-4 max-w-4xl">
            <span className="block font-display font-black uppercase tracking-[0.28em] text-slate-400 text-sm sm:text-base">
              Meridian Interface
            </span>
            <h1 className="font-display font-black leading-[1.05] tracking-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              Custom websites, apps, and dashboards.
              <span className="block text-blue-500">Designed and built end to end.</span>
            </h1>
          </div>

          <p className="font-body text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            We design and develop bespoke web experiences, mobile app interfaces, analytics &amp; CRM
            dashboards, and complete brand identities. Book a 1-on-1 consultation to start your project.
          </p>

          {/* Capability line — plain, no icon tiles */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <span>Web Design</span>
            <span className="text-slate-600">/</span>
            <span>App Interfaces</span>
            <span className="text-slate-600">/</span>
            <span>Analytics &amp; CRM Dashboards</span>
            <span className="text-slate-600">/</span>
            <span>Brand &amp; Logo</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-lg">
            <button
              onClick={() => onTabChange('booking')}
              className="w-full sm:w-auto px-7 py-4 bg-blue-600 text-white font-body font-bold text-xs uppercase tracking-widest rounded-lg text-center hover:bg-blue-500 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              Book a Design Appointment
            </button>
            <button
              onClick={() => onTabChange('portfolio')}
              className="w-full sm:w-auto px-7 py-4 bg-transparent border border-slate-600 text-white font-body font-bold text-xs uppercase tracking-widest rounded-lg text-center hover:bg-white/5 hover:border-slate-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">palette</span>
              View Our Work
            </button>
          </div>
        </div>
      </section>

      {/* Services Showcase Section */}
      <section className="mt-16 px-4 md:px-12 max-w-[1440px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-slate-500">
              Core Capabilities
            </p>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
              What We Design & Develop
            </h2>
          </div>
          <button
            onClick={() => onTabChange('services')}
            className="text-xs font-bold text-[#0f172a] hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            Explore All Services <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-slate-900">
                  <ImageWithFallback
                  frame
                    src={service.image}
                    alt={service.title}
                    icon={service.icon}
                    label={service.categoryName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-base text-[#0f172a]">{service.icon}</span>
                    {service.categoryName}
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-body text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {service.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    if (onQuickBookService) onQuickBookService(service.id);
                    else onTabChange('booking');
                  }}
                  className="w-full py-2.5 bg-slate-100 text-slate-900 font-body font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#0f172a] hover:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">event</span>
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <StackPlannerFeature onTabChange={onTabChange} />

      {/* Portfolio Showcase Grid (Selected Works) */}
      <section className="mt-20 px-4 md:px-12 max-w-[1440px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-blue-600">
              Concept &amp; Sample Work
            </p>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
              Web, app, dashboard &amp; brand concepts
            </h2>
            <p className="font-body text-sm text-slate-500 leading-relaxed">
              Representative concepts across our disciplines. Client case studies are shared on request.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'web_design', label: 'Web Design' },
              { id: 'app_design', label: 'App Design' },
              { id: 'dashboards', label: 'Dashboards (BI, CRM, Financial)' },
              { id: 'logo_brand', label: 'Logos & Brand' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-[#0f172a] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolio.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all group"
            >
              <div
                {...(screensFor(item).length
                  ? {
                      role: 'button' as const,
                      tabIndex: 0,
                      'aria-label': `View ${item.title} full screen`,
                      onClick: () => openZoom(item),
                      onKeyDown: (e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openZoom(item); }
                      },
                      className: 'aspect-video relative overflow-hidden bg-slate-900 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600',
                    }
                  : { className: 'aspect-video relative overflow-hidden bg-slate-900' })}
              >
                <ImageWithFallback
                  frame
                  src={resolveImage(item.id, item.image)}
                  alt={item.title}
                  icon="palette"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                />
                {screensFor(item).length > 0 && (
                  <span className="absolute inset-0 grid place-items-center bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-[11px] font-bold uppercase tracking-widest">
                      <span className="material-symbols-outlined text-base leading-none" aria-hidden="true">search</span>
                      {item.gallery?.length ? `See all ${item.gallery.length} screens` : 'Full screen'}
                    </span>
                  </span>
                )}
                <div className="absolute top-3 left-3 bg-slate-900 px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                  {item.categoryLabel}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                  <span>{item.client}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] uppercase tracking-wider">{item.year}</span>
                </div>

                <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="font-body text-xs text-slate-600 leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.highlights.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* A picture shows what it looks like; this lets them use it. */}
                {item.demo && (
                  <a
                    href={item.demo}
                    className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f172a] text-white font-body font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base leading-none" aria-hidden="true">open_in_new</span>
                    Open the working demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <Lightbox
          items={zoom?.items ?? []}
          index={zoom ? zoom.index : null}
          onClose={() => setZoom(null)}
          onIndexChange={(i) => setZoom((z) => (z ? { ...z, index: i } : z))}
        />
      </section>

      {/* Quick Interactive Appointment Scheduler Banner - Relocated under Selected Works */}
      <section className="mt-20 relative z-20 px-4 md:px-12 max-w-[1440px] mx-auto">
        <div className="bg-white rounded-xl shadow-xl border border-slate-200/80 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                Instant Scheduling
              </div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-slate-900">
                Book Your Design Consultation
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Select your required service, date, and preferred time slot to lock in a dedicated strategy session with our lead design directors.
            </p>
          </div>

          <form onSubmit={handleInlineBook} className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Design Service Needed
              </label>
              <div className="relative">
                <select
                  value={quickService}
                  onChange={(e) => setQuickService(e.target.value as ServiceCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-slate-900 transition-colors appearance-none"
                >
                  <option value="web_design">Web Design & Development</option>
                  <option value="app_design">Mobile App UI/UX Design</option>
                  <option value="dashboards">Data Analyst, CRM & Financial Dashboards</option>
                  <option value="logo_brand">Logo & Brand Identity</option>
                  <option value="full_package">Full Studio Package (Web+App+Dashboards+Logo)</option>
                </select>
                {/* Inline SVG rather than a Material Symbol. The self-hosted
                    subset font's cmap omits j, q, x and z, so the ligature
                    "e(x)pand_more" can never form and the browser painted the
                    literal word across the field. A drawn chevron cannot fail
                    that way. */}
                <svg
                  className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none"
                  viewBox="0 0 20 20" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 7.5 10 12.5 15 7.5" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Preferred Date
              </label>
              <input
                type="date"
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-slate-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Time Slot
              </label>
              <div className="relative">
                <select
                  value={quickTime}
                  onChange={(e) => setQuickTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-slate-900 transition-colors appearance-none"
                >
                  <option>10:00 AM - 11:00 AM EST</option>
                  <option>01:00 PM - 02:00 PM EST</option>
                  <option>03:30 PM - 04:30 PM EST</option>
                  <option>06:00 PM - 07:00 PM EST</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none text-xl">
                  schedule
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-[#0f172a] text-white py-3 px-4 font-body font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue Booking</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* What Every Engagement Includes */}
      <section className="mt-20 px-4 md:px-12 max-w-[1440px] mx-auto">
        <div className="bg-[#0f172a] text-white rounded-2xl p-8 md:p-12 space-y-10 shadow-xl">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              How We Work
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
              What every engagement includes
            </h2>
            <p className="font-body text-sm text-slate-300 leading-relaxed">
              A consistent, transparent process on every project — no surprises, no lock-in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'forum', title: '1-on-1 discovery', desc: 'A dedicated consultation to align on goals, references, and scope before any work begins.' },
              { icon: 'design_services', title: 'Prototypes first', desc: 'High-fidelity, interactive designs to review and refine before a line of code is written.' },
              { icon: 'folder_shared', title: 'Full ownership', desc: 'You receive the source files and complete rights to everything we produce for you.' },
              { icon: 'support_agent', title: 'Post-launch support', desc: 'We stay on after handover to make sure your site, app, or brand lands cleanly.' }
            ].map((item) => (
              <div key={item.title} className="space-y-3">
                <div className="w-11 h-11 rounded-lg bg-blue-600/15 text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h3 className="font-display font-bold text-base text-white">{item.title}</h3>
                <p className="font-body text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="mt-20 px-4 md:px-12 max-w-[1440px] mx-auto text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900">
            Ready to build your web, app, or logo?
          </h2>
          <p className="font-body text-slate-600 text-sm md:text-base">
            Book an appointment today. We'll discuss your goals, review visual references, and provide an actionable proposal.
          </p>
        </div>

        <button
          onClick={() => onTabChange('booking')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#0f172a] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">event</span>
          Schedule Design Appointment
        </button>
      </section>
    </main>
  );
};
