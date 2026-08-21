/**
 * The pricing catalogue — fetched, never bundled.
 *
 * Every rate, the benchmark tiers, and the freelancer-vs-boutique-vs-agency
 * comparison used to be imported straight into this app, which meant Vite
 * compiled all of it into the JavaScript every visitor downloads. No public
 * page rendered any of it — which is exactly why it went unnoticed — but the
 * whole price list, and the competitive positioning with it, could be read out
 * of the bundle by anyone who opened the source.
 *
 * It now comes from the `owner` edge function after a successful login, through
 * the same token that guards the invoices. A client sees a price when Otis
 * sends them one, and not before.
 *
 * The interfaces stay here on purpose: TypeScript types are erased at build, so
 * they describe the shape without shipping a single number.
 */
import { getToken } from './ownerStore';

const DEFAULT_OWNER_ENDPOINT =
  'https://glzodwhyavexpuusbqjy.supabase.co/functions/v1/owner';

const OWNER_ENDPOINT: string =
  (import.meta.env.VITE_OWNER_ENDPOINT as string | undefined)?.trim() || DEFAULT_OWNER_ENDPOINT;

export interface LogoPricingTier {
  providerTier: string;
  basicLogo: string;
  basicLogoDesc: string;
  basicLogoRate: number;
  fullBrandPackage: string;
  fullBrandDesc: string;
  fullBrandRate: number;
  isBoutiqueStudio?: boolean;
  basicLogoDeliverables?: string[];
  fullBrandDeliverables?: string[];
}

export interface WebPricingScope {
  scopeTitle: string;
  freelancerRate: string;
  freelancerAvg: number;
  boutiqueRate: string;
  boutiqueAvg: number;
  deliverables: string;
  plainDeliverables: string[];
}

export interface BundledPackage {
  id: string;
  name: string;
  priceRange: string;
  defaultPrice: number;
  tagline: string;
  features: string[];
}

export interface PricingPreset {
  id: string;
  category: 'Web Design' | 'Logo Design' | 'Mobile App UI' | 'Analytics Dashboard' | 'Full Agency Package' | 'Hourly Design & Engineering';
  title: string;
  rate: number;
  range: string;
  description: string;
  plainDeliverables?: string[];
}

export interface PricingCatalogue {
  logo_tiers: LogoPricingTier[];
  web_scopes: WebPricingScope[];
  bundles: BundledPackage[];
  presets: PricingPreset[];
  /** id → display price, for the Client Answers entries. */
  explainer_prices: Record<string, string>;
  /** Benchmark hourly bands for the comparison table. */
  hourly_benchmarks: { freelancer: string; boutique: string; agency: string };
}

/** An empty catalogue, so the portal renders a loading state rather than crashing. */
export const EMPTY_CATALOGUE: PricingCatalogue = {
  logo_tiers: [], web_scopes: [], bundles: [], presets: [], explainer_prices: {},
  hourly_benchmarks: { freelancer: '—', boutique: '—', agency: '—' },
};

/**
 * Fetch the catalogue. Returns null when the session is missing or rejected —
 * the caller shows "couldn't load pricing" rather than an empty page that looks
 * like the catalogue is genuinely empty.
 */
export async function fetchCatalogue(): Promise<PricingCatalogue | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(OWNER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'catalogue' }),
    });
    if (!res.ok) return null;
    const body = await res.json();
    const c = body?.catalogue;
    if (!c) return null;
    return {
      logo_tiers: c.logo_tiers ?? [],
      web_scopes: c.web_scopes ?? [],
      bundles: c.bundles ?? [],
      presets: c.presets ?? [],
      explainer_prices: c.explainer_prices ?? {},
      hourly_benchmarks: c.hourly_benchmarks ?? { freelancer: '—', boutique: '—', agency: '—' },
    };
  } catch {
    return null;
  }
}
