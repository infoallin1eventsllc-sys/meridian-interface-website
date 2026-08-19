export type TabType = 'home' | 'services' | 'portfolio' | 'booking' | 'appointments' | 'owner_invoice';

export type ServiceCategory = 'web_design' | 'app_design' | 'dashboards' | 'logo_brand' | 'full_package';

export interface InvoiceLineItem {
  id: string;
  description: string;
  category: 'Web Design' | 'Logo Design' | 'Mobile App UI' | 'Analytics Dashboard' | 'Custom';
  quantity: number;
  rate: number;
  amount: number;
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
  priceRange: string;
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
  category: 'web_design' | 'app_design' | 'dashboards' | 'logo_brand';
  categoryLabel: string;
  client: string;
  year: string;
  image: string;
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
