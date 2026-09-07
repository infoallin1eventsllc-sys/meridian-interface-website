import React from 'react';
import { ReelPlayer } from './ReelPlayer';
import { REEL } from '../lib/reel';

/**
 * The showreel — the studio's own work, moving, on the services page.
 *
 * This sits where the loop simulator used to. Otis's read on Sep 3 was that a
 * control panel on a sales page tells a client the studio is busy with its own
 * machinery. A reel of the work does the opposite: it is the proof the Tech
 * Stack service claims, shown rather than described.
 *
 * The film itself, and the rules about how it loads, live in ReelPlayer and
 * lib/reel.ts — the portfolio's tech stack entry plays the same cut from the
 * same place.
 */

export const Showreel: React.FC = () => (
  <section className="space-y-8" aria-labelledby="showreel-heading">
    <div className="text-center max-w-2xl mx-auto space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">The Work</p>
      <h2
        id="showreel-heading"
        className="font-display font-bold text-2xl md:text-3xl text-slate-900"
      >
        What We Build, in Under a Minute
      </h2>
      <p className="font-body text-sm text-slate-600 leading-relaxed">
        Websites, mobile apps, online stores, dashboards, CRMs and the AI systems behind
        them — every screen below is a real product this studio designed and built.
      </p>
    </div>

    <div className="max-w-4xl mx-auto">
      <ReelPlayer
        label="Watch the reel"
        caption={
          <>
            Every screen is a product we designed and built.{' '}
            <a
              href={REEL.landscape}
              className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800"
            >
              Download the film
            </a>
            .
          </>
        }
      />
    </div>
  </section>
);
