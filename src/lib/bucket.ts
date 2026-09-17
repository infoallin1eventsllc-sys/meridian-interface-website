/**
 * The client's saved items — their "bucket".
 *
 * What this is for: a visitor goes through the demos, finds the pieces they
 * want, and keeps them somewhere. When they are ready they send the list to
 * the studio and it arrives as a booked appointment. Otis talks it through
 * with them, then sends an itemised invoice for exactly the items on the list.
 *
 * NO PRICES LIVE HERE, AND NONE MAY BE ADDED.
 * ==========================================================================
 * That is the whole point of the mechanism. A cart that totals itself lets a
 * client assemble a figure on their own, from a page, before anyone has looked
 * at what they actually need — which is precisely what this replaces. There is
 * no `price` field, no subtotal, and no quantity, because a quantity implies a
 * unit price. The list says WHAT they want. What it costs is answered once, by
 * Otis, in an invoice that shows what each line is for.
 *
 * Where it lives: this browser, until they send it. There are no client
 * accounts, so there is nothing to attach a server-side list to — and asking a
 * visitor to make an account before they can keep a shortlist loses most of
 * them. The list survives closing the tab; it does not follow them to another
 * device, which is an accepted trade and the reason the send step exists.
 */

const KEY = 'meridian_saved_items';

export interface SavedItem {
  /** The portfolio or service id, so the same thing cannot be saved twice. */
  id: string;
  kind: 'work' | 'service';
  title: string;
  /** Category label, or the client's name for a piece of work. */
  subtitle: string;
  image?: string;
  /**
   * The Client Answer this product declares as its own, carried from
   * mockData rather than worked out later from the title. Matching by text
   * found 4 of the 15 things a client can save, because the site sells under
   * product names and the answers are filed under invoice-line names.
   * `null` means none is written yet, and the drafted reply says so.
   */
  explainerId?: string | null;
  /** ISO timestamp, so the list reads in the order they chose things. */
  addedAt: string;
}

type Listener = (items: SavedItem[]) => void;
const listeners = new Set<Listener>();

function read(): SavedItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedItem[]).filter((i) => i && i.id && i.title) : [];
  } catch {
    // Private windows, cleared site data, a quota error mid-write. A saved
    // list is a convenience; it must never be the reason a page fails to open.
    return [];
  }
}

function write(items: SavedItem[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* see read() */
  }
  listeners.forEach((fn) => fn(items));
}

export function getBucket(): SavedItem[] {
  return read();
}

export function bucketCount(): number {
  return read().length;
}

export function isSaved(id: string): boolean {
  return read().some((i) => i.id === id);
}

/** Add, or remove if it is already there. Returns the state after the click. */
export function toggleSaved(item: Omit<SavedItem, 'addedAt'>): boolean {
  const items = read();
  const existing = items.findIndex((i) => i.id === item.id);
  if (existing >= 0) {
    items.splice(existing, 1);
    write(items);
    return false;
  }
  items.push({ ...item, addedAt: new Date().toISOString() });
  write(items);
  return true;
}

export function removeSaved(id: string): void {
  write(read().filter((i) => i.id !== id));
}

export function clearBucket(): void {
  write([]);
}

/** Subscribe to changes, so a header count and a card's button agree. */
export function onBucketChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * The saved list as the lines of a message to the studio.
 *
 * This text is what Otis reads in the CRM, and it is what he prices against,
 * so it names each item plainly and says nothing about money.
 */
export function bucketAsNote(items: SavedItem[]): string {
  if (!items.length) return '';
  const lines = items.map((i, n) => `${n + 1}. ${i.title}${i.subtitle ? ` (${i.subtitle})` : ''}`);
  return [
    `Items saved from the site (${items.length}):`,
    ...lines,
  ].join('\n');
}
