export type TabType = 'home' | 'services' | 'portfolio' | 'booking' | 'appointments' | 'owner_invoice';

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

export interface ServiceDetail {
  id: ServiceCategory;
  title: string;
  categoryName: string;
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
  category: 'web_design' | 'app_design' | 'dashboards' | 'logo_brand' | 'systems';
  categoryLabel: string;
  client: string;
  year: string;
  image: string;
  /** Extra screens, shown full-size when the picture is opened. */
  gallery?: { src: string; caption: string }[];
  /** A working copy a visitor can click through, served from this site. */
  demo?: string;
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
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'In Review';
  createdAt: string;
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
