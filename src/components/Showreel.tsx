import React, { useState } from 'react';

/**
 * The showreel — the studio's own work, moving, on the services page.
 *
 * This sits where the loop simulator used to. Otis's read on Sep 3 was that a
 * control panel on a sales page tells a client the studio is busy with its own
 * machinery. A reel of the work does the opposite: it is the proof the Tech
 * Stack service claims, shown rather than described.
 *
 * The film is the reel Otis approved: a website assembling itself, a mobile
 * app, the storefront, a dashboard, the CRM, the AI stack, and code resolving
 * into a live interface. Rendered by Clipkit from the approved composition.
 *
 * Hosting: the MP4 is served from the studio's own Supabase storage bucket,
 * which is public, permanent and CDN-backed. That is deliberate and is NOT the
 * hotlinking mistake recorded in public/demos/README.txt — that was a
 * *temporary third-party* host (AI Studio) whose URLs expire. This bucket is
 * ours. To self-host instead, download the file into `public/video/` and point
 * REEL.src at `/video/<name>.mp4`; nothing else changes.
 *
 * Weight: nothing is fetched until the visitor presses play. `preload="metadata"`
 * pulls only the header (a few KB) for the duration, and the poster frame is
 * drawn in CSS rather than shipped as an image, so this section costs the page
 * essentially nothing until it is wanted.
 */

const BUCKET =
  'https://glzodwhyavexpuusbqjy.supabase.co/storage/v1/object/public/social-videos/clips';

/**
 * Which cut plays here. Both are the same picture — the approved product reel —
 * and differ only in the four-second opening line. Swap `src` to change it:
 *   83373a8d604e20d6d2ba.mp4  "You formed the LLC. Now look like it."  (12.2 MB)
 *   81d51bdbc9438afdd253.mp4  "The sign shop asked for a vector file." (4.6 MB)
 */
const REEL = {
  src: `${BUCKET}/83373a8d604e20d6d2ba.mp4`,
  seconds: 47,
};

export const Showreel: React.FC = () => {
  // The <video> element is only mounted once the visitor asks for it, so the
  // browser cannot decide to buffer ahead of a click on a metered connection.
  const [playing, setPlaying] = useState(false);

  return (
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
        {/* aspect-video reserves the space before the file loads, so the page
            never jumps when the player appears. */}
        <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-[#0f172a] shadow-sm">
          {playing ? (
            <video
              className="absolute inset-0 h-full w-full"
              src={REEL.src}
              controls
              autoPlay
              playsInline
              preload="metadata"
            >
              Your browser cannot play this video.{' '}
              <a href={REEL.src}>Download it instead.</a>
            </video>
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-white transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
              aria-label="Play the showreel, 47 seconds, sound optional"
            >
              {/* The ink ground and grid of the reel itself, drawn in CSS so no
                  poster image has to be shipped or kept in step with the film. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    'linear-gradient(#93C5FD 1px, transparent 1px), linear-gradient(90deg, #93C5FD 1px, transparent 1px)',
                  backgroundSize: '80px 80px',
                }}
              />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg transition-transform group-hover:scale-105">
                <span className="material-symbols-outlined text-3xl">play_arrow</span>
              </span>
              <span className="relative font-display text-sm font-bold tracking-wide">
                Watch the reel
              </span>
              <span className="relative font-body text-xs text-slate-300">
                {REEL.seconds} seconds
              </span>
            </button>
          )}
        </div>

        <p className="mt-3 text-center font-body text-xs text-slate-500">
          Every screen is a product we designed and built.{' '}
          <a
            href={REEL.src}
            className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800"
          >
            Download the film
          </a>
          .
        </p>
      </div>
    </section>
  );
};
