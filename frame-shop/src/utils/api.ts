/**
 * Where the app's /api calls go.
 *
 * In the shop they go to the Express server in server.ts, which keeps bookings
 * and transactions on disk and asks Gemini for a diagnostic.
 *
 * On meridianinterface.com they cannot. The Meridian demos are static files
 * served from /demos/<slug>/ — there is no Node process, so every /api call
 * would 404 and the booking form, the ticket tracker, the till and the admin
 * portal would each fail on click. A portfolio piece that breaks the moment a
 * client touches it is worse than no portfolio piece.
 *
 * So when nothing answers, the same calls are served from here against the
 * browser's own storage. The screens behave: you book, the ticket number is
 * real, it appears in the tracker and in the admin portal, the till carries it
 * through to a receipt. Nothing leaves the browser and nothing is charged.
 * Clearing site data resets it.
 *
 * The one thing NOT faked is the AI diagnostic. It needs a Gemini key; a key on
 * a public page is a key anyone can spend; and inventing a plausible-looking
 * chassis diagnosis is worse than saying plainly that it needs the real server.
 */

const DEMO_STORE = 'frame-shop-demo-v1';

/** null until the first /api call tells us whether a server is there. */
let liveBackend: boolean | null = null;

export function getApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (
    typeof window !== 'undefined' &&
    window.location &&
    window.location.origin &&
    window.location.origin !== 'null' &&
    window.location.origin.startsWith('http')
  ) {
    return `${window.location.origin}${cleanPath}`;
  }
  return cleanPath;
}

/* ------------------------------------------------------------- demo store -- */

type Store = { bookings: Record<string, unknown>[]; transactions: Record<string, unknown>[] };

function read(): Store {
  try {
    const raw = localStorage.getItem(DEMO_STORE);
    if (raw) return JSON.parse(raw) as Store;
  } catch { /* private window or blocked storage — start empty */ }
  return { bookings: [], transactions: [] };
}

function write(s: Store): void {
  try { localStorage.setItem(DEMO_STORE, JSON.stringify(s)); } catch { /* as above */ }
}

const ticket = () => `FS-${Math.floor(100000 + Math.random() * 900000)}`;
const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Serve one /api call from the browser. Mirrors server.ts's shapes. */
function serveLocally(path: string, options?: RequestInit): Response {
  const method = (options?.method || 'GET').toUpperCase();
  let body: Record<string, any> = {};
  try { body = options?.body ? JSON.parse(String(options.body)) : {}; } catch { body = {}; }
  const store = read();
  const after = (prefix: string) => path.split(prefix)[1]?.split('/')[0] ?? '';

  if (path.includes('/api/health')) {
    return reply({ status: 'ok', demo: true, timestamp: new Date().toISOString() });
  }

  if (path.includes('/api/diagnostic')) {
    // Deliberately not answered — see the note at the top of this file.
    return reply({
      error:
        'The AI diagnostic runs on the shop’s own server and is not part of this ' +
        'demonstration. Everything else here works — book a job, track a ticket, ' +
        'or take a payment through the till.',
    }, 503);
  }

  if (path.includes('/api/bookings')) {
    const id = after('/api/bookings/');
    if (method === 'GET') return reply({ bookings: store.bookings });
    if (method === 'POST') {
      if (!body.name || !body.phone || !body.bikeMake || !body.bikeModel) {
        return reply({ error: 'Missing required contact or motorcycle details.' }, 400);
      }
      const booking = {
        ...body,
        id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        ticketNumber: ticket(),
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      store.bookings.unshift(booking);
      write(store);
      return reply({ success: true, booking });
    }
    if (method === 'PATCH') {
      const i = store.bookings.findIndex((b: any) => b.id === id || b.ticketNumber === id);
      if (i < 0) return reply({ error: 'Booking not found.' }, 404);
      store.bookings[i] = { ...store.bookings[i], ...body };
      write(store);
      return reply({ success: true, booking: store.bookings[i] });
    }
    if (method === 'DELETE') {
      store.bookings = store.bookings.filter((b: any) => b.id !== id && b.ticketNumber !== id);
      write(store);
      return reply({ success: true, message: 'Booking removed.' });
    }
  }

  if (path.includes('/api/transactions')) {
    if (path.includes('/refund')) {
      const id = after('/api/transactions/');
      const i = store.transactions.findIndex((t: any) => t.id === id || t.invoiceNumber === id);
      if (i < 0) return reply({ error: 'Transaction not found.' }, 404);
      store.transactions[i] = { ...store.transactions[i], status: 'Refunded', refundedAt: new Date().toISOString() };
      write(store);
      return reply({ success: true, transaction: store.transactions[i] });
    }
    if (method === 'GET') return reply({ transactions: store.transactions });
    if (method === 'POST') {
      const txn = {
        ...body,
        id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        invoiceNumber: body.invoiceNumber || `INV-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'Completed',
        createdAt: new Date().toISOString(),
      };
      store.transactions.unshift(txn);
      write(store);
      return reply({ success: true, transaction: txn });
    }
  }

  return reply({ error: 'Not available in this demonstration.' }, 404);
}

/* ------------------------------------------------------------------ fetch -- */

export async function safeFetch(path: string, options?: RequestInit): Promise<Response> {
  const isApi = path.includes('/api/');

  // Already know there is no server: do not make the request at all, so the
  // console stays clean and the screens stay instant.
  if (isApi && liveBackend === false) return serveLocally(path, options);

  try {
    const res = await fetch(getApiUrl(path), options);
    // A static host answers /api/... with a 404 page, or with index.html under a
    // SPA rewrite. Either way it is not the API. Decide once, then serve
    // everything locally from here on.
    if (isApi && liveBackend === null) {
      const isJson = (res.headers.get('content-type') || '').includes('application/json');
      liveBackend = res.ok && isJson;
      if (!liveBackend) return serveLocally(path, options);
    }
    return res;
  } catch {
    if (isApi) { liveBackend = false; return serveLocally(path, options); }
    throw new Error(`Request failed: ${path}`);
  }
}
