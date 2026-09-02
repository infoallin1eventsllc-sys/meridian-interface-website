import { useEffect, useState } from 'react';

/**
 * Owner-managed image overrides.
 *
 * The site ships with default images; the owner can replace any of them from
 * Photo Control in the portal. This module is the read side — public, no token.
 *
 * It used to keep overrides in localStorage, and Photo Control told the owner
 * "the live site now shows it." It did not. A swap existed in exactly one
 * browser: not on his phone, not for any visitor, and not after clearing site
 * data. That is a failure you discover in front of a client, so the store now
 * reads from the `site-images` edge function, which every visitor also reads.
 *
 * localStorage still appears below, in a different role: a cache of the last
 * server response, used only to paint the correct image on a repeat visit
 * before the network answers. It is never the source of truth, and it is
 * overwritten by every successful fetch.
 */

const DEFAULT_ENDPOINT =
  'https://glzodwhyavexpuusbqjy.supabase.co/functions/v1/site-images';
const ENDPOINT: string =
  (import.meta.env.VITE_SITE_IMAGES_ENDPOINT as string | undefined)?.trim() || DEFAULT_ENDPOINT;

const CACHE_KEY = 'meridian_image_overrides_cache';
const UPDATE_EVENT = 'meridian:images-updated';

export type ImageOverrides = Record<string, string>;

/** Authoritative in-memory copy. Seeded from the cache, replaced by the fetch. */
let overrides: ImageOverrides = readCache();
let inflight: Promise<ImageOverrides> | null = null;
let loadedOnce = false;

function readCache(): ImageOverrides {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as ImageOverrides) : {};
  } catch {
    return {};
  }
}

function writeCache(value: ImageOverrides): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(value));
  } catch {
    // A full or disabled store only costs us the fast first paint.
  }
}

function announce(): void {
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

/**
 * Fetch the published overrides. Concurrent callers share one request; a
 * failure leaves whatever is cached in place rather than blanking the site,
 * because a visitor seeing the previous image is far better than none.
 */
export function loadImageOverrides(force = false): Promise<ImageOverrides> {
  if (inflight) return inflight;
  if (loadedOnce && !force) return Promise.resolve(overrides);

  inflight = fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'list' }),
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((body) => {
      if (body?.ok && body.overrides && typeof body.overrides === 'object') {
        overrides = body.overrides as ImageOverrides;
        writeCache(overrides);
        loadedOnce = true;
        announce();
      }
      return overrides;
    })
    .catch(() => overrides)
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** All current overrides, keyed by image id. */
export function getImageOverrides(): ImageOverrides {
  return overrides;
}

/** Resolve an image id to its override, falling back to the shipped default. */
export function resolveImage(id: string, fallback: string): string {
  const value = overrides[id];
  return value && value.trim() ? value : fallback;
}

/**
 * Replace the local copy after a write. Photo Control calls this with the map
 * the server returned, so the portal reflects what was actually published
 * rather than what it hoped would be.
 */
export function applyServerOverrides(next: ImageOverrides): void {
  overrides = next ?? {};
  loadedOnce = true;
  writeCache(overrides);
  announce();
}

/**
 * Subscribe a component to override changes, and trigger the initial load.
 * Returns a version counter that increments whenever the map changes, so
 * `resolveImage` is re-read on the next render.
 */
export function useImageOverrides(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener(UPDATE_EVENT, bump);
    window.addEventListener('storage', bump);
    void loadImageOverrides();
    return () => {
      window.removeEventListener(UPDATE_EVENT, bump);
      window.removeEventListener('storage', bump);
    };
  }, []);
  return version;
}

/** Read a File as base64 (no data: prefix) for upload. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
