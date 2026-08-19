import { useEffect, useState } from 'react';

/**
 * Owner-managed image overrides.
 *
 * The public site ships with default images (hero background + portfolio/case-study
 * images). The owner can override any of them from the PIN-protected Photo Control
 * portal — by image URL or by uploading a file (stored as a data URL). Overrides are
 * persisted in localStorage and applied live: setting one dispatches an event that any
 * mounted view listens to, so the change appears immediately without a reload.
 *
 * When the backend is connected, this store is the single place to swap localStorage for
 * a server-backed media store — no view code changes.
 */

const STORAGE_KEY = 'meridian_image_overrides';
const UPDATE_EVENT = 'meridian:images-updated';

export type ImageOverrides = Record<string, string>;

function read(): ImageOverrides {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as ImageOverrides;
  } catch {
    return {};
  }
}

/** All current overrides, keyed by image id. */
export function getImageOverrides(): ImageOverrides {
  return read();
}

/** Resolve an image id to its override, falling back to the provided default. */
export function resolveImage(id: string, fallback: string): string {
  const overrides = read();
  return overrides[id]?.trim() ? overrides[id] : fallback;
}

/** Set (or, with an empty value, clear) the override for an image id. */
export function setImageOverride(id: string, value: string): void {
  const overrides = read();
  if (value && value.trim()) {
    overrides[id] = value.trim();
  } else {
    delete overrides[id];
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (err) {
    // Most likely a quota error from a large uploaded data URL.
    console.error('Failed to save image override (storage full?):', err);
    throw err;
  }
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

/** Clear the override for an image id (revert to the shipped default). */
export function clearImageOverride(id: string): void {
  setImageOverride(id, '');
}

/**
 * Subscribe a component to override changes. Returns a version counter that increments
 * whenever any override changes, forcing a re-render so `resolveImage` re-reads.
 */
export function useImageOverrides(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener(UPDATE_EVENT, bump);
    window.addEventListener('storage', bump);
    return () => {
      window.removeEventListener(UPDATE_EVENT, bump);
      window.removeEventListener('storage', bump);
    };
  }, []);
  return version;
}

/** Read a File as a data URL (used for direct photo uploads). */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
