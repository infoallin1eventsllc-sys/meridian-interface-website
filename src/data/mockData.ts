import { ServiceDetail, PortfolioItem, Appointment, Testimonial } from '../types';

export const HOTLINK_IMAGES = {
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  heroBg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop',
  globalEarthBg: '/images/hero-earth.jpg',
  heroFutureHands: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
  webDesign: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
  appDesign: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000&auto=format&fit=crop',
  dashboardDesign: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
  logoDesign: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop',
  fullPackage: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1000&auto=format&fit=crop',
  avatar1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  avatar2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
  avatar3: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop'
};

export const SERVICES: ServiceDetail[] = [
  {
    id: 'web_design',
    title: 'Custom Web Design & Development',
    categoryName: 'Web Development',
    priceRange: '$1,500 - $6,000',
    duration: '1 - 3 Weeks',
    icon: 'language',
    summary: 'High-converting, responsive websites engineered with tailored UX, swift loading speeds, and SEO optimization.',
    description: 'We build bespoke digital web experiences designed to captivate your audience, drive user engagement, and convert visitors into loyal clients. From landing pages to enterprise web portals.',
    features: [
      '100% Custom Responsive Layouts',
      'SEO & Performance Optimization',
      'CMS & Content Management Setup',
      'E-Commerce & Payment Gateways',
      'Interactive Micro-Animations'
    ],
    image: HOTLINK_IMAGES.webDesign
  },
  {
    id: 'app_design',
    title: 'Mobile App Design & Development',
    categoryName: 'iOS & Android Apps',
    priceRange: '$2,500 - $10,000',
    duration: '2 - 4 Weeks',
    icon: 'phone_iphone',
    summary: 'Native and cross-platform mobile apps with intuitive touch interfaces and sleek design systems.',
    description: 'Transform your product vision into a sleek, high-performing mobile application. We design end-to-end mobile user flows, clickable prototypes, and full-stack iOS/Android codebases.',
    features: [
      'iOS & Android UI/UX Design',
      'Interactive Figma Prototypes',
      'Cross-Platform React Native/Flutter',
      'User Authentication & Push Alerts',
      'App Store & Play Store Publishing'
    ],
    image: HOTLINK_IMAGES.appDesign
  },
  {
    id: 'dashboards',
    title: 'Data Analyst, CRM & Financial Dashboards',
    categoryName: 'Analytics & CRM Dashboards',
    priceRange: '$2,000 - $8,500',
    duration: '1 - 3 Weeks',
    icon: 'analytics',
    summary: 'Bespoke Data Analyst BI dashboards, high-converting CRM sales portals, and executive Financial KPI dashboards.',
    description: 'Empower your enterprise with real-time data visualizers. We craft custom Data Analyst BI views, CRM lead pipelines & customer management portals, and financial forecasting dashboards with clean charts and metrics.',
    features: [
      'Data Analyst Visualizers & BI Charts',
      'CRM Sales Pipelines & Lead Dashboards',
      'Financial Revenue, P&L & KPI Monitors',
      'Interactive Filtering & Exporting',
      'Real-Time API & Database Integration'
    ],
    image: HOTLINK_IMAGES.dashboardDesign
  },
  {
    id: 'logo_brand',
    title: 'Logo Design & Visual Identity',
    categoryName: 'Branding & Graphics',
    priceRange: '$600 - $2,200',
    duration: '3 - 7 Days',
    icon: 'draw',
    summary: 'Distinctive vector logos, typographic systems, and comprehensive brand identity guidelines.',
    description: 'Build a memorable, scalable brand identity. We craft iconic logos, custom vector iconography, color palettes, and typography rules that set your company apart from competitors.',
    features: [
      'Vector Master Files (SVG, AI, EPS, PNG)',
      'Multiple Initial Logo Concepts',
      'Brand Style Guide & Color Palette',
      'Typography & Font Pairings',
      'Business Card & Social Media Kit'
    ],
    image: HOTLINK_IMAGES.logoDesign
  },
  {
    id: 'full_package',
    title: 'Full Studio Design Bundle',
    categoryName: 'Web + App + Dashboard + Brand',
    priceRange: '$4,000 - $14,000',
    duration: '3 - 5 Weeks',
    icon: 'workspace_premium',
    summary: 'Complete digital transformation: Custom Web, Mobile App UI, Analytics Dashboards & Complete Brand Identity.',
    description: 'Get total brand cohesion across all digital touchpoints. The ultimate package for startups and expanding businesses looking for web, mobile app, CRM/Financial dashboards, and vector brand assets.',
    features: [
      'Complete Web Design & Launch',
      'Full Mobile App UI/UX & Prototype',
      'Custom CRM, Data Analyst & Financial Dashboard',
      'Custom Vector Logo & Brand Suite',
      'Priority Appointment Consultations'
    ],
    image: HOTLINK_IMAGES.fullPackage
  }
];

