import React, { useEffect, useRef } from 'react';

/**
 * Motion layer behind the homepage hero.
 *
 * A wireframe globe drawn on a canvas: latitude rings and meridians broken into
 * dashes at varying density, a scatter of nodes, a few trailing whiskers, and an
 * atmospheric glow standing in for the blue limb light. It assembles on load,
 * then breathes — the hemisphere facing the viewer opens outward at the same
 * moment the far side closes in, so it is never simply pulsing.
 *
 * This replaced a 16-second Earth clip (1.0 MB of MP4, 353 KB of WebM and a
 * 38 KB poster) with roughly 9 KB of code. Three things came with that trade,
 * and only two are wins: it is far lighter, and it is drawn at the device's own
 * pixel ratio so it never softens on a retina screen. The cost is that a canvas
 * redrawing every frame spends processor time where video spent hardware decode.
 * The visibility checks below exist to keep that bill honest — nothing is drawn
 * while the hero is scrolled away or the tab is in the background.
 *
 * `shouldStayStill` is unchanged from the footage version and does more work
 * here: with reduced motion, Save-Data, or a 2G connection, the globe is drawn
 * once as a still frame and the loop never starts. The composition is identical
 * either way, so nobody gets a lesser-looking page for having asked for less
 * movement — they just get it holding still.
 *
 * Geometry is seeded, so the same lattice is drawn on every visit and every
 * device. That is deliberate: this is the studio's front door, not a generative
 * toy, and it should look like a designed thing rather than a different accident
 * each time.
 */

const SEED = 20260908;
const TILT = -0.28;

/** Colours read off the live palette, as `r,g,b` for use inside rgba(). */
const LINE = '148,170,205';
const ACCENT = '74,133,255';
const GLINT = '226,236,255';

/** True when the visitor has asked for less movement or less data. */
function shouldStayStill(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  // Save-Data is a direct request not to spend the visitor's bandwidth on decoration.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType && /(^|\W)(slow-)?2g$/.test(conn.effectiveType)) return true;
  return false;
}

interface Segment { lat1: number; lon1: number; lat2: number; lon2: number; w: number; accent: boolean; order: number }
interface LatticeNode { lat: number; lon: number; r: number; ring: boolean; accent: boolean; order: number }
interface Whisker { pts: { lat: number; lon: number; k: number }[]; order: number }

/** Deterministic PRNG, so the lattice is the same drawing every time. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Where the lattice is dense and where it thins out to nothing. */
function density(lat: number, lon: number): number {
  const band = Math.cos(lon - 3.5) * 0.5 + 0.5;
  const low = 1 - Math.abs(lat + 0.35) / 1.7;
  return Math.max(0.06, Math.min(1, band * 0.72 + low * 0.5));
}

