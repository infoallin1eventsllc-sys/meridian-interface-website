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
  // shows a fictional client's dashboard says less than one that shows the
  // studio's own. FinSight and then the Analytics Hub were the dashboard here;
  // both were taken off the site (13 Oct). The card reads "Data Analyst, CRM &
  // Financial Dashboards", so it shows the Meridian CRM's invoices screen.
  webDesign: '/images/portfolio/modern-street.jpg',
  // Was the private-banking concept, removed 17 Sep. The studio has no
  // app-design PRODUCT to show, so this is the nearest true thing: the frame
  // shop's own site photographed on a phone, which is real work and really is
  // a mobile interface. Swap it the day an actual app ships.
  appDesign: '/images/portfolio/frame-shop-mobile.jpg',
  dashboardDesign: '/images/portfolio/meridian-crm-invoices.jpg',
  // Not agentic-tech-stack.jpg: that is the Stack Planner section's own
  // picture on the home page, and the card sat directly above it. A workflow
  // running is also the truer picture of "tools wired together".
  techStack: '/images/portfolio/agentic-tech-stack-workflow.jpg',
  // Fog City Roasters is the studio's brand-identity work: the wordmark and
  // the packaging line. It replaced a rendered stationery scene on 2 Oct.
  logoDesign: '/images/portfolio/fog-city-roasters.jpg',
  fullPackage: '/images/portfolio/meridian-crm.jpg',
};