// Concept / sample work — capability demonstrations, not delivered client engagements.
// `client` holds the target sector, not a real customer name. Replace with real case
// studies (and add measurable outcomes) once they are available.
export const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p7',
    title: 'Financial & Revenue BI Dashboard',
    category: 'dashboards',
    categoryLabel: 'Financial Dashboard',
    client: 'Finance',
    year: 'Concept',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    summary: 'Executive financial dashboard concept tracking real-time revenue, P&L forecasts, cash-flow metrics, and portfolio performance.',
    highlights: ['Financial KPI system', 'Real-time revenue views', 'Exportable reporting']
  },
  {
    id: 'p8',
    title: 'CRM Sales & Lead Pipeline Portal',
    category: 'dashboards',
    categoryLabel: 'CRM Dashboard',
    client: 'B2B SaaS',
    year: 'Concept',
    image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=800&auto=format&fit=crop',
    summary: 'CRM portal concept for sales teams with visual kanban pipelines, deal stages, and rep performance views.',
    highlights: ['Lead pipeline visualizer', 'Deal-stage tracking', 'Activity logging']
  },
  {
    id: 'p9',
    title: 'Data Analytics Intelligence Hub',
    category: 'dashboards',
    categoryLabel: 'Analytics Dashboard',
    client: 'Data & Analytics',
    year: 'Concept',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop',
    summary: 'Analytics BI concept featuring interactive metrics, real-time charts, trend models, and cohort analysis.',
    highlights: ['Cohort analysis', 'Custom query builder', 'Interactive charts']
  },
  {
    id: 'p1',
    title: 'Enterprise Cloud Platform — Web UI',
    category: 'web_design',
    categoryLabel: 'Web Design',
    client: 'Enterprise SaaS',
    year: 'Concept',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    summary: 'Web dashboard and landing-page concept for an enterprise cloud orchestration platform.',
    highlights: ['React + Tailwind', 'Interactive data viz', 'Responsive system']
  },
  {
    id: 'p2',
    title: 'Mobile Banking & Wealth App',
    category: 'app_design',
    categoryLabel: 'Financial App Design',
    client: 'Fintech',
    year: 'Concept',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
    summary: 'Dark-mode financial analytics and mobile banking concept with portfolio charts and biometric-style flows.',
    highlights: ['Financial analytics UI', 'Live market charts', 'Secure sign-in flow']
  },
  {
    id: 'p4',
    title: 'Health & Fitness Tracking App',
    category: 'app_design',
    categoryLabel: 'App Design',
    client: 'Wellness',
    year: 'Concept',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    summary: 'Fitness-tracking app concept with custom workout builders and wearable-sync patterns.',
    highlights: ['React Native patterns', 'Live activity charts', 'Wearable sync UX']
  },
  {
    id: 'p5',
    title: 'Artisan Coffee Brand Identity',
    category: 'logo_brand',
    categoryLabel: 'Logo & Branding',
    client: 'Consumer / Retail',
    year: 'Concept',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    summary: 'Brand-identity concept: organic logo mark, packaging vector graphics, and storefront signage direction.',
    highlights: ['Custom typography', 'Packaging vectors', 'Brand identity kit']
  },
  {
    id: 'p6',
    title: 'E-Commerce Storefront',
    category: 'web_design',
    categoryLabel: 'Web Design',
    client: 'Retail / DTC',
    year: 'Concept',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    summary: 'E-commerce web concept with product preview and a streamlined checkout flow.',
    highlights: ['Custom storefront theme', 'Product inspector', 'Performance-first build']
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-1082',
    clientName: 'Alexander Hayes',
    clientEmail: 'alex.hayes@hayesmedia.co',
    clientPhone: '+1 (555) 234-8901',
    companyName: 'Hayes Media Group',
    serviceType: 'web_design',
    serviceTitle: 'Custom Web Design & Development',
    preferredDate: '2026-08-04',
    preferredTimeSlot: '10:00 AM - 11:00 AM EST',
    budgetRange: '$3,000 - $5,000',
    notes: 'Looking to redesign our corporate agency website with modern interactive motion and client intake portal.',
    status: 'Confirmed',
    createdAt: '2026-07-28'
  },
  {
    id: 'APT-1083',
    clientName: 'Samantha Wu',
    clientEmail: 'sam@nexustech.io',
    clientPhone: '+1 (555) 876-1234',
    companyName: 'Nexus Tech',
    serviceType: 'app_design',
    serviceTitle: 'Mobile App Design & Development',
    preferredDate: '2026-08-06',
    preferredTimeSlot: '02:00 PM - 03:00 PM EST',
    budgetRange: '$5,000 - $10,000',
    notes: 'Need iOS and Android UI/UX wireframes for our fintech SaaS product launch.',
    status: 'Scheduled',
    createdAt: '2026-07-30'
  }
];

