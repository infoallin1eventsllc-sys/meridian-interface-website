import { ServiceDetail, PortfolioItem, Appointment, Testimonial } from '../types';

/*
 * Images the app reaches for by name.
 *
 * The service and portfolio images are deliberately empty. Otis is designing
 * his own, and until they exist a blank is the honest state: ImageWithFallback
 * renders a branded panel carrying the item's icon and category, which reads as
 * designed rather than broken and costs no network request.
 *
 * Two ways to fill them. Photo Control in the owner portal publishes an image
 * to every visitor without touching the code. Or drop a file in
 * public/images/work/ and put its path here.
 */
export const HOTLINK_IMAGES = {
  globalEarthBg: '/images/hero-earth.jpg',
  // The service cards show the products Meridian actually built — the same
  // screenshots the portfolio uses — not concept renders. A service card that
  // shows a fictional client's dashboard says less than one that shows FinSight.
  webDesign: '/images/portfolio/modern-street.jpg',
  appDesign: '/images/portfolio/aurora-banking.jpg',
  dashboardDesign: '/images/portfolio/finsight-bi.jpg',
  techStack: '/images/portfolio/agentic-tech-stack.jpg',
  // No real logo product to show yet, so this one stays a rendered scene.
  logoDesign: '/images/work/svc-logo.jpg',
  fullPackage: '/images/portfolio/meridian-crm.jpg',
};

