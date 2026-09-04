import React from 'react';
import { ImageWithFallback } from './ImageWithFallback';
import { TabType } from '../types';

/**
 * The Stack Planner, on the landing page, as a product rather than a concept.
 *
 * Every other tile on this page is marked "Concept" with no picture. This one
 * is a real, finished product with a live AI backend, so it gets a real
 * screenshot of itself — nothing mocked up, nothing rendered for the brochure.
 * That distinction is the whole point: a prospect scrolling past nine empty
 * frames learns that the studio has ideas. One working product they can see
 * teaches them the studio ships.
 *
 * The "open it" button only appears once the planner has an address. Until
 * then the section still does its job — it shows the thing and books the call.
 */

const PLANNER_URL = (import.meta.env.VITE_PLANNER_URL as string | undefined)?.trim() || '';
const plannerLink = PLANNER_URL
  ? `${PLANNER_URL}${PLANNER_URL.includes('?') ? '&' : '?'}utm_source=meridian-website&utm_medium=home-feature&utm_campaign=stack-planner`
  : '';

const SHOTS = [
  { src: '/images/portfolio/agentic-tech-stack-builder.jpg', label: 'Choose the pieces, see the monthly cost' },
  { src: '/images/portfolio/agentic-tech-stack-roi.jpg', label: 'What it frees up, and when it pays for itself' },
  { src: '/images/portfolio/agentic-tech-stack-proposal.jpg', label: 'A proposal you keep' },
];

export const StackPlannerFeature: React.FC<{ onTabChange: (tab: TabType) => void }> = ({ onTabChange }) => (
  <section className="mt-20 px-4 md:px-12 max-w-[1440px] mx-auto">
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* The screen itself, first on a phone: show the thing before describing it. */}
        <div className="lg:col-span-7 bg-slate-100 p-5 sm:p-8 flex items-center">
          <div className="w-full rounded-xl overflow-hidden border border-slate-300 shadow-md bg-white">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-200 border-b border-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="ml-2 text-[10px] font-mono text-slate-500 truncate">Meridian Stack Planner</span>
            </div>
            <div className="aspect-video relative bg-white">
              <ImageWithFallback
                frame
                src="/images/portfolio/agentic-tech-stack.jpg"
                alt="The Meridian Stack Planner, showing the five layers of an agentic tech stack"
                icon="hub"
                label="Stack Planner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center gap-5">
          <div className="space-y-2">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-blue-600">
              A product we built and run ourselves
            </p>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
              The Meridian Stack Planner
            </h2>
            <p className="font-body text-sm text-slate-600 leading-relaxed">
              Before we build a business its AI system, we plan it together in this. It lays out the five layers such a
              system needs, what each one costs a month, how a job runs with a person approving anything that matters,
              and what the whole thing is worth set against what it costs to build. You leave with a written proposal.
            </p>
          </div>

          <ul className="space-y-2">
            {SHOTS.map((s) => (
              <li key={s.src} className="flex items-start gap-2.5 font-body text-xs text-slate-700">
                <span className="material-symbols-outlined text-blue-600 text-base leading-none mt-0.5" aria-hidden="true">check_circle</span>
                <span>{s.label}</span>
              </li>
            ))}
            <li className="flex items-start gap-2.5 font-body text-xs text-slate-700">
              <span className="material-symbols-outlined text-blue-600 text-base leading-none mt-0.5" aria-hidden="true">check_circle</span>
              <span>Every figure is an estimate you can change, with the working shown</span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={() => onTabChange('booking')}
              className="px-6 py-3.5 bg-[#0f172a] text-white font-body font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">event</span>
              Plan your stack with us
            </button>
            {plannerLink && (
              <a
                href={plannerLink}
                className="px-6 py-3.5 bg-white text-slate-900 font-body font-bold text-xs uppercase tracking-widest rounded-lg border border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">explore</span>
                Open it yourself
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Three more real screens, so it reads as a product rather than one lucky shot. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-200 border-t border-slate-200">
        {SHOTS.map((s) => (
          <figure key={s.src} className="bg-white p-4 space-y-2.5">
            <div className="aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              <ImageWithFallback
                frame
                src={s.src}
                alt={s.label}
                icon="hub"
                label="Stack Planner"
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="font-body text-[11px] text-slate-500 leading-relaxed">{s.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
