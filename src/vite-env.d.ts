/// <reference types="vite/client" />

/**
 * Vite inlines every VITE_ variable into the public bundle, so only values a
 * visitor may read belong here. The owner passcode is not one of them: it is a
 * Supabase Edge Function secret, checked server-side by the `owner` function.
 * A `VITE_OWNER_PASSCODE` declaration used to sit in this file — nothing read
 * it, but the name invited someone to set it, and setting it would have put the
 * passcode in every browser that loaded the site.
 */
interface ImportMetaEnv {
  /** Where booking enquiries are posted. Defaults to the `intake` function. */
  readonly VITE_LEAD_ENDPOINT?: string;
  /** The `owner` function: login, invoices, pricing, health. Defaults to production. */
  readonly VITE_OWNER_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
