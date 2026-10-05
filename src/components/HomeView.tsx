import React, { useState } from 'react';
import { TabType, ServiceCategory } from '../types';
import { SERVICES, PORTFOLIO } from '../data/mockData';
import { useImageOverrides, resolveImage } from '../lib/imageStore';
import { HeroBackdrop } from './HeroBackdrop';
import { HeroShowcase } from './HeroShowcase';
import { ImageWithFallback } from './ImageWithFallback';
import { StackPlannerFeature } from './StackPlannerFeature';
import { Lightbox, type LightboxItem } from './Lightbox';
import { StudioReelCard } from './StudioReelCard';
import { SaveToListButton } from './SaveToListButton';
import { ConceptModal } from './ConceptModal';

interface HomeViewProps {
  onTabChange: (tab: TabType) => void;
  onOpenBookModal: () => void;
  /** Open the Services page on this service. */
  onViewService: (serviceId: ServiceCategory) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onTabChange,
  onOpenBookModal,
  onViewService
}) => {
  const [concept, setConcept] = useState<typeof PORTFOLIO[number] | null>(null);

  // Re-render when the owner updates any managed image from the Photo Control portal.
  useImageOverrides();

  // The Stack Planner has its own section above this grid, because it is a
  // finished product and everything in the grid is a concept. Showing it twice
  // would also put a real 2026 build under a heading that says "concepts".
  //
  // The home page shows three, not the whole portfolio: every card here used
  // to appear word for word on the Portfolio page too. Three kinds of work,
  // a console, a dashboard and a business website. Change the ids to change
  // the picks; the Portfolio page always shows everything.
  const FEATURED_IDS = ['p11', 'p1', 'p2'];
  const featured = FEATURED_IDS
    .map((id) => PORTFOLIO.find((item) => item.id === id))
    .filter((item): item is typeof PORTFOLIO[number] => Boolean(item));
  const portfolioCount = PORTFOLIO.length;

  // Only pieces that actually have a picture can be enlarged; an empty frame
  // opening to a bigger empty frame would be a worse experience than no zoom.
  // A piece with several screens contributes all of them, so a visitor can
  // arrow through the product rather than seeing one frame of it.
  // One set per piece, not one set for the whole grid: arrowing through
  // CarePulse should walk its four screens, not wander into the next product,
  // and the counter should read "1 / 4" rather than "5 / 10".
  const screensFor = (item: typeof PORTFOLIO[number]): LightboxItem[] => {
    const cover = resolveImage(item.id, item.image);
    if (!cover) return [];
    if (!item.gallery?.length) return [{ src: cover, alt: item.title, caption: `${item.title} (${item.categoryLabel})` }];
    return item.gallery.map((g) => ({ src: g.src, alt: `${item.title}. ${g.caption}`, caption: `${item.title}. ${g.caption}` }));
  };
  const [zoom, setZoom] = useState<{ items: LightboxItem[]; index: number } | null>(null);
  const openZoom = (item: typeof PORTFOLIO[number]) => {
    const items = screensFor(item);
    if (items.length) setZoom({ items, index: 0 });
  };

  return (
    <main className="pt-16 pb-24 md:pb-16 animate-fadeIn bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-center px-4 md:px-12 py-16 lg:py-20 overflow-hidden bg-[#0f172a] border-b border-slate-800">
        {/* Full-bleed wireframe globe, drawn in the browser. It carries its own
            ground, so there is no hero photograph to resolve or wait on. */}
        <HeroBackdrop />

        <div className="relative z-10 max-w-[1280px] mx-auto w-full grid gap-14 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] items-center">
          <div className="hero-stagger space-y-7">
            {/* Eyebrow — thin rule + label. The header already carries the name,
                so the hero does not say "Meridian Interface" a second time. */}
            <div className="inline-flex items-center gap-3 text-blue-400">
              <span className="h-px w-8 bg-blue-500" />
              <span className="font-body text-xs font-bold uppercase tracking-[0.22em]">
                Design &amp; development studio
              </span>
            </div>

            {/* The same two lines the studio reel closes on, so the film and the
                front door say one thing. */}
            <h1 className="font-display font-black leading-[1.04] tracking-tight text-white text-[2.5rem] sm:text-5xl lg:text-[3.4rem] xl:text-[4rem]">
              Websites, apps, and AI&nbsp;systems.
              <span className="block mt-1 text-blue-500">We put the future in your&nbsp;hands.</span>
            </h1>

            <p className="font-body text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              One studio, start to finish: your brand, the website customers find, the app they order
              from, the dashboard you run the business on, and the systems that follow up while you work.
              Every project starts with a 1-on-1 consultation.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => onTabChange('booking')}
                className="w-full sm:w-auto px-7 py-4 bg-blue-600 text-white font-body font-bold text-xs uppercase tracking-widest rounded-lg text-center hover:bg-blue-500 active:scale-[0.98] transition-all shadow-lg shadow-blue-950/40 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">calendar_month</span>
                Book a consultation
              </button>
              <button
                onClick={() => onTabChange('portfolio')}
                className="group w-full sm:w-auto px-7 py-4 bg-transparent border border-slate-600 text-white font-body font-bold text-xs uppercase tracking-widest rounded-lg text-center hover:bg-white/5 hover:border-slate-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Try the working demos
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-0.5" aria-hidden="true">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Real work, not a stock picture: three of the demos, each opening its concept panel. */}
          <HeroShowcase onOpen={setConcept} />
        </div>
      </section>

      {/* Portfolio Showcase Grid (Selected Works) */}
      <section className="mt-20 px-4 md:px-12 max-w-[1440px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-blue-600">
              Working demos: open any of them
            </p>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
              See what we build, before you ask for anything
            </h2>
            <p className="font-body text-sm text-slate-500 leading-relaxed">
              Three of our working demos. Every one is real: click in and use it.
              Yours is built to your brief, at your size, in your colours. Save the
              ones close to what you need and send them over.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onTabChange('portfolio')}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-body font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            See all {portfolioCount} projects
            <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((item) => (
            <div
              key={item.id}
              className="relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all group"
            >
              {/* Saving used to be possible only on the Portfolio page, and
                  opening the demo only here, so a visitor had to cross pages to
                  do both. Same control, same corner, on both. */}
              <SaveToListButton
                variant="compact"
                className="absolute top-3 right-3 z-10"
                item={{ id: item.id, kind: 'work', title: item.title, subtitle: item.categoryLabel, explainerId: item.explainerId, image: resolveImage(item.id, item.image) }}
              />
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
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider">{item.year}</span>
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

                {/* A picture shows what it looks like; the demo lets them use
                    it; the concept panel is where the write-up, the highlights,
                    Save and Book live. The front page used to offer only the
                    middle one, so someone had to change page to read about a
                    piece or book off the back of it. */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {item.demo && (
                    <a
                      href={item.demo}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f172a] text-white font-body font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base leading-none" aria-hidden="true">open_in_new</span>
                      Open the working demo
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setConcept(item)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-50 text-slate-900 font-body font-bold text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-colors"
                  >
                    View concept
                    <span className="material-symbols-outlined text-base leading-none" aria-hidden="true">visibility</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ConceptModal
          item={concept}
          onClose={() => setConcept(null)}
          onBook={() => onTabChange('booking')}
        />

        <Lightbox
          items={zoom?.items ?? []}
          index={zoom ? zoom.index : null}
          onClose={() => setZoom(null)}
          onIndexChange={(i) => setZoom((z) => (z ? { ...z, index: i } : z))}
        />
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
                {/* Opens this service on the Services page. It used to be a
                    sixth identical "Book appointment" button in one row. */}
                <button
                  type="button"
                  onClick={() => onViewService(service.id)}
                  aria-label={`See ${service.title}`}
                  className="w-full py-2.5 bg-slate-100 text-slate-900 font-body font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#0f172a] hover:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  See this service
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}

          {/* Six services leave two empty cells on a large screen. The reel
              closes the row, and says in half a minute what the cards above
              describe in words. */}
          <StudioReelCard onTabChange={onTabChange} />
        </div>
      </section>

      {/* How we work, in one line. The full version is the 4-step process on
          the Services page; this used to be a second version of it with its
          own wording, and a third sat in the Services sidebar. */}
      <section className="mt-16 px-4 md:px-12 max-w-[1440px] mx-auto">
        <div className="bg-[#0f172a] text-white rounded-2xl px-6 py-6 md:px-10 md:py-7 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <p className="font-body text-sm md:text-base text-slate-200 leading-relaxed">
            <span className="font-display font-bold text-white">Every project runs the same four steps:</span>{' '}
            consultation, design you review, build, then launch with support after.
          </p>
          <button
            type="button"
            onClick={() => {
              onTabChange('services');
              window.setTimeout(() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 450);
            }}
            className="self-start md:self-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-300 hover:text-white whitespace-nowrap"
          >
            How we work
            <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* The Stack Planner is the deepest thing on this page and the least
          urgent for a first-time visitor, so it sits last: for someone still
          reading after the demos, the services and the scheduler. */}
      <StackPlannerFeature onTabChange={onTabChange} />

      {/* Questions people ask before they book. Every answer restates something
          the site already commits to elsewhere (the quote on the booking page,
          the 4-step process on Services, timelines on the service cards), so
          it cannot drift into promising more than the studio does. Ownership is
          stated here and nowhere else on the page. Native
          details/summary: keyboard and screen-reader support for free, no JS. */}
      <section id="faq" className="mt-20 px-4 md:px-12 max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Questions</span>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">Before you book</h2>
        </div>
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {[
            {
              q: 'How much will my project cost?',
              a: 'Every project gets a written quote that itemises each line and says what it does and does not include. We write it after we understand what you need, because a price given before that is a guess. Nothing is owed until you have seen the quote and agreed to it.',
            },
            {
              q: 'How long does it take?',
              a: 'A logo and visual identity takes 3 to 7 days. Websites and dashboards usually take 1 to 3 weeks, and mobile apps 2 to 4 weeks. Your quote gives the timeline for your project.',
            },
            {
              q: 'Do I own what you build?',
              a: 'Yes. You receive the source files and full rights to everything we make for you.',
            },
            {
              q: 'Are the portfolio pieces client projects?',
              a: 'No. They are working demos we built to show what we can make, and you can open and use every one. Your project is designed around your business, your brief and your brand.',
            },
            {
              q: 'What happens after I book?',
              a: 'Once we confirm a time, we go through your goals and any examples you like on the call, then send a written proposal and quote.',
            },
          ].map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-bold text-base md:text-lg text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="material-symbols-outlined text-slate-500 transition-transform group-open:rotate-45" aria-hidden="true">add</span>
              </summary>
              <p className="mt-3 font-body text-sm md:text-base text-slate-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="mt-20 px-4 md:px-12 max-w-[1440px] mx-auto text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900">
            Ready to build your web, app, or logo?
          </h2>
          <p className="font-body text-slate-600 text-sm md:text-base">
            Book an appointment today. We'll go through your goals and any examples you like, then send a written proposal. We reply to every booking within one business day.
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
