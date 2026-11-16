import { describe, expect, it } from 'vitest';
import { demoAddress, demoLinkProps, isExternalDemo } from '../../src/lib/demoLink';

describe('demo links', () => {
  it('opens demos hosted on this site in the same tab', () => {
    expect(isExternalDemo('/demos/frame-shop/')).toBe(false);
    expect(demoLinkProps('/demos/frame-shop/')).toEqual({ href: '/demos/frame-shop/' });
  });

  it('opens apps hosted elsewhere in a new tab without giving them access to this page', () => {
    const props = demoLinkProps('https://meridian-hiring-api.vercel.app/');
    expect(props).toEqual({ href: 'https://meridian-hiring-api.vercel.app/', target: '_blank', rel: 'noopener' });
  });

  it('shows a clean address in the browser frame', () => {
    expect(demoAddress('/demos/haven/')).toBe('meridianinterface.com/demos/haven');
    expect(demoAddress('https://meridian-hiring-api.vercel.app/')).toBe('meridian-hiring-api.vercel.app');
  });
});