// Testimonials must be real, attributable client quotes — no invented reviews ship here.
// Populate this array once genuine client testimonials (with permission) are available.
export const TESTIMONIALS: Testimonial[] = [];

export interface LogoPricingTier {
  providerTier: string;
  basicLogo: string;
  basicLogoDesc: string;
  basicLogoRate: number;
  fullBrandPackage: string;
  fullBrandDesc: string;
  fullBrandRate: number;
  isBoutiqueStudio?: boolean;
}

export const LOGO_PRICING_TIERS: LogoPricingTier[] = [
  {
    providerTier: 'Freelancer / Independent',
    basicLogo: '$300 – $1,500',
    basicLogoDesc: 'Basic logo mark, color variants, standard image exports',
    basicLogoRate: 800,
    fullBrandPackage: '$1,500 – $4,000',
    fullBrandDesc: 'Logo suite, font pairing, color palette, mini style guide',
    fullBrandRate: 2500
  },
  {
    providerTier: 'Boutique Design Studio (Meridian Interface)',
    basicLogo: '$1,500 – $3,500',
    basicLogoDesc: 'Custom primary/secondary logos, vector source files, icon set',
    basicLogoRate: 2500,
    fullBrandPackage: '$3,500 – $10,000+',
    fullBrandDesc: 'Comprehensive strategy, logo system, social kit, full brand guidelines',
    fullBrandRate: 6500,
    isBoutiqueStudio: true
  },
  {
    providerTier: 'Enterprise Agency',
    basicLogo: '$10,000 – $25,000+',
    basicLogoDesc: 'Enterprise identity discovery & stakeholder research',
    basicLogoRate: 15000,
    fullBrandPackage: '$25,000 – $100,000+',
    fullBrandDesc: 'Global brand repositioning, trademark research, worldwide strategy',
    fullBrandRate: 50000
  }
];