function buildLattice() {
  const rand = rng(SEED);
  const segments: Segment[] = [];
  const nodes: LatticeNode[] = [];
  const whiskers: Whisker[] = [];

  const RINGS = [-72, -58, -44, -30, -16, 0, 16, 30, 44, 58];
  const MERIDIANS = 18;
  const D2R = Math.PI / 180;

  RINGS.forEach((deg, ri) => {
    const lat = deg * D2R;
    const steps = 92;
    let on = rand() > 0.4;
    let run = 2 + Math.floor(rand() * 7);
    for (let s = 0; s < steps; s++) {
      const lon1 = (s / steps) * Math.PI * 2;
      const lon2 = ((s + 1) / steps) * Math.PI * 2;
      const d = density(lat, lon1);
      if (run-- <= 0) {
        on = rand() < 0.35 + d * 0.5;
        run = on ? 2 + Math.floor(rand() * 9) : 1 + Math.floor(rand() * 6);
      }
      if (!on) continue;
      const heavy = rand() < d * 0.08;
      segments.push({
        lat1: lat, lon1, lat2: lat, lon2,
        w: heavy ? 2.6 + rand() * 1.8 : 0.7,
        accent: !heavy && rand() < 0.07,
        order: 0.08 + (ri / RINGS.length) * 0.5 + rand() * 0.3,
      });
      if (rand() < d * 0.05) {
        nodes.push({ lat, lon: lon1, r: 1 + rand() * 2.2, ring: rand() < 0.3, accent: rand() < 0.2, order: 0.3 + rand() * 0.55 });
      }
    }
  });

  for (let m = 0; m < MERIDIANS; m++) {
    const lon = (m / MERIDIANS) * Math.PI * 2;
    const steps = 64;
    let on = rand() > 0.35;
    let run = 3 + Math.floor(rand() * 6);
    for (let s = 0; s < steps; s++) {
      const lat1 = -Math.PI / 2 + (s / steps) * Math.PI;
      const lat2 = -Math.PI / 2 + ((s + 1) / steps) * Math.PI;
      const d = density(lat1, lon);
      if (run-- <= 0) {
        on = rand() < 0.4 + d * 0.45;
        run = on ? 3 + Math.floor(rand() * 8) : 2 + Math.floor(rand() * 7);
      }
      if (!on) continue;
      const heavy = rand() < d * 0.045;
      segments.push({
        lat1, lon1: lon, lat2, lon2: lon,
        w: heavy ? 2.4 + rand() * 1.5 : 0.65,
        accent: !heavy && rand() < 0.055,
        order: 0.05 + (m / MERIDIANS) * 0.45 + rand() * 0.3,
      });
      if (rand() < d * 0.035) {
        nodes.push({ lat: lat1, lon, r: 1 + rand() * 1.9, ring: rand() < 0.34, accent: rand() < 0.18, order: 0.3 + rand() * 0.55 });
      }
    }
  }

  for (let w = 0; w < 8; w++) {
    const baseLat = (rand() - 0.5) * 1.9;
    const baseLon = rand() * Math.PI * 2;
    const sweep = (0.9 + rand() * 1.7) * (rand() < 0.5 ? -1 : 1);
    const climb = (rand() - 0.4) * 0.8;
    const pts = [];
    const N = 44;
    for (let t = 0; t <= N; t++) {
      const u = t / N;
      pts.push({ lat: baseLat + climb * u, lon: baseLon + sweep * u, k: 1 + Math.pow(u, 1.7) * 0.3 });
    }
    whiskers.push({ pts, order: 0.55 + rand() * 0.3 });
  }

  return { segments, nodes, whiskers };
}

