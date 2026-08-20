import React, { useEffect, useRef } from 'react';

/**
 * Motion layer behind the homepage hero.
 *
 * The studio is named after the lines that wrap a globe, so the movement here is
 * orbital rather than generic drift: the scene creeps as if seen from something
 * in a slow orbit, stars pass at three depths, and a single hairline meridian
 * traces across — one arc, not a lattice, so it reads as a signature instead of
 * a tech-globe cliche.
 *
 * Everything is deliberately near the threshold of noticing. A hero that moves
 * fast enough to watch is a hero that competes with the headline.
 *
 * The photograph itself stays a CSS background so the owner can still swap it
 * from Photo Control; the canvas never depends on what the image contains.
 */

interface HeroBackdropProps {
  /** Resolved background image URL (owner-swappable). */
  imageUrl: string;
}

type Star = {
  x: number;          // 0..1 across the canvas
  y: number;          // 0..1 down the canvas
  depth: number;      // 0 = far, 2 = near
  r: number;          // radius in CSS px
  a: number;          // base alpha
  phase: number;      // twinkle offset so they never pulse in unison
};

const STAR_COLOR = '226, 236, 255';   // cool white, slightly blue — matches the slate ground
const ARC_COLOR = '96, 165, 250';     // blue-400, the eyebrow accent

export const HeroBackdrop: React.FC<HeroBackdropProps> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Pointer parallax is a nicety for mice, not something to fake on touch.
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let raf = 0;
    let running = false;

    // Aim for a consistent density rather than a fixed count, so a wide desktop
    // hero is not sparse and a phone is not needlessly busy.
    const buildStars = () => {
      const target = Math.round((width * height) / 5200);
      const count = Math.max(40, Math.min(220, target));
      stars = Array.from({ length: count }, () => {
        const depth = Math.floor(Math.random() * 3);
        return {
          x: Math.random(),
          y: Math.random(),
          depth,
          r: 0.4 + depth * 0.35 + Math.random() * 0.5,
          a: 0.22 + depth * 0.16 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      // Cap DPR: past 2x the extra pixels cost real frame time and buy nothing
      // on a field of 1px stars.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
      // Assigning canvas.width wipes the bitmap. Under reduced motion there is
      // no animation loop to put it back, so repaint here or the hero is left
      // with an empty rectangle where the starfield should be.
      if (reduceMotion.matches) paintStatic();
    };

    /** One composed, motionless frame — what reduced motion should still see. */
    const paintStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgb(${STAR_COLOR})`;
      drawStars(0);
      drawMeridian(0);
    };

    const drawStars = (t: number) => {
      for (const s of stars) {
        // Nearer layers travel faster — the whole reason for depth.
        const speed = (0.004 + s.depth * 0.006) / 60;
        const x = (((s.x - t * speed) % 1) + 1) % 1;
        const twinkle = reduceMotion.matches
          ? 1
          : 0.75 + 0.25 * Math.sin(t / 900 + s.phase);
        ctx.globalAlpha = s.a * twinkle;
        ctx.beginPath();
        ctx.arc(x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    /** One hairline arc, drifting. The brand echo, stated once. */
    const drawMeridian = (t: number) => {
      const period = 46000;
      const p = reduceMotion.matches ? 0.35 : (t % period) / period;

      // A wide, shallow ellipse suggesting the limb of something much larger
      // than the frame — the curve reads as planetary, not as a circle.
      const cx = width * (0.18 + p * 0.78);
      const cy = height * 1.35;
      const rx = width * 0.42;
      const ry = height * 1.05;

      const grad = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
      grad.addColorStop(0, `rgba(${ARC_COLOR}, 0)`);
      grad.addColorStop(0.5, `rgba(${ARC_COLOR}, 0.30)`);
      grad.addColorStop(1, `rgba(${ARC_COLOR}, 0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
    };

    /** A slow band of light crossing the scene, like sun catching an atmosphere. */
    const drawSweep = (t: number) => {
      if (reduceMotion.matches) return;
      const period = 26000;
      const p = (t % period) / period;
      // Rest for most of the cycle: a sweep that never stops is a strobe.
      const travel = Math.min(1, p / 0.45);
      if (p > 0.45) return;

      const x = -width * 0.3 + travel * width * 1.6;
      const w = width * 0.26;
      // Ease in and out so it arrives and leaves rather than snapping.
      const fade = Math.sin(travel * Math.PI) * 0.05;

      const grad = ctx.createLinearGradient(x - w, 0, x + w, 0);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, `rgba(226,236,255,${fade})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgb(${STAR_COLOR})`;
      drawStars(t);
      drawMeridian(t);
      drawSweep(t);
      if (running) raf = window.requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = window.requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };

    // A hero animating in a background tab is pure battery drain.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') stop();
      else if (!reduceMotion.matches) start();
    };

    // Pointer parallax: a few pixels of give, published as CSS variables so the
    // photo and canvas can lag each other slightly and imply depth.
    const onPointer = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      host.style.setProperty('--hero-px', `${(-nx * 14).toFixed(2)}px`);
      host.style.setProperty('--hero-py', `${(-ny * 10).toFixed(2)}px`);
    };

    const onMotionPrefChange = () => {
      if (reduceMotion.matches) {
        stop();
        // Reduced motion means no movement, not a missing design.
        paintStatic();
        host.style.setProperty('--hero-px', '0px');
        host.style.setProperty('--hero-py', '0px');
      } else {
        start();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    document.addEventListener('visibilitychange', onVisibility);
    reduceMotion.addEventListener('change', onMotionPrefChange);

    if (finePointer.matches && !reduceMotion.matches) {
      host.addEventListener('pointermove', onPointer);
    }

    onMotionPrefChange();

    return () => {
      stop();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      reduceMotion.removeEventListener('change', onMotionPrefChange);
      host.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <div ref={hostRef} className="hero-backdrop absolute inset-0 z-0 pointer-events-none">
      {/* The photograph. Creeps and breathes; never leaves its box. */}
      <div
        className="hero-photo absolute inset-0 bg-cover bg-center bg-no-repeat opacity-95"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />

      {/* Stars, meridian, light sweep. */}
      <canvas ref={canvasRef} className="hero-canvas absolute inset-0" aria-hidden="true" />

      {/* Legibility scrims, unchanged: dark where the copy sits, clearing to
          reveal the scene. These sit above the motion so nothing can wash the
          headline out mid-animation. */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/70 via-transparent to-[#0f172a]/25" />
    </div>
  );
};