export interface WebPricingScope {
  scopeTitle: string;
  freelancerRate: string;
  freelancerAvg: number;
  boutiqueRate: string;
  boutiqueAvg: number;
  deliverables: string;
}

export const WEB_PRICING_SCOPES: WebPricingScope[] = [
  {
    scopeTitle: 'Single-Page / Landing Page Site',
    freelancerRate: '$800 – $2,500',
    freelancerAvg: 1500,
    boutiqueRate: '$2,500 – $5,000',
    boutiqueAvg: 3800,
    deliverables: 'High-converting responsive landing page, lead capture, mobile optimization, basic SEO.'
  },
  {
    scopeTitle: 'Custom 3–7 Page Business Site',
    freelancerRate: '$2,500 – $6,000',
    freelancerAvg: 4000,
    boutiqueRate: '$5,000 – $12,000',
    boutiqueAvg: 8500,
    deliverables: 'Multi-screen UX design, service showcases, contact routing, CMS integration, fast loading.'
  },
  {
    scopeTitle: 'Complex Custom Web App / Multi-Page Portal',
    freelancerRate: '$6,000 – $15,000',
    freelancerAvg: 10000,
    boutiqueRate: '$12,000 – $35,000+',
    boutiqueAvg: 22000,
    deliverables: 'Full-stack frontend/backend architecture, user authentication, custom dashboard, API integrations.'
  }
];

export interface BundledPackage {
  id: string;
  name: string;
  priceRange: string;
  defaultPrice: number;
  tagline: string;
  features: string[];
}

export const AGENCY_BUNDLED_PACKAGES: BundledPackage[] = [
  {
    id: 'bundle_starter',
    name: 'Starter Package',
    priceRange: '$3,500 – $5,500',
    defaultPrice: 4500,
    tagline: 'Ideal for early-stage startups and small businesses establishing a digital presence.',
    features: [
      'Custom Primary Logo & Typography Guide',
      'High-Converting 3–5 Page Custom Website',
      'Full Mobile Responsiveness & On-Page SEO',
      'Contact Form & Lead Routing Setup'
    ]
  },
  {
    id: 'bundle_growth',
    name: 'Growth / Professional Package',
    priceRange: '$7,500 – $14,000',
    defaultPrice: 9500,
    tagline: 'Comprehensive brand suite & interactive web application for growing companies.',
    features: [
      'Full Brand Suite (Primary Logo, Secondary Mark, Favicon, Brand Guidelines)',
      'Custom 6–12 Page Web App / Site with Custom UI/UX',
      'Interactive Tools (Cost Calculator, Booking System, Client Portal)',
      'Domain Setup, Analytics Integration & Launch Support'
    ]
  },
  {
    id: 'bundle_enterprise',
    name: 'Enterprise / Custom Application',
    priceRange: '$15,000 – $35,000+',
    defaultPrice: 22500,
    tagline: 'Mission-critical full-stack platform built for enterprise scale & seamless performance.',
    features: [
      'Full Custom Full-Stack Web Platform or Mobile App Interface',
      'Custom API Integrations & Analytics Dashboards',
      'Scalable Backend Architecture & Security Setup'
    ]
  }
];

