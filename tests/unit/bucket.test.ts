import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bucketAsNote, bucketCount, clearBucket, getBucket, isSaved, onBucketChange, removeSaved, toggleSaved,
} from '../../src/lib/bucket';

const crm = { id: 'meridian-crm', kind: 'work' as const, title: 'Meridian CRM', subtitle: 'Dashboards' };
const logo = { id: 'logo', kind: 'service' as const, title: 'Logo & Brand Identity', subtitle: '' };

beforeEach(() => localStorage.clear());

describe('saved list', () => {
  it('adds an item, then removes it on a second click', () => {
    expect(toggleSaved(crm)).toBe(true);
    expect(isSaved('meridian-crm')).toBe(true);
    expect(toggleSaved(crm)).toBe(false);
    expect(bucketCount()).toBe(0);
  });

  it('never holds the same item twice', () => {
    toggleSaved(crm);
    toggleSaved(logo);
    toggleSaved(crm);
    toggleSaved(crm);
    expect(getBucket().map((i) => i.id)).toEqual(['logo', 'meridian-crm']);
  });

  it('keeps the order the visitor chose things in', () => {
    toggleSaved(logo);
    toggleSaved(crm);
    expect(getBucket().map((i) => i.id)).toEqual(['logo', 'meridian-crm']);
  });

  it('survives damaged browser storage instead of breaking the page', () => {
    localStorage.setItem('meridian_saved_items', '{not json');
    expect(getBucket()).toEqual([]);
    localStorage.setItem('meridian_saved_items', JSON.stringify([{ id: 'x' }, null, crm]));
    expect(getBucket().map((i) => i.id)).toEqual(['meridian-crm']);
  });

  it('tells subscribers about every change', () => {
    const listener = vi.fn();
    const off = onBucketChange(listener);
    toggleSaved(crm);
    removeSaved('meridian-crm');
    clearBucket();
    off();
    toggleSaved(crm);
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('writes the list for the studio as plain numbered lines', () => {
    expect(bucketAsNote([])).toBe('');
    const items = [{ ...crm, addedAt: '' }, { ...logo, addedAt: '' }];
    expect(bucketAsNote(items)).toBe(
      'Items saved from the site (2):\n1. Meridian CRM (Dashboards)\n2. Logo & Brand Identity',
    );
  });

  it('never carries a price: what something costs is answered in the invoice', () => {
    toggleSaved(crm);
    const [saved] = getBucket();
    expect(Object.keys(saved).sort()).toEqual(['addedAt', 'id', 'kind', 'subtitle', 'title']);
    expect(bucketAsNote(getBucket())).not.toMatch(/\$|price|total/i);
  });
});
