import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { Analytics } from '@vercel/analytics/react';
import { captureAttribution } from './lib/attribution';
import './index.css';

// Record where this visit came from before anything renders. A visitor who
// lands and leaves without booking still tells us which channel is working,
// and the first touch is what a later booking will be credited to.
captureAttribution();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* Traffic, not conversions. attribution.ts above answers "which channel
        earned this booking"; it only pays out when someone actually books, so
        every visitor who reads and leaves is invisible to it. This supplies the
        denominator: visits, referrers, country, device. Cookieless and
        aggregate, so it needs no consent banner, and it is served from our own
        origin at /_vercel/insights/* in production, which is why the strict CSP in
        vercel.json (script-src 'self') already allows it. A third-party tag
        would not load without loosening that policy.
        Note: this is a tab-switching SPA with no router, so the URL never
        changes and every visit records as one view of "/". Section-level
        interest would need explicit events, which is a separate decision. */}
    <Analytics />
  </StrictMode>,
);