export const INDUSTRY_PRICING_PRESETS = [
  {
    id: 'preset_bundle_starter',
    category: 'Full Agency Package' as const,
    title: 'Starter Package (Boutique Studio)',
    rate: 4500,
    range: '$3,500 – $5,500',
    description: 'Custom Primary Logo, Typography Guide, 3-5 Page Custom Site, Mobile SEO, Contact Form setup.'
  },
  {
    id: 'preset_bundle_growth',
    category: 'Full Agency Package' as const,
    title: 'Growth / Professional Package',
    rate: 9500,
    range: '$7,500 – $14,000',
    description: 'Full Brand Suite, 6-12 Page Custom Web App with UI/UX, Interactive Tools, Domain & Launch.'
  },
  {
    id: 'preset_bundle_enterprise',
    category: 'Full Agency Package' as const,
    title: 'Enterprise Custom Application',
    rate: 22500,
    range: '$15,000 – $35,000+',
    description: 'Full-stack web platform / mobile app interface, API integrations, Analytics Dashboards & architecture.'
  },
  {
    id: 'preset_web_custom',
    category: 'Web Design' as const,
    title: 'Custom 3–7 Page Business Site (Boutique Rate)',
    rate: 8500,
    range: '$5,000 – $12,000',
    description: 'Custom multi-screen UX, service showcases, contact routing, CMS, responsive layout & performance tuning.'
  },
  {
    id: 'preset_web_landing',
    category: 'Web Design' as const,
    title: 'Single-Page / Landing Page Site',
    rate: 3800,
    range: '$2,500 – $5,000',
    description: 'High-converting responsive landing page, lead capture, mobile optimization, basic SEO.'
  },
  {
    id: 'preset_web_portal',
    category: 'Web Design' as const,
    title: 'Complex Web App / Multi-Page Portal',
    rate: 18500,
    range: '$12,000 – $35,000+',
    description: 'Full-stack application framework, auth flow, custom dashboards, API integrations, scalable backend.'
  },
  {
    id: 'preset_logo_boutique',
    category: 'Logo Design' as const,
    title: 'Boutique Logo Design Suite (Meridian Standard)',
    rate: 2500,
    range: '$1,500 – $3,500',
    description: 'Custom primary & secondary logos, vector source files (SVG/EPS), custom icon set.'
  },
  {
    id: 'preset_logo_full_brand',
    category: 'Logo Design' as const,
    title: 'Full Brand Identity Package (Boutique Tier)',
    rate: 6500,
    range: '$3,500 – $10,000+',
    description: 'Comprehensive brand strategy, logo system, social kit, typography, full brand guidelines book.'
  },
  {
    id: 'preset_hourly_studio',
    category: 'Hourly Design & Engineering' as const,
    title: 'Boutique Studio Engineering Hourly Rate',
    rate: 150,
    range: '$100 – $200 / hr',
    description: 'Custom design & development rate per hour for maintenance, consulting, or feature extensions.'
  }
];

export const INITIAL_OWNER_INVOICES: any[] = [
  {
    id: 'INV-OWN-2026-001',
    clientName: 'Internal Studio Audit',
    clientCompany: 'Meridian Digital Design Studio LLC',
    clientEmail: 'otis@meridianinterface.com',
    clientPhone: '281-882-9198',
    issueDate: '2026-07-31',
    dueDate: '2026-08-15',
    lineItems: [
      {
        id: 'li_1',
        description: 'Custom Web Design & Development — Enterprise Responsive Web Platform',
        category: 'Web Design',
        quantity: 1,
        rate: 6500,
        amount: 6500
      },
      {
        id: 'li_2',
        description: 'Custom Vector Logo & Complete Enterprise Brand Identity Suite',
        category: 'Logo Design',
        quantity: 1,
        rate: 2500,
        amount: 2500
      },
      {
        id: 'li_3',
        description: 'Mobile App UI/UX Interface Design System (iOS & Android)',
        category: 'Mobile App UI',
        quantity: 1,
        rate: 4500,
        amount: 4500
      },
      {
        id: 'li_4',
        description: 'Enterprise Real-Time Analytics Dashboard & Data Visualizations',
        category: 'Analytics Dashboard',
        quantity: 1,
        rate: 5000,
        amount: 5000
      }
    ],
    subtotal: 18500,
    discountPercentage: 0,
    taxPercentage: 0,
    totalAmount: 18500,
    status: 'Internal Audit',
    notes: 'CONFIDENTIAL INTERNAL OWNER RECORD — Benchmark industry pricing summary for web design, logos, mobile app interfaces, and enterprise dashboards.',
    isOwnerOnly: true,
    createdAt: '2026-07-31'
  }
];

