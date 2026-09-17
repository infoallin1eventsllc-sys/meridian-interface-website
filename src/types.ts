export type TabType = 'home' | 'services' | 'portfolio' | 'booking' | 'bucket' | 'appointments' | 'owner_invoice' | 'legal';

export type ServiceCategory = 'web_design' | 'app_design' | 'dashboards' | 'logo_brand' | 'systems' | 'tech_stack' | 'full_package';

export interface InvoiceLineItem {
  id: string;
  description: string;
  category: 'Web Design' | 'Logo Design' | 'Mobile App UI' | 'Analytics Dashboard' | 'Custom';
  quantity: number;
  rate: number;
  amount: number;
  /**
   * What the client actually receives for this line, one deliverable per entry.
   *
   * The pricing catalogue already itemises every package, but adding one to an
   * invoice used to flatten that list into a single run-on sentence — so a
   * client looking at an $8,500 line saw a wall of words rather than the four
   * things they were buying. Keeping the array intact means the invoice can
   * show the breakdown, and the studio can edit it per client.
   */
  deliverables?: string[];
  /**
   * Optional scope boundary. What a client assumes is included, and isn't, is
   * where fixed-price work goes wrong; saying it on the invoice is cheaper than
   * arguing about it later.
   */
  excluded?: string[];
}

export interface OwnerInvoice {
  id: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discountPercentage: number;
  taxPercentage: number;
  totalAmount: number;
  status: 'Draft' | 'Issued' | 'Paid' | 'Internal Audit';
  notes: string;
  isOwnerOnly: boolean;
  createdAt: string;
}


/**
 * When one service is sold at more than one size, the sizes a client chooses
 * between before saving it.
 *
 * Web design is the case this exists for. A client wanting a landing page and
 * a client wanting twelve pages were clicking the same card, so the reply they
 * got described a three-to-seven page site either way and Otis had to correct
 * it by hand. Asking once, on the card, costs the client one click and saves
 * that whole exchange.
 */
export interface ServiceSize {
  id: string;
  /** What the client picks, in their terms. */
  label: string;
  /** One line under the label, so the choice is obvious without guessing. */
  hint: string;
  /** The Client Answer this size declares. Same contract as explainerId. */
  explainerId: string;
}

export interface ServiceDetail {
  id: ServiceCategory;
  title: string;
  categoryName: string;
  /**
   * Which Client Answer belongs to this product.
   *
   * Declared, never guessed. The reply a client gets when they save this item
   * is built from the answer named here, so the link has to be stated rather
   * than inferred from the words in the title — the titles on this site are
   * product names, and the answers are filed under invoice-line names, and
   * matching one to the other by text found 4 of 15.
   *
   * `null` means no answer is written for it yet. That is deliberate and
   * visible: the drafted reply says so out loud rather than describing the
   * product with the nearest thing that happened to match.
   */
  explainerId: string | null;
  /** Sizes this service is sold at. Absent when it only comes one way. */
  sizes?: ServiceSize[];

  /**
   * Deliberately absent. Prices are quoted on an invoice, not published — and
   * anything in this file ships to every visitor's browser whether a page
   * renders it or not.
   */
  duration: string;
  icon: string;
  summary: string;
  description: string;
  features: string[];
  image: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  /**
   * Which Client Answer belongs to this product.
   *
   * Declared, never guessed. The reply a client gets when they save this item
   * is built from the answer named here, so the link has to be stated rather
   * than inferred from the words in the title — the titles on this site are
   * product names, and the answers are filed under invoice-line names, and
   * matching one to the other by text found 4 of 15.
   *
   * `null` means no answer is written for it yet. That is deliberate and
   * visible: the drafted reply says so out loud rather than describing the
   * product with the nearest thing that happened to match.
   */
  explainerId: string | null;

  category: 'web_design' | 'app_design' | 'dashboards' | 'logo_brand' | 'systems';
  categoryLabel: string;
  client: string;
  year: string;
  image: string;
  /** Extra screens, shown full-size when the picture is opened. */
  gallery?: { src: string; caption: string }[];
  /** A working copy a visitor can click through, served from this site. */
  demo?: string;
  /** A film of the work. When set, the detail panel plays this instead of
      showing the still — see components/ReelPlayer.tsx and lib/reel.ts. */
  video?: string;
  summary: string;
  highlights: string[];
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  serviceType: ServiceCategory;
  serviceTitle: string;
  preferredDate: string;
  preferredTimeSlot: string;
  budgetRange: string;
  notes: string;
  /**
   * The saved list as data, not prose.
   *
   * `notes` carries the same items as readable text, because a human reads
   * that in the CRM and in the booking alert. This is the machine's copy: the
   * back end builds the client's reply from `explainerId` here rather than
   * parsing the note and guessing which answer a title meant. Absent on an
   * ordinary booking that did not come from a saved list.
   */
  items?: SavedListLine[];
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'In Review';
  createdAt: string;
}

/** One product a client picked, with the Client Answer it declares. */
export interface SavedListLine {
  id: string;
  kind: 'work' | 'service';
  title: string;
  subtitle: string;
  explainerId: string | null;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  avatar: string;
  comment: string;
  rating: number;
}
