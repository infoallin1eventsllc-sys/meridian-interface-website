import React, { useState } from 'react';
import { TabType, ServiceCategory } from '../types';
import { SERVICES } from '../data/mockData';
import { ImageWithFallback } from './ImageWithFallback';
import { useMeridianMotion, m as motion } from '../lib/motion';

interface ServicesViewProps {
  onTabChange: (tab: TabType) => void;
  onSelectServiceForBooking: (serviceId: ServiceCategory) => void;
}

export const SolutionsView: React.FC<ServicesViewProps> = ({
  onTabChange,
  onSelectServiceForBooking
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceCategory>('web_design');

  const currentService = SERVICES.find(s => s.id === selectedServiceId) || SERVICES[0];
  const m = useMeridianMotion();

  return (
    <main className="pt-24 pb-24 md:pb-16 px-4 md:px-12 max-w-[1440px] mx-auto animate-fadeIn bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="mb-12 max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-800 rounded-full text-xs font-bold uppercase tracking-widest">
          <span className="material-symbols-outlined text-sm">palette</span>
          MERIDIAN Creative Services
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 font-black leading-tight tracking-tight">
          Web Design, App UI/UX, Dashboards & Logo Identity
        </h1>
        <p className="font-body text-base md:text-lg text-slate-600 leading-relaxed">
          Select a service below to explore features, deliverables, and custom solutions. Book a 1-on-1 appointment directly to start your project.
        </p>
      </section>

      {/* Service Selector Tabs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedServiceId(s.id)}
            className={`p-5 rounded-xl text-left border transition-all flex flex-col justify-between ${
              selectedServiceId === s.id
                ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-lg scale-[1.02]'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`material-symbols-outlined text-2xl ${
                  selectedServiceId === s.id ? 'text-blue-400' : 'text-slate-700'
                }`}>
                  {s.icon}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  selectedServiceId === s.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {s.categoryName}
                </span>
              </div>
              <h3 className="font-display font-bold text-base">{s.title}</h3>
            </div>
          </button>
        ))}
      </section>

      {/* Selected Service Detailed View */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              <span className="material-symbols-outlined text-base">{currentService.icon}</span>
              {currentService.categoryName}
            </div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
              {currentService.title}
            </h2>
          </div>

          <p className="font-body text-slate-600 text-sm md:text-base leading-relaxed">
            {currentService.description}
          </p>

          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900">
              Key Deliverables & Included Features:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentService.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-semibold bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="material-symbols-outlined text-blue-600 text-base">check_circle</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onSelectServiceForBooking(currentService.id)}
              className="w-full sm:w-auto px-8 py-4 bg-[#0f172a] text-white font-body font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">event</span>
              Book Appointment for {currentService.categoryName}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 h-72 lg:h-full min-h-[320px] relative rounded-xl overflow-hidden bg-slate-900 shadow-md">
          <ImageWithFallback
            src={currentService.image}
            alt={currentService.title}
            icon={currentService.icon}
            label={currentService.categoryName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white p-3 bg-slate-900 rounded-lg border border-slate-700 text-xs">
            <p className="font-bold">Included on every project</p>
            <p className="text-slate-300 text-[11px] mt-0.5">Strategy consultation, interactive mockups, and post-launch support.</p>
          </div>
        </div>
      </section>

      {/* Interactive Project Cost & Scope Estimator */}
      <ProjectScopeCalculator onSelectServiceForBooking={onSelectServiceForBooking} />

      {/* Workflow Process */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">How It Works</p>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
            Our 4-Step Design & Development Process
          </h2>
        </div>

        {/*
          The one place motion earns its keep on this page: these four steps are
          an actual sequence, so revealing them in order says something true
          about the process. Elsewhere a stagger would just be decoration.
          `m` strips the movement entirely when the visitor has asked their
          system for reduced motion — see src/lib/motion.ts.
        */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={m.stagger(0.1)}
          {...m.reveal}
        >
          {[
            { step: '01', title: 'Appointment Booking', icon: 'calendar_today', desc: 'Schedule a 1-on-1 discovery session to share your goals, brand reference, and features.' },
            { step: '02', title: 'Design & Wireframing', icon: 'draw', desc: 'We craft high-fidelity Figma designs, logo vector concepts, or app UX flows for your review.' },
            { step: '03', title: 'Development & Build', icon: 'code', desc: 'Our engineers transform designs into clean, responsive web code or cross-platform mobile apps.' },
            { step: '04', title: 'Launch & Handover', icon: 'rocket_launch', desc: 'We deploy your website, submit your mobile app to stores, and deliver vector logo master files.' }
          ].map((item, index) => (
            <motion.div key={index} variants={m.rise} className="bg-white border border-slate-200 p-6 rounded-xl space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">{item.title}</h3>
              <p className="font-body text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
};

interface CalculatorProps {
  onSelectServiceForBooking: (serviceId: ServiceCategory) => void;
}

const ProjectScopeCalculator: React.FC<CalculatorProps> = ({ onSelectServiceForBooking }) => {
  const [calcService, setCalcService] = useState<ServiceCategory>('web_design');
  const [pageScope, setPageScope] = useState<'small' | 'medium' | 'enterprise'>('medium');
  const [includeAnimations, setIncludeAnimations] = useState(true);
  const [includeCMS, setIncludeCMS] = useState(true);
  const [includeEcommerce, setIncludeEcommerce] = useState(false);
  const [includeSEO, setIncludeSEO] = useState(true);
  const [isRush, setIsRush] = useState(false);

  /*
   * This used to price the project in the browser and show a running total.
   *
   * Two problems with that. Every rate had to ship in the JavaScript to do the
   * sum, so the whole card was readable from the site's source. And a number
   * quoted before anyone has understood the work is a number you then have to
   * argue with — Otis quotes on an invoice, once he knows what is actually
   * being asked for.
   *
   * The selections stay, because they are the valuable part: they tell him what
   * this visitor wants before the first conversation. They travel into the
   * booking as a brief instead of a total.
   */
  const scopeLabel = pageScope === 'small' ? 'Focused' : pageScope === 'medium' ? 'Standard' : 'Extensive';
  const chosenExtras = [
    includeAnimations && 'Interactive animations',
    includeCMS && 'Content management, so you can edit it yourself',
    includeEcommerce && 'Online payments and checkout',
    includeSEO && 'Technical SEO setup',
    isRush && 'Priority timeline',
  ].filter(Boolean) as string[];

  return (
    <section className="bg-[#0f172a] text-white border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl mb-16 space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-blue-300 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
            <span className="material-symbols-outlined text-sm">tune</span>
            Build Your Brief
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
            Tell us what you need, and we'll price it properly
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Pick the scope and the pieces that matter to you. We'll come back with a written quote
            that itemises exactly what each part costs — no guessing, and no number invented before
            we understand the job.
          </p>
        </div>

        <div className="bg-white/5 border border-white/15 p-4 rounded-2xl text-right">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your brief so far</div>
          <div className="font-display font-black text-3xl md:text-4xl text-white">
            {chosenExtras.length + 1}
          </div>
          <div className="text-[11px] text-slate-400 font-semibold">
            {chosenExtras.length === 0 ? 'scope chosen' : `choices — ${scopeLabel.toLowerCase()} scope`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Controls */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Service Category */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Choose Service Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'web_design', label: 'Web Design', icon: 'language' },
                { id: 'app_design', label: 'Mobile App', icon: 'smartphone' },
                { id: 'dashboards', label: 'Dashboard', icon: 'dashboard' },
                { id: 'logo_brand', label: 'Logo & Brand', icon: 'palette' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCalcService(s.id as ServiceCategory)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center justify-center gap-1.5 ${
                    calcService === s.id
                      ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{s.icon}</span>
                  <span className="font-body font-bold text-xs">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Scope Size */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Select Project Scope Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'small', label: 'Starter Scope', desc: calcService === 'logo_brand' ? '2 Vector Logo Concepts' : '1-4 Pages / Views' },
                { id: 'medium', label: 'Standard Growth', desc: calcService === 'logo_brand' ? '4 Concepts + Brand Kit' : '5-10 Pages / Views' },
                { id: 'enterprise', label: 'Enterprise Custom', desc: calcService === 'logo_brand' ? 'Full Brand Identity Suite' : '11+ Pages / Complex UX' }
              ].map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setPageScope(sc.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    pageScope === sc.id
                      ? 'bg-white text-slate-900 border-white shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-display font-bold text-xs">{sc.label}</div>
                  <div className={`text-[10px] ${pageScope === sc.id ? 'text-slate-600' : 'text-slate-400'}`}>
                    {sc.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Add-on Capabilities */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              3. Custom Add-ons & Integration Modules
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeAnimations}
                    onChange={(e) => setIncludeAnimations(e.target.checked)}
                    className="w-4 h-4 accent-blue-500 rounded"
                  />
                  <div>
                    <span className="font-body font-bold text-xs text-white">Interactive Animations</span>
                    <span className="block text-[10px] text-slate-400">Framer motion & micro-interactions</span>
                  </div>
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeCMS}
                    onChange={(e) => setIncludeCMS(e.target.checked)}
                    className="w-4 h-4 accent-blue-500 rounded"
                  />
                  <div>
                    <span className="font-body font-bold text-xs text-white">CMS Content Engine</span>
                    <span className="block text-[10px] text-slate-400">Blog, team, services dynamic management</span>
                  </div>
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeEcommerce}
                    onChange={(e) => setIncludeEcommerce(e.target.checked)}
                    className="w-4 h-4 accent-blue-500 rounded"
                  />
                  <div>
                    <span className="font-body font-bold text-xs text-white">E-Commerce & Checkout</span>
                    <span className="block text-[10px] text-slate-400">Stripe/Payment gateway integration</span>
                  </div>
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeSEO}
                    onChange={(e) => setIncludeSEO(e.target.checked)}
                    className="w-4 h-4 accent-blue-500 rounded"
                  />
                  <div>
                    <span className="font-body font-bold text-xs text-white">Full Technical SEO</span>
                    <span className="block text-[10px] text-slate-400">Meta tags, OpenGraph, sitemap setup</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Timeline Speed */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">bolt</span>
                Priority Rush Delivery (2-Week Turnaround)
              </div>
              <p className="text-[11px] text-slate-300">Expedite project review and dedicated daily development sprints.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isRush}
                onChange={(e) => setIsRush(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Right Summary Box */}
        <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">checklist</span>
              What you've asked for
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-blue-400 text-sm mt-0.5" aria-hidden="true">check</span>
                <span><span className="text-white font-semibold">{scopeLabel} scope</span> — we'll confirm exactly what that covers before quoting.</span>
              </div>
              {chosenExtras.map((extra) => (
                <div key={extra} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-sm mt-0.5" aria-hidden="true">check</span>
                  <span>{extra}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-slate-300 leading-relaxed">
              <span className="text-white font-semibold">What happens next.</span> Book a short call
              and we'll go through this properly. You'll get a written quote that itemises every
              line and says what it excludes, so nothing arrives as a surprise.
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <button
              onClick={() => onSelectServiceForBooking(calcService)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-body font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              Book Appointment With This Estimate
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              No deposit required to schedule. Quote confirmed during 1-on-1 discovery session.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