export const SERVICES: ServiceDetail[] = [
  {
    id: 'web_design',
    title: 'Custom Web Design & Development',
    categoryName: 'Web Development',
    explainerId: 'exp_web_business',
    // A client wanting one page and a client wanting twelve were clicking the
    // same card. Asking here means the reply they get describes the site they
    // actually want, and the invoice starts on the right tier.
    sizes: [
      { id: 'landing', label: 'One page',       hint: 'A single landing page',                explainerId: 'exp_web_landing' },
      { id: 'small',   label: '3 to 7 pages',   hint: 'A standard business site',             explainerId: 'exp_web_business' },
      { id: 'large',   label: '8 to 12 pages',  hint: 'Several services or locations', explainerId: 'exp_web_large' },
      { id: 'app',     label: 'More than a website', hint: 'Logins, dashboards, an application', explainerId: 'exp_web_app' },
    ],
    duration: '1 - 3 Weeks',
    icon: 'language',
    summary: 'Fast websites that look right on every phone and help customers find you on Google',
    description: 'We build websites that look great, load fast and turn visitors into customers. Anything from a single landing page to a full business portal.',
    features: [
      'Custom design that works on every screen',
      'Fast loading and set up for Google',
      'Edit your own content',
      'Online store and payments',
      'Smooth animations'
    ],
    image: HOTLINK_IMAGES.webDesign
  },
  {
    id: 'app_design',
    title: 'Mobile App Design & Development',
    categoryName: 'iOS & Android Apps',
    explainerId: 'exp_bundle_enterprise',
    duration: '2 - 4 Weeks',
    icon: 'phone_iphone',
    summary: 'iPhone and Android apps that are simple to use and look sharp',
    description: 'We turn your app idea into a working iPhone and Android app. You see the screens and a clickable prototype first, then we build it and publish it to the app stores.',
    features: [
      'iPhone and Android screen design',
      'A clickable prototype before we build',
      'One app for both iPhone and Android',
      'Sign in and push notifications',
      'Published to the App Store and Google Play'
    ],
    image: HOTLINK_IMAGES.appDesign
  },
  {
    id: 'dashboards',
    title: 'Data Analyst, CRM & Financial Dashboards',
    categoryName: 'Analytics & CRM Dashboards',
    explainerId: 'exp_web_app',
    duration: '1 - 3 Weeks',
    icon: 'analytics',
    summary: 'Dashboards that show your sales, customers and money in one place',
    description: 'See your business at a glance. We build dashboards for your sales, customers and money, with clean charts that update on their own.',
    features: [
      'Clear charts for your numbers',
      'Sales pipeline and leads',
      'Revenue, profit and key numbers',
      'Filter and export your data',
      'Live data from your tools'
    ],
    image: HOTLINK_IMAGES.dashboardDesign
  },
  {
    id: 'tech_stack',
    title: 'Your Business Tech Stack, Chosen and Connected',
    categoryName: 'Systems & Integration',
    explainerId: 'exp_tech_stack',
    duration: '3 - 8 Weeks',
    icon: 'account_tree',
    summary: 'Your website, bookings, payments, CRM and email, chosen for how you work and connected so they share information on their own',
    description: 'A "tech stack" just means the tools your business runs on and how they talk to each other. Most small businesses end up with four or five that do not, so the same customer detail gets typed in three times and something always gets missed. We map how you actually work, choose tools that fit that, and connect them so a booking becomes a calendar entry, an invoice and a reminder without anyone typing it twice. You own the setup, so there is no monthly fee that grows every time you hire.',
    features: [
      'A map of how work moves through your business today, before anything is bought',
      'Tools that fit how you work',
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
    explainerId: 'exp_logo_suite',
    duration: '3 - 7 Days',
    icon: 'draw',
    summary: 'A logo people remember, plus a simple guide for using your brand everywhere',
    description: 'A brand people remember. We design your logo, colors, fonts and the rules for using them so your business stands out.',
    features: [
      'Every logo file you need (SVG, AI, EPS, PNG)',
      'Several logo ideas to choose from',
      'Brand guide and colors',
      'Fonts that match',
      'Business cards and social media kit'
    ],
    image: HOTLINK_IMAGES.logoDesign
  },
  {
    id: 'full_package',
    title: 'Full Studio Design Bundle',
    categoryName: 'Web + App + Dashboard + Brand',
    explainerId: 'exp_full_package',
    duration: '3 - 5 Weeks',
    icon: 'workspace_premium',
    summary: 'Website, app, dashboard and brand, designed together so everything matches',
    description: 'Website, app, dashboards and brand designed together so everything matches. One package for new and growing businesses.',
    features: [
      'Website designed and launched',
      'App design and prototype',
      'Custom CRM and dashboards',
      'Logo and brand kit',
      'Priority appointments'
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
    title: 'Tech Stack for Growing Businesses',
    explainerId: 'exp_tech_stack',
    category: 'systems',
    categoryLabel: 'Business Systems',
    client: 'Meridian Interface',
    // Built, running, and used with clients — so it says so, and the picture is
    // a screenshot of the real thing rather than an empty frame.
    year: '2026',
    demo: '/demos/stack-planner/',
    image: '/images/portfolio/agentic-tech-stack.jpg',
    // The studio showreel used to play here. It was removed on 18 Sep: it is a
    // general reel across seven products, it never mentions the stack, and the
    // cut in the bucket loses its music a third of the way in. A film that
    // answers a different question than the one being asked is worse than no
    // film - the demo below is the real answer, and it is interactive.
    summary: 'Most growing businesses lose hours chasing leads, answering customers and keeping their posts going. This system does that work for you, sends nothing until you approve it and puts the whole week on one page every Monday.',
    highlights: ['Works while you are on a job', 'Nothing goes out without your yes', 'You own it with no fee per user'],
  },
  {
    id: 'p11',
    title: 'Meridian Interface Drone Command',
    explainerId: 'exp_web_app',
    category: 'dashboards',
    categoryLabel: 'Operations Console',
    client: 'Meridian Interface',
    // A working product, not a mock-up: the hosted copy runs on sample data, and
    // the same build flies real ArduPilot and PX4 aircraft over Bluetooth, a
    // radio or the network. The guided tour (?tour) walks a visitor through it.
    year: '2026',
    demo: '/demos/drone-command/?tour',
    image: '/images/portfolio/drone-command.jpg',
    gallery: [
      { src: '/images/portfolio/drone-command.jpg', caption: 'Overview: the fleet rendered live in 3D' },
      { src: '/images/portfolio/drone-command-aircraft.jpg', caption: 'The aircraft, rendered live in the browser, its gimbal camera holding the horizon' },
      { src: '/images/portfolio/drone-command-show.jpg', caption: 'Light show conductor for 100 to 500 aircraft' },
      { src: '/images/portfolio/drone-command-survey.jpg', caption: 'Site survey: the drone scans the venue in daylight, and its digital plan lights up on the ground' },
      { src: '/images/portfolio/drone-command-health.jpg', caption: 'Aircraft health that names the failing part' },
      { src: '/images/portfolio/drone-command-control.jpg', caption: 'Control one aircraft or the whole fleet' },
      { src: '/images/portfolio/drone-command-compliance.jpg', caption: 'FAA compliance: certificates, waivers and Remote ID in one place' },
    ],
    summary: 'One console for drone light shows, site surveys and overnight security. It flies real ArduPilot and PX4 aircraft, names the failing part before a flight goes wrong and keeps a record of every flight that cannot be changed. It runs on a laptop, tablet or phone.',
    highlights: ['Runs live 3D shows for 100 to 500 aircraft', 'Survey measurements from the map', 'Aircraft health that names the failing part'],
  },
  {
    // Haven replaced FinSight here on 11 Oct (Otis's call). A new id, not p7:
    // p7 still carries a Photo Control upload of FinSight in
    // settings.image_overrides, which would cover Haven's own pictures.
    id: 'p12',
    title: 'Haven',
    explainerId: 'exp_web_app',
    category: 'systems',
    categoryLabel: 'AI Home System',
    client: 'Meridian Interface',
    year: '2026',
    demo: '/demos/haven/',
    image: '/images/portfolio/haven-ai-home.jpg',
    gallery: [
      { src: '/images/portfolio/haven-ai-home.jpg', caption: 'The Haven website opens on its film: the home drawn in light before it is built' },
      { src: '/images/portfolio/haven-ai-home-screens.jpg', caption: 'Ten panel screens, each made for a different room, with the live panel beside them' },
      { src: '/images/portfolio/haven-ai-home-package.jpg', caption: 'The security package: cameras, doorbell, locks and sensors on one panel, phone and watch' },
      { src: '/images/portfolio/haven-ai-home-glass.jpg', caption: 'The Glass screen: the time, what Haven has noticed, the house, and a line to talk to it' },
      { src: '/images/portfolio/haven-ai-home-wallpaper.jpg', caption: 'Wallpaper in the Vivid finish: every control, room by room, over a picture of the home' },
      { src: '/images/portfolio/haven-ai-home-security.jpg', caption: 'Security console: doors, locks and the main water shutoff, with the cameras (sample pictures)' },
    ],
    summary: 'The full Haven website and its live control panel. Haven is an AI agent that runs a home\'s lights, climate, water, garage and locks. It learns how the family likes things and asks before doing anything risky. The site includes ten wall panel screens, a guided tour, security plans and a booking form. In this demo a simple command reader answers. The full AI agent runs on the home\'s own server.',
    highlights: ['Asks before anything risky, like opening the garage', 'Ten screens for different rooms', 'Type "goodnight" or "I\'m cold" to try it']
  },
  {
    id: 'p8',
    title: 'Meridian CRM',
    explainerId: 'exp_web_app',
    category: 'dashboards',
    categoryLabel: 'CRM Dashboard',
    client: 'Meridian Interface',
    // The studio's own desk, built and in daily use. The hosted copy keeps its
    // data in the visitor's browser, so anyone can click through it.
    year: '2026',
    demo: '/demos/meridian-crm/',
    image: '/images/portfolio/meridian-crm.jpg',
    gallery: [
      { src: '/images/portfolio/meridian-crm.jpg', caption: 'Overview: pipeline, money in and out, and what happened today' },
      { src: '/images/portfolio/meridian-crm-leads.jpg', caption: 'Leads funnel: every enquiry with its value and stage' },
      { src: '/images/portfolio/meridian-crm-invoices.jpg', caption: 'Invoices: sent, paid, overdue, and a receipt on mark-paid' },
      { src: '/images/portfolio/meridian-crm-kanban.jpg', caption: 'Kanban board: the week’s work, dragged between columns' },
    ],
    summary: 'Everything a small studio runs on in one place. Leads, clients, projects, invoices and software costs, plus a copilot that checks the live numbers before it answers. A privacy switch blurs every name and number when you share your screen.',
    highlights: ['Privacy mode for screen sharing', 'Copilot checks the live numbers', 'One owner, signed in with Google'],
  },
  {
    // The agent CRM built as a claude.ai artifact (repo: meridian-agent-dashboard).
    // The hosted copy runs on sample data in the visitor's browser and sends
    // nothing anywhere; the shared team workspace and real agent runs need claude.ai.
    id: 'p14',
    title: 'Meridian Agent Dashboard',
    explainerId: 'exp_agent_crm',
    category: 'dashboards',
    categoryLabel: 'Agent CRM',
    client: 'Meridian Interface',
    year: '2026',
    demo: '/demos/agent-dashboard/',
    image: '/images/portfolio/agent-dashboard.jpg',
    video: '/video/agent-dashboard-demo.mp4',
    videoSeconds: 84,
    videoPortrait: '/video/agent-dashboard-demo-vertical.mp4',
    gallery: [
      { src: '/images/portfolio/agent-dashboard.jpg', caption: 'Overview: the pipeline, revenue against last year, and what the agents did' },
      { src: '/images/portfolio/agent-dashboard-pipeline.jpg', caption: 'Pipeline: every opportunity by stage, dragged between columns' },
      { src: '/images/portfolio/agent-dashboard-agents.jpg', caption: 'Agents: what each one is working on, with pause and give-a-task' },
      { src: '/images/portfolio/agent-dashboard-record.jpg', caption: 'A record: stage, heat, next step and one-click agent actions' },
    ],
    summary: 'A CRM where AI agents handle the busywork. They score leads, research accounts and draft follow ups, and nothing changes until a person approves it. It comes with seven layouts ready to go, from sales teams to salons, a shared team workspace and your own branding.',
    highlights: ['Agents suggest, you approve', 'Seven layouts, from sales teams to salons', 'Safe to try, nothing gets sent']
  },
  {
    id: 'p2',
    title: 'The Frame Shop',
    explainerId: 'exp_web_business',
    category: 'web_design',
    categoryLabel: 'Trade Business Website',
    client: 'Motorcycle Service',
    year: '2026',
    demo: '/demos/frame-shop/',
    image: '/images/portfolio/frame-shop.jpg',
    gallery: [
      { src: '/images/portfolio/frame-shop.jpg', caption: 'The shop front page: what it does, and one way in' },
      { src: '/images/portfolio/frame-shop-booking.jpg', caption: 'Booking an inspection: the bike, the symptom, a time slot' },
      { src: '/images/portfolio/frame-shop-work.jpg', caption: 'Case studies, each with the measurement before and after' },
    ],
    summary: 'A working site for a motorcycle frame and alignment shop. It explains each service in plain terms, shows real laser measurements before and after and gives every booking a ticket number. The shop tracks each job and takes payment at the counter from the back office.',
    highlights: ['Booking issues a real ticket number', 'Case studies show the measurement', 'Counter till and job tracking']
  },
  {
    id: 'p1',
    title: 'CarePulse',
    explainerId: 'exp_web_app',
    category: 'dashboards',
    categoryLabel: 'Healthcare Dashboard',
    client: 'Healthcare',
    year: '2026',
    demo: '/demos/healthcare/',
    image: '/images/portfolio/carepulse.jpg',
    gallery: [
      { src: '/images/portfolio/carepulse.jpg', caption: 'Patient dashboard: today\'s vitals, a live heart trace, and the triage assistant one tap away' },
      { src: '/images/portfolio/carepulse-doctor.jpg', caption: 'Doctor view: the patient file beside a SOAP note worksheet with a drafting assistant' },
      { src: '/images/portfolio/carepulse-triage.jpg', caption: 'Symptom triage: pick symptoms, get an urgency level and questions to ask the doctor' },
      { src: '/images/portfolio/carepulse-vitals.jpg', caption: 'Home monitoring: blood pressure, heart rate, glucose and oxygen, logged and charted' },
    ],
    summary: 'One portal for a practice and its patients. Patients see their vitals, medications, records and bills, book visits, message the care team and check symptoms. Doctors switch to a clinical view with the full patient file, SOAP note drafting, prescriptions and lab trends. Exports to PDF and spreadsheets.',
    highlights: ['Patient and doctor views', 'Symptom triage and SOAP drafting', 'Vitals, records and billing in one place']
  },
  {
    // Added 13 Oct in one of the two slots the Analytics Hub and FinSight left.
    // Source: all-in-1-events-2, branch claude/client-promo-website-5ct9i8;
    // packaged by tools/package-secrets-of-cint.mjs.
    id: 'p13',
    title: 'Secrets of Cint',
    explainerId: 'exp_web_landing',
    category: 'web_design',
    categoryLabel: 'Promotional Website',
    client: 'Candles & Home Fragrance',
    year: '2026',
    demo: '/demos/secrets-of-cint/',
    image: '/images/portfolio/secrets-of-cint.jpg',
    gallery: [
      { src: '/images/portfolio/secrets-of-cint.jpg', caption: 'The front page: a black-and-white film of the real candles behind the headline' },
      { src: '/images/portfolio/secrets-of-cint-scents.jpg', caption: 'Shop by scroll: each scent drifts in on its own, with music and a narrated line' },
      { src: '/images/portfolio/secrets-of-cint-collection.jpg', caption: 'The full collection: candles, room sprays and diffusers, with filters and a cart' },
      { src: '/images/portfolio/secrets-of-cint-signature.jpg', caption: 'The signature candle, with its top, heart and base notes' },
    ],
    summary: 'A single page site for a San Francisco candle house. The opening film is made from the brand\'s own photos, and each scent appears with music and a narrated line as you scroll. It has the full collection with filters, a wishlist, a cart and a private panel where the owner swaps product photos without code.',
    highlights: ['Shop by scroll with narration', 'Opening film from the real products', 'Owner swaps photos without code'],
  },
  {
    // The hiring pipeline API (repo: meridian-hiring-api), live on Vercel with a
    // real database. Unlike the other demos it isn't copied into public/demos:
    // the button opens the running app in a new tab. Each visitor gets a private
    // sample company that is deleted after 24 hours.
    id: 'p15',
    slug: 'meridian-hire',
    title: 'Meridian Interface Hire',
    explainerId: 'exp_hiring_api',
    category: 'systems',
    categoryLabel: 'Hiring Pipeline API',
    client: 'Meridian Interface',
    year: '2026',
    demo: 'https://meridian-hiring-api.vercel.app/',
    image: '/images/portfolio/meridian-hire.jpg',
    video: '/video/meridian-hire-demo.mp4',
    videoSeconds: 97,
    gallery: [
      { src: '/images/portfolio/meridian-hire.jpg', caption: 'The board: every application by stage, with a short guide to try it in two minutes' },
      { src: '/images/portfolio/meridian-hire-candidate.jpg', caption: 'A candidate: details, a move to the next stage, the résumé, and every step on record' },
      { src: '/images/portfolio/meridian-hire-add.jpg', caption: 'Adding a candidate: the same request a careers page sends, with a résumé attached' },
      { src: '/images/portfolio/meridian-hire-docs.jpg', caption: 'Interactive API docs: a developer can try every call, already signed in to the demo' },
      { src: '/images/portfolio/meridian-hire-welcome.jpg', caption: 'What it becomes for a firm: team logins, a careers page, emails and scheduling, reports' },
    ],
    summary: 'The engine behind a recruiting firm\'s hiring. Companies post jobs and candidates apply with a resume. Every step from Applied to Hired is saved and sent securely to the firm\'s software. Each company\'s data stays separate, and a candidate can be deleted on request. It grows into a full hiring system with only the parts a firm needs.',
    highlights: ['A real working back end', 'Sends updates to the firm\'s tools', 'Candidates deleted on request']
  },
  {
    id: 'p4',
    title: 'Big Boy Subs',
    explainerId: 'exp_web_business',
    category: 'web_design',
    categoryLabel: 'Restaurant Website',
    client: 'Food & Beverage',
    year: '2026',
    demo: '/demos/big-boy-subs/',
    image: '/images/portfolio/big-boy-subs.jpg',
    gallery: [
      { src: '/images/portfolio/big-boy-subs.jpg', caption: 'Home, menu and bag: order ahead, build the sub your way, pick it up in about fifteen minutes' },
      { src: '/images/portfolio/big-boy-subs-menu.jpg', caption: 'The menu, every sub photographed' },
      { src: '/images/portfolio/big-boy-subs-locations.jpg', caption: 'Locations across the Monterey Peninsula' },
      { src: '/images/portfolio/big-boy-subs-merch.jpg', caption: 'The merch shop' },
    ],
    summary: 'An ordering site for a sandwich shop on the Monterey Peninsula. It has a photo menu, a sub builder, a bag that remembers your order, catering by headcount, three locations with hours, a merch shop and a loyalty card. Everything works and nothing gets charged.',
    highlights: ['Sub builder and bag', 'Catering by headcount', 'Locations, loyalty and merch'],
  },
  {
    id: 'p5',
    title: 'Fog City Roasters',
    explainerId: 'exp_brand_full',
    category: 'logo_brand',
    categoryLabel: 'Logo & Branding',
    client: 'Retail',
    year: '2026',
    demo: '/demos/fog-city/',
    image: '/images/portfolio/fog-city-roasters.jpg',
    gallery: [
      { src: '/images/portfolio/fog-city-roasters.jpg', caption: 'The promotional piece: wordmark, packaging line and the city it belongs to' },
      { src: '/images/portfolio/fog-city-roasters-cafe.jpg', caption: 'In the café, with the single-origin range' },
      { src: '/images/portfolio/fog-city-roasters-beans.jpg', caption: 'Fresh roast' },
      { src: '/images/portfolio/fog-city-roasters-latte.jpg', caption: 'The pour' },
      { src: '/images/portfolio/fog-city-roasters-iced.jpg', caption: 'Signature iced' },
    ],
    summary: 'Brand identity for a San Francisco coffee roaster. A gold wordmark on fog gray, a packaging line of three roasts including Morning Fog and Sutro Sunset, and photos that place the bags in the city they are named for.',
    highlights: ['Custom wordmark', 'Packaging line', 'Promotional photography']
  },
  {
    id: 'p6',
    title: 'MODERN_STREET',
    explainerId: 'exp_ecommerce',
    category: 'web_design',
    categoryLabel: 'Online Store',
    client: 'Online Retail',
    year: '2026',
    demo: '/demos/modern-street/',
    image: '/images/portfolio/modern-street-hero.jpg',
    gallery: [
      { src: '/images/portfolio/modern-street-hero.jpg', caption: 'The storefront opens on the season\'s editorial: one image, one line, one way in' },
      { src: '/images/portfolio/modern-street.jpg', caption: 'The catalogue: every garment photographed on the same ground' },
      { src: '/images/portfolio/modern-street-product.jpg', caption: 'A product, with a second view, colourway and size' },
      { src: '/images/portfolio/modern-street-cart.jpg', caption: 'The bag, with quantities and a promo code' },
      { src: '/images/portfolio/modern-street-checkout.jpg', caption: 'Checkout: a demonstration, so no card is asked for and nothing is charged' },
    ],
    summary: 'A bold streetwear store with a magazine feel. Shoppers browse essentials and seasonal collections, pick a color and size and check out in three quick steps.',
    highlights: ['Magazine style layout', 'Color and size options', 'Checkout in three steps'],
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
    preferredTimeSlot: '10:00 AM - 11:00 AM CT',
    budgetRange: 'Not discussed',
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
    preferredTimeSlot: '02:00 PM - 03:00 PM CT',
    budgetRange: 'Not discussed',
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