export const HeroBackdrop: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { segments, nodes, whiskers } = buildLattice();

    let W = 0, H = 0, cx = 0, cy = 0, R = 0;
    let yaw = 0, T = 0, amp = 0, reveal = 0;
    let pointerX = -9999, pointerY = -9999, pointerLive = false;
    const pings: { lat: number; lon: number; t: number }[] = [];
    let nextPing = 1.4;
    let still = shouldStayStill();

    const scratch = { k: 1, lon: 0 };

    /* The front hemisphere opens outward exactly as the back closes in, so the
       globe reads as breathing rather than throbbing. */
    function deform(lon: number) {
      scratch.k = 1;
      scratch.lon = lon;
      if (amp <= 0.001) return;
      const facing = Math.cos(lon + yaw);
      scratch.k = 1 + amp * 0.22 * facing * Math.sin(T * 0.62);
      scratch.lon = lon + amp * 0.09 * facing * Math.cos(T * 0.62);
    }

    function project(lat: number, lon: number, k?: number) {
      deform(lon);
      const a = scratch.lon + yaw;
      const x = Math.cos(lat) * Math.sin(a);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.cos(a);
      const y2 = y * Math.cos(TILT) - z * Math.sin(TILT);
      const z2 = y * Math.sin(TILT) + z * Math.cos(TILT);
      const rr = R * (k || 1) * scratch.k;
      const persp = 1 / (1 - z2 * 0.24);
      let px = cx + x * rr * persp;
      let py = cy + y2 * rr * persp;

      if (pointerLive) {
        const dx = pointerX - px;
        const dy = pointerY - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const reach = Math.min(W, H) * 0.4;
        if (dist < reach) {
          let pull = 1 - dist / reach;
          pull = pull * pull * 0.18;
          px += dx * pull;
          py += dy * pull;
        }
      }
      return { x: px, y: py, z: z2 };
    }

    const alphaFor = (z: number, base: number) => {
      const depth = (z + 1) / 2;
      return base * (0.12 + 0.88 * depth * depth);
    };
    const fade = (order: number) => Math.max(0, Math.min(1, (reveal - order) / 0.16));

    function size() {
      const r = wrap!.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
      R = Math.min(W, H) * 0.38;
    }

    function draw() {
      if (!W) return;
      const c = ctx!;
      c.clearRect(0, 0, W, H);
      c.lineCap = 'round';

      // Atmosphere — the blue limb light the photograph used to supply.
      const glow = c.createRadialGradient(cx, cy, R * 0.62, cx, cy, R * 1.28);
      glow.addColorStop(0, 'rgba(32,74,158,0.30)');
      glow.addColorStop(0.62, 'rgba(38,90,190,0.16)');
      glow.addColorStop(1, 'rgba(38,90,190,0)');
      c.fillStyle = glow;
      c.globalAlpha = Math.min(1, reveal * 1.6);
      c.beginPath();
      c.arc(cx, cy, R * 1.28, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;

      c.beginPath();
      c.arc(cx, cy, R * 1.005, 0, Math.PI * 2);
      c.strokeStyle = `rgba(120,170,255,${(0.22 * Math.min(1, reveal * 1.6)).toFixed(3)})`;
      c.lineWidth = 1.4;
      c.stroke();

      /* Fine lines are batched into five depth buckets: one path and one stroke
         per bucket rather than per segment, which is what keeps a few thousand
         dashes affordable every frame. */
      const BUCKETS = 5;
      for (let b = 0; b < BUCKETS; b++) {
        const lo = -1 + (b / BUCKETS) * 2;
        const hi = -1 + ((b + 1) / BUCKETS) * 2;
        const mid = (lo + hi) / 2;
        const aInk = alphaFor(mid, 0.46);
        if (aInk < 0.012) continue;

        c.beginPath();
        let drew = false;
        for (const s of segments) {
          if (s.w > 1.4 || s.accent) continue;
          if (fade(s.order) <= 0) continue;
          const p1 = project(s.lat1, s.lon1);
          const p2 = project(s.lat2, s.lon2);
          const z = (p1.z + p2.z) / 2;
          if (z < lo || z >= hi) continue;
          c.moveTo(p1.x, p1.y);
          c.lineTo(p2.x, p2.y);
          drew = true;
        }
        if (!drew) continue;
        c.strokeStyle = `rgba(${LINE},${(aInk * Math.min(1, reveal * 1.4)).toFixed(3)})`;
        c.lineWidth = 0.55 + ((mid + 1) / 2) * 0.5;
        c.stroke();
      }

      for (const wk of whiskers) {
        const f = fade(wk.order);
        if (f <= 0) continue;
        const last = Math.floor(wk.pts.length * f);
        c.beginPath();
        let started = false, zAcc = 0, zN = 0;
        for (let t = 0; t < last; t++) {
          const pp = project(wk.pts[t].lat, wk.pts[t].lon, wk.pts[t].k);
          zAcc += pp.z;
          zN++;
          if (!started) { c.moveTo(pp.x, pp.y); started = true; } else c.lineTo(pp.x, pp.y);
        }
        if (!started) continue;
        c.strokeStyle = `rgba(${LINE},${alphaFor(zN ? zAcc / zN : 0, 0.26).toFixed(3)})`;
        c.lineWidth = 0.6;
        c.stroke();
      }

      for (const sg of segments) {
        if (sg.w <= 1.4 && !sg.accent) continue;
        const f = fade(sg.order);
        if (f <= 0) continue;
        const q1 = project(sg.lat1, sg.lon1);
        const q2 = project(sg.lat2, sg.lon2);
        const zq = (q1.z + q2.z) / 2;
        if (zq < -0.25) continue;
        const a = alphaFor(zq, sg.accent ? 0.95 : 0.8) * f;
        c.strokeStyle = `rgba(${sg.accent ? ACCENT : GLINT},${a.toFixed(3)})`;
        c.lineWidth = sg.accent ? 1.7 : sg.w;
        c.beginPath();
        c.moveTo(q1.x, q1.y);
        c.lineTo(q2.x, q2.y);
        c.stroke();
      }

      for (const nd of nodes) {
        const f = fade(nd.order);
        if (f <= 0) continue;
        const np = project(nd.lat, nd.lon);
        if (np.z < -0.2) continue;
        const a = alphaFor(np.z, 0.9) * f;
        const col = nd.accent ? ACCENT : GLINT;
        c.beginPath();
        c.arc(np.x, np.y, nd.r * (0.7 + ((np.z + 1) / 2) * 0.5), 0, Math.PI * 2);
        if (nd.ring) {
          c.strokeStyle = `rgba(${col},${a.toFixed(3)})`;
          c.lineWidth = 0.9;
          c.stroke();
        } else {
          c.fillStyle = `rgba(${col},${a.toFixed(3)})`;
          c.fill();
        }
      }

      for (let i = pings.length - 1; i >= 0; i--) {
        const pg = pings[i];
        pg.t += 0.016;
        if (pg.t > 1) { pings.splice(i, 1); continue; }
        const pt = project(pg.lat, pg.lon);
        if (pt.z < 0) continue;
        const e = 1 - Math.pow(1 - pg.t, 3);
        c.beginPath();
        c.arc(pt.x, pt.y, 3 + e * 32, 0, Math.PI * 2);
        c.strokeStyle = `rgba(${ACCENT},${((1 - pg.t) * 0.45).toFixed(3)})`;
        c.lineWidth = 1;
        c.stroke();
      }
    }

    size();

    // Held so every listener and observer below comes back off on unmount.
    const cleanups: (() => void)[] = [];

    const ro = new ResizeObserver(() => { size(); if (still) draw(); });
    ro.observe(wrap);
    cleanups.push(() => ro.disconnect());

    if (still) {
      reveal = 1;
      amp = 0;
      draw();
    } else {
      // The hero section is the pointer surface; this layer is pointer-events:none.
      const surface = wrap.parentElement;
      if (surface) {
        const onMove = (e: PointerEvent) => {
          const r = wrap.getBoundingClientRect();
          pointerX = e.clientX - r.left;
          pointerY = e.clientY - r.top;
          pointerLive = true;
        };
        const onLeave = () => { pointerLive = false; };
        surface.addEventListener('pointermove', onMove, { passive: true });
        surface.addEventListener('pointerleave', onLeave);
        cleanups.push(() => {
          surface.removeEventListener('pointermove', onMove);
          surface.removeEventListener('pointerleave', onLeave);
        });
      }

      let onScreen = true;
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { onScreen = e.isIntersecting; }),
        { threshold: 0.02 },
      );
      io.observe(wrap);
      cleanups.push(() => io.disconnect());

      // Drawing into a tab nobody is looking at is pure battery drain.
      let tabVisible = document.visibilityState !== 'hidden';
      const onVisibility = () => { tabVisible = document.visibilityState !== 'hidden'; };
      document.addEventListener('visibilitychange', onVisibility);
      cleanups.push(() => document.removeEventListener('visibilitychange', onVisibility));

      let frame = 0;
      const t0 = performance.now();
      const loop = (now: number) => {
        frame = requestAnimationFrame(loop);
        if (still || !onScreen || !tabVisible) return;
        T = (now - t0) / 1000;

        // The lattice assembles first; it only starts breathing once whole.
        if (reveal < 1) {
          const u = Math.min(1, T / 2.2);
          reveal = 1 - Math.pow(1 - u, 3);
        } else if (amp < 1) {
          amp = Math.min(1, amp + 0.005);
        }

        yaw += 0.00075;

        nextPing -= 0.016;
        if (nextPing <= 0 && nodes.length) {
          const pick = nodes[Math.floor(Math.random() * nodes.length)];
          pings.push({ lat: pick.lat, lon: pick.lon, t: 0 });
          nextPing = 1.6 + Math.random() * 2.4;
        }

        draw();
      };
      frame = requestAnimationFrame(loop);
      cleanups.push(() => cancelAnimationFrame(frame));
    }

    // Someone can turn reduced motion on while the page is open. Honour it at
    // once rather than at the next reload: stop the loop and hold the frame.
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPrefChange = () => {
      if (media.matches && !still) {
        still = true;
        reveal = 1;
        amp = 0;
        draw();
      }
    };
    media.addEventListener('change', onPrefChange);
    cleanups.push(() => media.removeEventListener('change', onPrefChange));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="hero-backdrop absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* The ground the lattice sits on. This used to be a photograph; it is now
          a gradient, so there is nothing left to load before the hero paints. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 78% 52%, rgba(30,58,110,0.55), transparent 62%),' +
            'linear-gradient(160deg, #0B111F 0%, #0E1526 46%, #121C30 100%)',
        }}
      />

      <div ref={wrapRef} className="hero-lattice absolute">
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
      </div>

      {/* Legibility scrims, unchanged: dark where the copy sits, clearing to
          reveal the scene. These stay above the lattice so no frame of the
          animation can wash the headline out. */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/70 via-transparent to-[#0f172a]/25" />
    </div>
  );
};
