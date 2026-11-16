import { beforeEach, describe, expect, it } from 'vitest';
import { attributionForSubmission, captureAttribution, currentAttribution } from '../../src/lib/attribution';

/** Simulate arriving at a URL from a referring page. */
function arrive(pathAndQuery: string, referrer = '') {
  window.history.replaceState({}, '', pathAndQuery);
  Object.defineProperty(document, 'referrer', { value: referrer, configurable: true });
  captureAttribution();
}

beforeEach(() => localStorage.clear());

describe('lead attribution', () => {
  it('maps common tag shorthands to the channel names the CRM uses', () => {
    arrive('/?utm_source=IG&utm_campaign=Spring Launch');
    const { first } = currentAttribution();
    expect(first?.channel).toBe('instagram');
    expect(first?.utm_campaign).toBe('spring_launch');
  });

  it('recognises a social referrer when there is no tag', () => {
    arrive('/', 'https://www.linkedin.com/feed/');
    expect(currentAttribution().first?.channel).toBe('linkedin');
  });

  it('stores only the referring hostname, never the full address', () => {
    arrive('/', 'https://www.google.com/search?q=private+words');
    const stored = localStorage.getItem('meridian_attr_first') ?? '';
    expect(currentAttribution().first?.referrer_host).toBe('google.com');
    expect(stored).not.toContain('private');
  });

  it('does not count organic search as a marketing channel', () => {
    arrive('/', 'https://www.google.com/');
    expect(currentAttribution().first?.channel).toBe('google-organic');
  });

  it('keeps the first touch and refreshes the last one', () => {
    arrive('/?utm_source=facebook');
    arrive('/?utm_source=tiktok');
    const { first, last } = currentAttribution();
    expect(first?.channel).toBe('facebook');
    expect(last?.channel).toBe('tiktok');
  });

  it('upgrades a blank "direct" first visit when the visitor later arrives tagged', () => {
    arrive('/');
    arrive('/?utm_source=li');
    expect(currentAttribution().first?.channel).toBe('linkedin');
  });

  it('sends the first-touch channel as the booking source', () => {
    arrive('/?utm_source=yt');
    expect(attributionForSubmission()?.source).toBe('youtube');
  });

  it('sends nothing when nothing was captured, rather than inventing a source', () => {
    expect(attributionForSubmission()).toBeNull();
  });

  it('falls back to the website default for direct visits', () => {
    arrive('/');
    expect(attributionForSubmission()?.source).toBe('meridian-website:booking');
  });
});