export const SERVICES: ServiceDetail[] = [
  {
    id: 'web_design',
    title: 'Custom Web Design & Development',
    categoryName: 'Web Development',
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
    id: 'tech_stack',
    title: 'Your Business Tech Stack, Chosen and Connected',
    categoryName: 'Systems & Integration',
    duration: '3 - 8 Weeks',
    icon: 'account_tree',
    summary: 'The set of tools your business runs on — website, bookings, payments, CRM, email — picked for how you actually work and wired together so information moves by itself.',
    description: 'A "tech stack" just means the tools your business runs on and how they talk to each other. Most small businesses end up with four or five that do not, so the same customer detail gets typed in three times and something always gets missed. We map how you actually work, choose tools that fit that, and connect them so a booking becomes a calendar entry, an invoice, and a follow-up without anyone re-keying it. You own the setup — no monthly fee that grows every time you hire.',
    features: [
      'A map of how work moves through your business today, before anything is bought',
      'Tools chosen to fit that — not the other way round',
      'Website, bookings, payments, CRM and email connected so nothing is typed twice',
      'One dashboard for the numbers you check daily',
      'Written down, so the next person you hire can follow it'
    ],
    image: HOTLINK_IMAGES.techStack
  },
  {
    id: 'logo_brand',
    title: 'Logo Design & Visual Identity',
    categoryName: 'Branding & Graphics',
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
/**
 * The tech stack service is written differently on purpose.
 *
 * "Tech stack" is our phrase, not the client's. Nobody wakes up wanting one —
 * they want to stop re-typing the same booking into three places. So the copy
 * leads with the day it fixes and lets the term arrive afterwards, defined.
 */
export const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p10',
    title: 'Agentic Tech Stack for Growing Businesses',
    category: 'systems',
    categoryLabel: 'Agentic Systems',
    client: 'Meridian Interface',
    // Built, running, and used with clients — so it says so, and the picture is
    // a screenshot of the real thing rather than an empty frame.
    year: '2026',
    demo: '/demos/stack-planner/',
    image: '/images/portfolio/agentic-tech-stack.jpg',
    summary: 'An always-on system a small business owns outright: an enquiry becomes a contact, the agent drafts the follow-up and the week\u2019s posts, a human approves, it publishes and measures, and a summary lands every Monday.',
    highlights: ['Runs without a person watching', 'Nothing sends unapproved', 'One system, no per-seat fees']
  },
  {
    id: 'p7',
    title: 'FinSight — Financial & Revenue Dashboard',
    category: 'dashboards',
    categoryLabel: 'Financial Dashboard',
    client: 'Finance',
    year: '2026',
    demo: '/demos/finsight/',
    image: '/images/portfolio/finsight-bi.jpg',
    gallery: [
      { src: '/images/portfolio/finsight-bi.jpg', caption: 'Executive summary — every figure against its target' },
      { src: '/images/portfolio/finsight-bi-revenue.jpg', caption: 'Revenue, with the forecast separated from what actually happened' },
      { src: '/images/portfolio/finsight-bi-forecast.jpg', caption: 'Profit and loss, with forecasts' },
      { src: '/images/portfolio/finsight-bi-treasury.jpg', caption: 'Treasury and currency exposure' },
    ],
    summary: 'The numbers a finance lead checks on a Monday, on one screen: revenue as it lands, each figure against its target, profit and loss with the forecast kept visibly separate from the actuals, cash runway, and currency exposure.',
    highlights: ['Every figure against target', 'Forecast kept apart from actuals', 'Board presentation mode']
  },
  {
    id: 'p8',
    title: 'Meridian CRM — Operations Hub',
    category: 'dashboards',
    categoryLabel: 'CRM Dashboard',
    client: 'Meridian Interface',
    // The studio's own desk, built and in daily use. The hosted copy keeps its
    // data in the visitor's browser, so anyone can click through it.
    year: '2026',
    demo: '/demos/meridian-crm/',
    image: '/images/portfolio/meridian-crm.jpg',
    gallery: [
      { src: '/images/portfolio/meridian-crm.jpg', caption: 'Overview — pipeline, money in and out, and what happened today' },
      { src: '/images/portfolio/meridian-crm-leads.jpg', caption: 'Leads funnel — every enquiry with its value and stage' },
      { src: '/images/portfolio/meridian-crm-invoices.jpg', caption: 'Invoices — sent, paid, overdue, and a receipt on mark-paid' },
      { src: '/images/portfolio/meridian-crm-kanban.jpg', caption: 'Kanban board — the week’s work, dragged between columns' },
    ],
    summary: 'The desk a small studio runs on: leads, clients, projects, invoices and software costs in one place, a copilot that reads the live figures before it answers, and a privacy switch that blurs every name and number the moment a screen is shared.',
    highlights: ['Privacy mode for screen sharing', 'Copilot reads the live figures', 'One owner, signed in with Google']
  },
  {
    id: 'p9',
    title: 'Data Analytics Intelligence Hub',
    category: 'dashboards',
    categoryLabel: 'Analytics Dashboard',
    client: 'Data & Analytics',
    year: '2026',
    demo: '/demos/analytics-hub/',
    image: '/images/portfolio/analytics-hub.jpg',
    gallery: [
      { src: '/images/portfolio/analytics-hub.jpg', caption: 'Dashboard — every metric against its target, with a confidence range' },
      { src: '/images/portfolio/analytics-hub-trends.jpg', caption: 'Trend models — four forecasts and what-if sliders' },
      { src: '/images/portfolio/analytics-hub-cohorts.jpg', caption: 'Cohorts — retention and net revenue retention by month joined' },
      { src: '/images/portfolio/analytics-hub-anomalies.jpg', caption: 'Anomalies — what moved, why, and what to do' },
    ],
    summary: 'A BI desk for a subscription business: every metric against its target with a confidence range, a live stream of what customers are doing, four forecasting models with what-if sliders, cohort retention tables, and an assistant that answers questions about the numbers in plain English.',
    highlights: ['Four forecast models, what-if sliders', 'Cohort retention and NRR', 'Ask the numbers a question']
  },
  {
    id: 'p1',
    title: 'ORCHESTRA — Enterprise Cloud Console',
    category: 'web_design',
    categoryLabel: 'Cloud Platform',
    client: 'Enterprise SaaS',
    year: '2026',
    demo: '/demos/orchestra/',
    image: '/images/portfolio/orchestra-cloud.jpg',
    gallery: [
      { src: '/images/portfolio/orchestra-cloud.jpg', caption: 'Cluster overview — multi-region topology with live inter-region latency' },
      { src: '/images/portfolio/orchestra-cloud-telemetry.jpg', caption: 'Telemetry stream' },
      { src: '/images/portfolio/orchestra-cloud-clusters.jpg', caption: 'Compute clusters' },
      { src: '/images/portfolio/orchestra-cloud-finops.jpg', caption: 'FinOps cost engine — spend by provider, with right-sizing recommendations' },
    ],
    summary: 'A console for running services across several clouds at once: a live map of regions and the latency between them, telemetry, staged deployments you can roll back, and a cost engine that shows where the money goes and what to do about it.',
    highlights: ['Multi-region topology', 'Canary deploy and rollback', 'FinOps cost engine']
  },
  {
    id: 'p2',
    title: 'Aurora Reserve — Private Banking Interface',
    category: 'app_design',
    categoryLabel: 'Financial App Design',
    client: 'Private Wealth',
    year: '2026',
    demo: '/demos/aurora/',
    image: '/images/portfolio/aurora-banking.jpg',
    gallery: [
      { src: '/images/portfolio/aurora-banking.jpg', caption: 'Two devices driven side by side from one console — vault and portfolio' },
      { src: '/images/portfolio/aurora-banking-decks.jpg', caption: 'Telemetry decks and the transaction ledger' },
    ],
    summary: 'A private banking interface shown as two phones side by side, driven from one screen: balances and holdings on one, the transaction ledger and a concierge line on the other, with multi-currency switching and an approval step before anything moves.',
    highlights: ['Two devices, one console', 'Multi-currency switching', 'Approval before money moves']
  },
  {
    id: 'p4',
    title: 'Apparel Design & Brand Studio App',
    category: 'app_design',
    categoryLabel: 'App Design',
    client: 'Apparel / DTC',
    year: 'Concept',
    image: '/images/work/apparel-studio.jpg',
    summary: 'Clothing design app concept: garment canvas with colourways and print specification, alongside the label\u2019s logo, palette and applied brand kit.',
    highlights: ['Garment spec to factory', 'Logo & brand kit builder', 'Live unit costing']
  },
  {
    id: 'p5',
    title: 'Artisan Coffee Brand Identity',
    category: 'logo_brand',
    categoryLabel: 'Logo & Branding',
    client: 'Consumer / Retail',
    year: 'Concept',
    image: '/images/work/coffee-identity.jpg',
    summary: 'Brand-identity concept: organic logo mark, packaging vector graphics, and storefront signage direction.',
    highlights: ['Custom typography', 'Packaging vectors', 'Brand identity kit']
  },
  {
    id: 'p6',
    title: 'MODERN_STREET — Streetwear Storefront',
    category: 'web_design',
    categoryLabel: 'E-Commerce',
    client: 'Retail / DTC',
    year: '2026',
    demo: '/demos/modern-street/',
    image: '/images/portfolio/modern-street.jpg',
    gallery: [
      { src: '/images/portfolio/modern-street.jpg', caption: 'The catalogue — every garment photographed on the same ground' },
      { src: '/images/portfolio/modern-street-product.jpg', caption: 'A product, with a second view, colourway and size' },
      { src: '/images/portfolio/modern-street-cart.jpg', caption: 'The bag, with quantities and a promo code' },
      { src: '/images/portfolio/modern-street-checkout.jpg', caption: 'Checkout — a demonstration, so no card is asked for and nothing is charged' },
    ],
    summary: 'A high-contrast streetwear storefront with an editorial feel: curated essentials, seasonal collections, a product page with colour and size, a cart that remembers what was chosen, and a checkout that gets out of the way.',
    highlights: ['Editorial layout and type', 'Colour and size variants', 'Cart to checkout in three steps']
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

/*
 * The pricing catalogue used to live here — logo tiers, web scopes, bundles,
 * and the invoice presets, with every rate in them.
 *
 * That was a leak. Anything imported into this app is compiled into the
 * JavaScript every visitor downloads, so the full rate card and the
 * freelancer-vs-boutique-vs-agency comparison could be read straight out of
 * the site's source. No public page rendered any of it, which is precisely why
 * nobody noticed.
 *
 * It lives in the database now and reaches the owner portal through the `owner`
 * edge function, behind the same token that guards the invoices. See
 * src/lib/catalogue.ts. Clients see a price when Otis sends them one.
 */

export const INITIAL_OWNER_INVOICES: any[] = [
  {
    id: 'INV-OWN-2026-001',
    clientName: 'Internal Studio Audit',
    clientCompany: 'Meridian Interface',
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

