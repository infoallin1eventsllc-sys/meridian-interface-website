/**
 * Client explainers — the answer to "what am I actually paying for?"
 *
 * The invoice itemises what a client receives. This is the layer underneath it:
 * the longer answer, for when someone reads a four-figure line and writes back
 * asking what it means. It is written to be copied straight into a reply, so
 * every word here is client-facing. No studio shorthand, no jargon that needs
 * translating, nothing that sounds like it was pulled off a pricing page.
 *
 * `excluded` is not padding. Naming what a price does not cover, in writing,
 * before the work starts, is what stops a reasonable question turning into a
 * disagreement three weeks in.
 */

export interface ExplainerSection {
  /** What the client receives. */
  what: string;
  /** Why it matters to them — the sentence that turns a line into a reason. */
  why: string;
}

export interface ClientExplainer {
  id: string;
  /** Matches how the line reads on the invoice. */
  title: string;
  category: 'Websites' | 'Software' | 'Brand & Logo' | 'Packages' | 'Video Ads' | 'Ongoing Work';
  /**
   * Filled in at runtime from the server catalogue, keyed by `id`.
   *
   * It is deliberately absent from this file. Anything here is compiled into
   * the JavaScript every visitor downloads, and the rate card is not public
   * data — a client sees a price when Otis sends them one.
   */
  price?: string;
  /**
   * Lower-cased fragments used to link an invoice line to this explainer.
   * Matched against the line description, longest first, so
   * "complex custom web app" wins over "web app".
   */
  matches: string[];
  /** One sentence. What this is. */
  summary: string;
  /** Two or three sentences, for a text message or a quick reply. */
  short: string;
  included: ExplainerSection[];
  /** What it changes for their business. */
  outcome: string;
  /** Not covered by this price. Quoted separately, and gladly. */
  excluded: string[];
  /** Typical, not contractual — adjust per project before sending. */
  timeline: string;
  /** What the studio needs from them for the timeline to hold. */
  needFromYou: string[];
}

export const CLIENT_EXPLAINERS: ClientExplainer[] = [
  /* ------------------------------------------------------------ websites -- */
  {
    id: 'exp_web_landing',
    title: 'Single-Page / Landing Page Site',
    category: 'Websites',
    matches: ['single-page', 'landing page site', 'landing page'],
    summary:
      'One page, designed around a single job: turning the people who land on it into enquiries.',
    short:
      'This is a single web page built to do one thing — get visitors to contact you. It includes the design, the writing layout, an enquiry form that emails you straight away, and the setup that lets Google list it. It is the right choice when you need one strong page rather than a whole site.',
    included: [
      {
        what: 'One page, designed from scratch around your offer',
        why:
          'Not a template with your logo dropped in. The order of the page, what a visitor reads first, and where the enquiry form sits are all decided around what you are selling.',
      },
      {
        what: 'An enquiry form that emails you the moment someone fills it in',
        why:
          'You hear about a lead in seconds rather than finding it later. Every message is also saved, so nothing is lost if an email goes astray.',
      },
      {
        what: 'Correct on phones, tablets and desktop',
        why:
          'Most people will see this page on a phone. It is built and checked at every size, not shrunk down and hoped for.',
      },
      {
        what: 'Set up so Google can find and list it',
        why:
          'Page titles, descriptions, image labels and the technical file Google looks for. This is what makes the page findable at all — it is the groundwork, not an ongoing SEO campaign.',
      },
      {
        what: 'Loading speed tuned before launch',
        why:
          'Images compressed, code kept lean. A page that takes more than a few seconds loses a large share of visitors before they read a word.',
      },
    ],
    outcome:
      'You get one page you can send people to — from an advert, a card, a social profile, or a conversation — that is built to turn attention into enquiries rather than just describe the business.',
    excluded: [
      'Additional pages — each one is quoted separately',
      'Writing the words on the page (we lay out and design what you supply; copywriting can be quoted)',
      'Photography or paid stock images',
      'Advertising spend, or running the ad campaigns that send traffic here',
      'Ongoing SEO work after launch',
      'Hosting and domain fees, which are paid to those providers directly',
    ],
    timeline:
      'Typically 2 to 3 weeks from the day we have your content and images.',
    needFromYou: [
      'The text you want on the page, or a clear brief for us to work from',
      'Your logo files, if you already have them',
      'Any photographs you want used',
      'The email address enquiries should go to',
    ],
  },
  {
    id: 'exp_web_business',
    title: 'Custom 3–7 Page Business Site',
    category: 'Websites',
    matches: ['custom 3–7 page', 'custom 3-7 page', '3–7 page business', 'business site', 'custom web design', 'web design & development', 'web design', 'business website', 'trade business', 'restaurant website'],
    summary:
      'A full small-business website of up to seven pages, each one designed around what that page has to do.',
    short:
      'This is a complete website of up to seven pages — typically home, services, about, and contact, plus whatever else your business needs. Each page is designed for its own job rather than filled with the same layout. You can edit your own text and images afterwards without calling us.',
    included: [
      {
        what: 'Up to seven pages, each designed for its purpose',
        why:
          'A services page and an about page are doing different jobs and should not look identical. Each is laid out around what a visitor needs from it.',
      },
      {
        what: 'Your services presented so people understand what they are buying',
        why:
          'The most common reason a visitor leaves without enquiring is that they could not tell what you actually do or what it costs.',
      },
      {
        what: 'An enquiry form that reaches you instantly, with every message stored',
        why:
          'You have a record of every enquiry in one place rather than scattered across an inbox.',
      },
      {
        what: 'You can change your own text and images afterwards',
        why:
          'Updating a price, a photograph, or an opening time should not require booking us. You get access and a walkthrough of how to do it.',
      },
      {
        what: 'Built to load quickly',
        why:
          'Speed affects both what visitors do and how Google ranks you. It is handled during the build rather than patched afterwards.',
      },
      {
        what: 'Search setup across every page',
        why:
          'Each page gets its own title and description, so they can be found individually rather than only through the home page.',
      },
    ],
    outcome:
      'You get a website that carries the whole business rather than a single message — somewhere a customer can arrive knowing nothing, understand what you do, see that you are credible, and get in touch.',
    excluded: [
      'Pages beyond the seventh — either the eight to twelve page tier, or charged per page',
      'Online payments or a shop, which is a different build',
      'A customer login area or booking system (see the web app tier)',
      'Copywriting, photography, and paid stock images',
      'Ongoing SEO or content work after launch',
      'Hosting and domain fees, paid to those providers directly',
    ],
    timeline:
      'Typically 4 to 6 weeks from the day we have your content and images.',
    needFromYou: [
      'The text for each page, or a brief for us to work from',
      'Your logo and any brand colours already in use',
      'Photographs of your work, premises, or team',
      'A decision on which pages you want, which we will talk through first',
    ],
  },
  {
    id: 'exp_web_large',
    title: 'Custom 8\u201312 Page Business Site',
    category: 'Websites',
    matches: [
      'custom 8\u201312 page',
      'custom 8-12 page',
      '8\u201312 page business',
      '8-12 page business',
      'larger business site',
      'eleven page',
      'twelve page',
    ],
    summary:
      'A larger business website of eight to twelve pages, for a company with more to explain than a small site can hold.',
    short:
      'This is a bigger version of the business site: eight to twelve pages, for a company with several services, locations, or audiences that each need their own page. Every page is designed for its own job rather than repeating one layout, and you can edit your own text and images afterwards without calling us.',
    included: [
      {
        what: 'Eight to twelve pages, each designed for what that page has to do',
        why: 'A services page, a page per location, a page per audience \u2014 each one built around the visitor who lands on it rather than one template repeated twelve times.',
      },
      {
        what: 'A navigation structure that holds together at this size',
        why: 'Twelve pages is the point where a menu stops being obvious. The structure is worked out first, so visitors can still find things.',
      },
      {
        what: 'Your services presented so people understand what they are buying',
        why: 'More pages means more room to explain, and more room to lose someone. Each service gets the space to make its own case.',
      },
      {
        what: 'An enquiry form that reaches you instantly, with every message stored',
        why: 'Nothing sits in a form waiting to be noticed, and nothing is lost if an email goes astray.',
      },
      {
        what: 'You can change your own text and images afterwards',
        why: 'At this size you will want to change things often. You should not need us for a phone number or a price list.',
      },
      {
        what: 'Search setup across every page, and loading speed tuned before launch',
        why: 'A bigger site is slower by default unless somebody deals with it. This is dealt with before you launch, not after someone complains.',
      },
    ],
    outcome:
      'You get a site that can carry a business with real range \u2014 several services, more than one location, more than one kind of customer \u2014 without the whole thing turning into a wall of text on one page.',
    excluded: [
      'Pages beyond the twelfth \u2014 each additional page is quoted separately',
      'Online payments or a shop, which is a different build',
      'A customer login area or booking system (see the web app tier)',
      'Copywriting, photography, and paid stock images',
      'Ongoing SEO or content work after launch',
      'Hosting and domain fees, paid to those providers directly',
    ],
    timeline: 'Typically five to eight weeks, depending on how quickly content arrives.',
    needFromYou: [
      'The list of pages you want, or the services and locations they should cover',
      'Your wording for each page, or a decision to have it written (quoted separately)',
      'Your logo and brand colours, or the go-ahead to design them',
      'Photographs, or a decision to license stock (quoted separately)',
    ],
  },
  {
    id: 'exp_extra_page',
    title: 'Additional Page',
    category: 'Websites',
    matches: ['additional page', 'extra page', 'page beyond', 'added page'],
    summary:
      'One more page added to whatever site was agreed, designed and built to match what is already there.',
    short:
      'Every site tier covers a set number of pages. This is one page beyond that, charged per page. It is designed to match the site it joins \u2014 same layout language, same navigation, same behaviour on phones \u2014 so it does not read as an afterthought.',
    included: [
      {
        what: 'One page, designed to match the site it joins',
        why: 'The point of paying for a designed page rather than a duplicated one is that nobody can tell which pages came later.',
      },
      {
        what: 'Added to the navigation properly',
        why: 'A page nobody can find from the menu is a page nobody reads.',
      },
      {
        what: 'Correct on phones, and included in the search setup',
        why: 'Held to the same standard as every other page on the site, because visitors do not know or care which ones were extra.',
      },
    ],
    outcome:
      'You can grow the site as the business grows, at a price you know in advance, rather than renegotiating the whole project every time you add a service.',
    excluded: [
      'Writing the words on the page \u2014 we lay out and design what you supply',
      'Photography or paid stock images for the new page',
      'Rebuilding or restructuring the existing site around it',
      'New functionality that is not already on the site \u2014 quoted separately',
    ],
    timeline: 'Usually within a week of the wording arriving, alongside other work.',
    needFromYou: [
      'What the page is for, and where it belongs in the menu',
      'The wording, and any images it should carry',
    ],
  },
  {
    id: 'exp_web_app',
    title: 'Complex Custom Web App / Multi-Page Portal',
    category: 'Websites',
    matches: [
      'complex custom web app',
      'complex web app',
      'multi-page portal',
      'web app',
      'portal',
      'dashboards',
      'dashboard',
      'crm',
      'analytics intelligence',
      'operations hub',
    ],
    summary:
      'Software built around how your business actually runs — with accounts, a dashboard, and connections to the tools you already use.',
    short:
      'This is not a website; it is an application. It has secure sign-in so each customer sees only their own information, a dashboard showing the numbers you check daily, and connections to the systems you already use so information moves between them automatically. It is built around your process rather than bending your process to fit a template.',
    included: [
      {
        what: 'An application built around your process, not a template bent to fit',
        why:
          'Off-the-shelf tools force you to work their way. This is the opposite: we map how you already work, then build that.',
      },
      {
        what: 'Secure sign-in, with each account seeing only its own information',
        why:
          'This is the part that makes it safe to put real customer data in. Accounts are separated at the database level, not just hidden in the interface.',
      },
      {
        what: 'A dashboard with the numbers you check daily in one place',
        why:
          'Stops the daily routine of opening four systems and adding things up by hand.',
      },
      {
        what: 'Connected to the tools you already use',
        why:
          'Your accounting software, calendar, email or payment processor can pass information back and forth automatically instead of being re-keyed.',
      },
      {
        what: 'Built to hold up as you grow, and secured from the start',
        why:
          'Security and capacity are designed in at the beginning. Retrofitting either one later costs multiples of what it costs now.',
      },
      {
        what: 'A working version you can use partway through',
        why:
          'You see and try it before it is finished, so a misunderstanding costs a conversation instead of a rebuild.',
      },
    ],
    outcome:
      'You stop paying people to do work software should do, and you own the system rather than renting it — no per-user monthly fee that grows every time you hire.',
    excluded: [
      'Third-party service fees — payment processing, SMS, email delivery, hosting',
      'Native iPhone or Android apps submitted to the app stores, which is a separate build',
      'Migrating data out of an existing system, quoted once we have seen it',
      'Ongoing hosting, monitoring and maintenance after launch',
      'Feature work beyond what is agreed at the start — added by written change order so the price never moves without your say-so',
    ],
    timeline:
      'Typically 10 to 16 weeks, depending on how many systems it has to connect to. We agree the stages up front and you see working software at each one.',
    needFromYou: [
      'Time from someone who knows how the work is really done day to day',
      'Access to the systems it needs to connect to',
      'Decisions at each stage, so the build does not stall waiting on an answer',
      'A named person who can sign off — the fastest projects have exactly one',
    ],
  },

  {
    // Added 5 Nov 2026 so every product has an answer (MODERN_STREET, p6).
    id: 'exp_ecommerce',
    title: 'Online Store',
    category: 'Websites',
    matches: ['online store', 'storefront', 'e-commerce', 'ecommerce', 'web shop'],
    summary:
      'A shop that sells for you around the clock: your products, photographed and organised, with a cart and checkout built to turn browsers into paying customers.',
    short:
      'This is an online store built around your products. Customers can browse your collections, pick a colour and size, add to a cart that remembers what they chose, and pay in a few steps. You can add products, change prices and see orders yourself, without calling us.',
    included: [
      {
        what: 'A storefront designed around your brand and your best sellers',
        why:
          'The first screen shows what you most want to sell, so visitors see your strongest products before anything else.',
      },
      {
        what: 'Product pages with photos, colours, sizes and stock',
        why:
          'Customers get the answers they need to buy without having to message you first.',
      },
      {
        what: 'A cart that remembers what was chosen, and a short checkout',
        why:
          'Every extra step at checkout loses sales. Ours is kept to the few that are actually needed.',
      },
      {
        what: 'Card payments through a trusted payment provider',
        why:
          'Card details go straight to the payment provider and never touch your site, which keeps you out of handling them.',
      },
      {
        what: 'Order emails to you and your customer',
        why:
          'You know the moment something sells, and the customer gets a receipt straight away.',
      },
      {
        what: 'You can add products and change prices yourself',
        why:
          'A new product or a sale price should not need a call to us.',
      },
      {
        what: 'Correct on phones, and set up so Google can list your products',
        why:
          'Most shoppers will find and buy on a phone, so it is designed for that first.',
      },
    ],
    outcome:
      'You have a shop that takes orders while you sleep, looks like a brand people trust, and that you can run day to day yourself.',
    excluded: [
      'Payment processing fees charged by the payment provider on each sale',
      'Product photography, unless it is added as a separate line',
      'Entering a large product catalogue, quoted once we know how many products there are',
      'Shipping, tax and warehouse integrations beyond the standard ones, quoted once we have seen them',
      'Ongoing hosting, support and changes after launch',
      'Feature work beyond what is agreed at the start — added by written change order so the price never moves without your say-so',
    ],
    timeline:
      'Typically 4 to 8 weeks, depending on how many products and how many payment and shipping options it needs. You see it working before launch.',
    needFromYou: [
      'Your products: names, descriptions, prices, sizes and colours',
      'Product photos, or a decision to have them taken',
      'Your shipping and returns rules',
      'An account with the payment provider, which we help you set up',
    ],
  },

  /* ------------------------------------------------------------ software -- */
  // The two products Meridian sells as a product rather than a one-off build
  // (added 5 Nov 2026). Each answer covers every tier of its product; the
  // tier on the invoice line says which parts apply.
  {
    id: 'exp_agent_crm',
    title: 'Agent CRM Dashboard',
    category: 'Software',
    matches: ['agent crm dashboard', 'agent crm', 'agent dashboard'],
    summary:
      'A CRM where AI helpers do the busywork — scoring the pipeline, researching accounts and drafting follow-ups — and a person on your team approves every change before it happens.',
    short:
      'This is a CRM for your team with AI helpers built in. They keep the pipeline scored, flag what needs attention and draft follow-ups, meetings and tasks, but nothing changes and no email is sent until someone on your team clicks Apply. It is set up in your branding, around how your business sells.',
    included: [
      {
        what: 'Your pipeline, contacts and tasks in one dashboard, in your branding',
        why:
          'One place to see every deal, who owns it and what happens next, instead of a spreadsheet, an inbox and someone\'s memory.',
      },
      {
        what: 'Set up from one of seven ready-made layouts, then fitted to how you sell',
        why:
          'Sales teams, agencies, event planners, restaurants, salons, online stores and wellness studios each start from stages and wording that already fit, so you are using it in weeks rather than months.',
      },
      {
        what: 'AI helpers that score leads, research accounts and draft follow-ups',
        why:
          'The repetitive work gets done every day without anyone having to remember it, and your team spends its time on the conversations that close.',
      },
      {
        what: 'A person approves every change — nothing is sent automatically',
        why:
          'The helpers suggest; your team decides. Every suggestion says exactly what will happen before anyone clicks, so nothing goes to a client that you did not see first.',
      },
      {
        what: 'Connected to your team\'s Gmail and Google Calendar',
        why:
          'Drafts land in the right inbox and meetings are found in real free time, without copying details between systems. Each person connects their own account.',
      },
      {
        what: 'A playbook the helpers read: your services, tone of voice and rules',
        why:
          'Drafted emails sound like your business and follow your rules, rather than sounding like generic AI.',
      },
      {
        what: 'Team logins with editor and view-only roles, plus backup and restore',
        why:
          'Everyone sees the same up-to-date records, people only change what they should, and your data can be restored if something goes wrong.',
      },
    ],
    outcome:
      'Follow-ups stop slipping through the cracks and your team stops doing data entry, while you stay in control of every message that goes out under your name.',
    excluded: [
      'AI usage beyond the amount agreed in your monthly care plan',
      'Connections to systems other than Gmail and Google Calendar, quoted once we have seen them',
      'Moving your records out of an existing CRM, quoted once we have seen the data',
      'Company sign-in (single sign-on) and security paperwork, which are part of the Enterprise level',
      'Ongoing hosting, support and changes after launch, which are covered by the monthly care plan',
      'Feature work beyond what is agreed at the start — added by written change order so the price never moves without your say-so',
    ],
    timeline:
      'Typically 3 to 5 weeks for a ready-made layout set up in your branding, and 6 to 10 weeks when it is fitted to your process and connected to your email and calendar. You see it working at each stage.',
    needFromYou: [
      'Your logo, colours and the name the team will see',
      'How a deal moves today, from first contact to paid — the stages, and who does what',
      'Your services, prices and tone of voice for the playbook',
      'A list of who needs a login, and what each person should be able to change',
      'A named person who can sign off — the fastest projects have exactly one',
    ],
  },
  {
    id: 'exp_hiring_api',
    title: 'Hiring Pipeline API',
    category: 'Software',
    matches: ['hiring pipeline api', 'hiring pipeline', 'hiring system', 'meridian hire'],
    summary:
      'The engine behind a recruiting firm\'s hiring: jobs, candidates, résumés and every move from Applied to Hired, kept in one secure place and sent to the software your firm already uses.',
    short:
      'This is the system underneath your hiring. Jobs are posted, candidates apply with a résumé, and every move from Applied to Hired is saved and sent, signed, to your firm\'s own software. Each company\'s data is walled off by the database itself, and a candidate can be erased on request. It grows into a full hiring system with only the parts your firm needs.',
    included: [
      {
        what: 'Jobs, candidates, résumés and stages kept in one secure place',
        why:
          'One accurate record of every candidate and where they stand, instead of spreadsheets and inboxes that disagree with each other.',
      },
      {
        what: 'Rules for how candidates move between stages, with a full history',
        why:
          'A candidate cannot skip a step by mistake, and you can see who moved them, when and why.',
      },
      {
        what: 'Automatic, signed updates sent to your other software',
        why:
          'Your other systems hear about every change the moment it happens, and they can check each update really came from you.',
      },
      {
        what: 'Each company\'s data walled off by the database itself',
        why:
          'It is not just hidden on screen. One client\'s candidates cannot be read through another client\'s access, even by mistake.',
      },
      {
        what: 'Candidates erased on request, résumés included',
        why:
          'When someone asks to be removed, they are removed everywhere in one step, which keeps you on the right side of privacy rules.',
      },
      {
        what: 'A record of who did what, and access keys with set permissions',
        why:
          'Every change is traceable, and each connected system gets only the access it needs.',
      },
      {
        what: 'Documentation your developers or vendors can build on',
        why:
          'Anyone connecting to it can see exactly how it works and try it safely without touching real data.',
      },
      {
        what: 'Optional parts added as you need them: team logins, a careers page, interview scheduling and reports',
        why:
          'You pay for the parts your firm will use, and add the rest later without starting again.',
      },
    ],
    outcome:
      'Your firm runs on one dependable hiring record that its other systems trust, so candidates move faster and nothing is lost between tools.',
    excluded: [
      'Third-party service fees — hosting, email delivery, job board postings',
      'Moving candidates out of an existing applicant tracking system, quoted once we have seen the data',
      'Optional parts not listed on the invoice, such as the careers page or interview scheduling, each quoted separately',
      'Company sign-in (single sign-on) and compliance paperwork, which are part of the Enterprise level',
      'Ongoing hosting, monitoring and changes after launch, which are covered by the monthly care plan',
      'Feature work beyond what is agreed at the start — added by written change order so the price never moves without your say-so',
    ],
    timeline:
      'Typically 3 to 5 weeks to connect it to the tools you already use, and 8 to 14 weeks for the full hiring system. You see it working at each stage.',
    needFromYou: [
      'The stages your candidates move through today, and who can move them',
      'A list of the systems it has to talk to, and access to test them',
      'Your rules for keeping and deleting candidate data',
      'A named person who can sign off — the fastest projects have exactly one',
    ],
  },

  /* --------------------------------------------------------- brand & logo -- */
  {
    id: 'exp_logo_suite',
    title: 'Boutique Logo Design Suite',
    category: 'Brand & Logo',
    matches: ['boutique logo design suite', 'basic logo', 'logo design suite', 'logo suite', 'logo design', 'visual identity'],
    summary:
      'An original logo drawn for you, in every version and file format you will need.',
    short:
      'An original logo, drawn from scratch rather than adapted from a template, plus a simpler second version for small spaces and a matching icon set. You get the original design files, which means it stays perfectly sharp at any size — from a business card to a vehicle wrap.',
    included: [
      {
        what: 'A main logo, drawn for you from scratch',
        why:
          'Not chosen from a library. That matters legally as well as visually — a template mark can be sold to a hundred other businesses, and cannot be reliably trademarked.',
      },
      {
        what: 'A second, simpler version for small spaces',
        why:
          'A logo that reads beautifully on a sign often turns to mush as a social profile picture. The alternate version is drawn for those places.',
      },
      {
        what: 'The original design files',
        why:
          'These are the master files. They stay perfectly sharp at any size, which is what a sign maker or printer will ask you for. Without them you are stuck at whatever size you were given.',
      },
      {
        what: 'A set of matching icons for your website and app',
        why:
          'The small graphics that surround a logo need to look like they belong to it. Supplied together so they do.',
      },
      {
        what: 'Rounds of revision before we finalise',
        why:
          'You are not picking from one option and hoping. We work through directions with you until it is right.',
      },
    ],
    outcome:
      'You own a mark that is genuinely yours, in every format anyone will ever ask for, so you are never held up because a printer needs a file you do not have.',
    excluded: [
      'Brand strategy and positioning work (that is the Full Brand Identity tier)',
      'A written brand guidelines document',
      'Ready-made social media graphics and templates',
      'Trademark searching or registration — we will happily work alongside your attorney',
      'Printing, signage, or merchandise production',
    ],
    timeline: 'Typically 2 to 3 weeks, including revision rounds.',
    needFromYou: [
      'What the business does and who it is for',
      'Any logos you like or dislike, which is often more useful than a description',
      'Colours you must use or must avoid',
      'Where it will appear most — a shopfront and a mobile app pull in different directions',
    ],
  },
  {
    id: 'exp_brand_full',
    title: 'Full Brand Identity Package',
    category: 'Brand & Logo',
    matches: ['full brand identity', 'full brand package', 'full brand', 'brand identity'],
    summary:
      'The positioning work first, then a complete logo system, social graphics, and a written guide anyone you hire later can follow.',
    short:
      'This starts before the drawing does — we work out what your brand should stand for and who it is talking to, then design from that. You get a complete logo system, your colours and fonts chosen and documented, ready-made social graphics, and a written guide so everything stays consistent no matter who works on it next.',
    included: [
      {
        what: 'Positioning work before anything is drawn',
        why:
          'What the business stands for, who it is for, and how it should sound. Design decisions made without this are guesses that happen to look nice.',
      },
      {
        what: 'A complete logo system',
        why:
          'Main mark, alternates, and small-space versions — so there is a correct version for every place it has to go, rather than one file being stretched to fit.',
      },
      {
        what: 'Your colours and fonts chosen and documented',
        why:
          'Written down with exact values, so a printer, a sign maker and your website all produce the same colour rather than three near-misses.',
      },
      {
        what: 'Ready-made graphics for your social profiles and posts',
        why:
          'Templates you can reuse, so posting something on-brand does not require a designer every time.',
      },
      {
        what: 'A written brand guide',
        why:
          'This is what protects the investment. Anyone you hire in five years opens one document and knows how to use it correctly.',
      },
    ],
    outcome:
      'Your business looks like one company across every place a customer meets it, and stays that way after you hand it to someone else.',
    excluded: [
      'A website — quoted separately, or bundled in the Growth Package',
      'Trademark searching or registration',
      'Printing, signage, packaging or merchandise production',
      'Photography and video',
      'Ongoing marketing or content production',
    ],
    timeline:
      'Typically 4 to 6 weeks. The positioning stage at the start is what makes the rest go quickly.',
    needFromYou: [
      'A conversation at the start about where the business is going',
      'Access to whoever makes the final decision, early rather than at the end',
      'Anything already in use — old logos, colours, printed material',
      'Honest input on what has not worked before',
    ],
  },

  /* ---------------------------------------------------------- packages ---- */
  {
    id: 'exp_bundle_starter',
    title: 'Starter Package',
    category: 'Packages',
    matches: ['starter package'],
    summary:
      'Logo and website together, for a new business that needs to look established from day one.',
    short:
      'Logo and website together at a lower combined price than buying them separately. You get an original logo with matching fonts, a three to five page website built to bring in enquiries, and a contact form that emails you immediately. It is the fastest route from nothing to looking like a real, established business.',
    included: [
      {
        what: 'An original logo, drawn for you, and the fonts that go with it',
        why:
          'Designed together with the site rather than bolted on, so the whole thing looks deliberate.',
      },
      {
        what: 'A three to five page website built to bring in enquiries',
        why:
          'Enough room to explain what you do and prove you can do it, without the cost of a full site before you need one.',
      },
      {
        what: 'Correct on phones, and set up so Google can list it',
        why:
          'The two things most new sites get wrong, and the two that cost the most enquiries.',
      },
      {
        what: 'A contact form that emails you the moment someone gets in touch',
        why:
          'Early leads go cold quickly. You hear immediately.',
      },
    ],
    outcome:
      'You launch looking like an established business rather than a new one, which changes what people are willing to pay you from the first conversation.',
    excluded: [
      'Brand strategy work and a written brand guide (see the Full Brand tier)',
      'Online payments, bookings, or customer logins',
      'Copywriting, photography, and paid stock images',
      'Ongoing SEO, advertising, or content after launch',
      'Hosting and domain fees, paid to those providers directly',
    ],
    timeline: 'Typically 4 to 5 weeks for both pieces together.',
    needFromYou: [
      'What the business does, who it serves, and what makes it different',
      'Text for the pages, or a brief for us to work from',
      'Any photographs you want used',
      'One person who can make decisions and sign off',
    ],
  },
  {
    id: 'exp_bundle_growth',
    title: 'Growth / Professional Package',
    category: 'Packages',
    matches: ['growth / professional', 'growth package', 'professional package'],
    summary:
      'A full brand kit plus a larger site with working tools built in — for a business the simple site has outgrown.',
    short:
      'For a business that has outgrown a basic site and needs the website to do actual work. You get a complete brand kit, a site of up to seven pages designed from scratch, and working tools built in — a price calculator, online booking, and a client login area — plus your domain connected and us on hand through launch. If you need more pages than that, the larger site tier covers eight to twelve.',
    included: [
      {
        what: 'A complete brand kit',
        why:
          'Main logo, alternate, browser icon, and a guide so everything stays consistent as more people touch it.',
      },
      {
        what: 'A site of up to seven pages, designed from scratch',
        why:
          'At this size a template starts to show. Every page is laid out for its own job.',
      },
      {
        what: 'Working tools built in',
        why:
          'A price calculator, online booking, and a portal your clients can log into. These do work that a person is otherwise doing by hand every day.',
      },
      {
        what: 'Domain connected, visitor tracking installed, and us present through launch',
        why:
          'Launch day is when things break. Someone who built it is watching.',
      },
    ],
    outcome:
      'The website stops being a brochure and starts taking work off your desk — quoting, booking and answering the same questions, without you in the loop.',
    excluded: [
      'Payment processing fees and third-party service subscriptions',
      'A native iPhone or Android app',
      'Copywriting, photography, and paid stock images',
      'Ongoing marketing, advertising, or content production',
      'Hosting and maintenance after launch',
    ],
    timeline: 'Typically 6 to 9 weeks, depending on which tools are included.',
    needFromYou: [
      'A clear picture of the process the tools should follow',
      'Text and images for the pages',
      'Access to any systems it should connect to',
      'Timely decisions — this is the tier where waiting on sign-off costs the most time',
    ],
  },
  {
    id: 'exp_bundle_enterprise',
    title: 'Enterprise / Custom Application',
    category: 'Packages',
    matches: ['enterprise custom application', 'enterprise / custom', 'enterprise package', 'mobile app'],
    summary:
      'A complete custom platform or mobile app, built end to end, for software the business depends on.',
    short:
      'For software your business genuinely depends on, where being down for a day is a real problem. A complete custom platform or mobile app built end to end, connected to your other systems, with dashboards showing what matters — built to handle growth and secured properly from the start.',
    included: [
      {
        what: 'A complete custom platform or mobile app, built end to end',
        why:
          'Everything from the database to the screens people use. One team responsible for the whole thing, so nothing falls between two vendors.',
      },
      {
        what: 'Connected to your other systems, with dashboards showing what matters',
        why:
          'Information stops being re-typed between systems, and you can see the state of the business without asking anyone.',
      },
      {
        what: 'Built to handle growth, and secured from the start',
        why:
          'At this scale, security and capacity are architecture decisions. Correcting either one later is a rebuild, not a patch.',
      },
      {
        what: 'Staged delivery, with working software at each stage',
        why:
          'You are never waiting months to find out whether we understood you. You use it as it is built.',
      },
    ],
    outcome:
      'You own the system your business runs on. No per-user subscription that rises every time you hire, and no vendor deciding to discontinue the tool your operation depends on.',
    excluded: [
      'Third-party service fees — hosting, payment processing, SMS, email delivery',
      'App store fees and developer account costs',
      'Migrating data out of existing systems, quoted once we have seen them',
      'Ongoing hosting, monitoring and support, quoted as a separate agreement',
      'Work beyond the agreed scope, added by written change order',
    ],
    timeline:
      'Typically 12 to 20 weeks. We agree the stages before starting, and you see working software at each one.',
    needFromYou: [
      'Real time from the people who do the work day to day',
      'Access to the systems it must connect to',
      'One person who can make binding decisions',
      'Agreement on the scope at the start, which is what keeps the price fixed',
    ],
  },

  {
    id: 'exp_tech_stack',
    title: 'Business Tech Stack — Chosen & Connected',
    category: 'Packages',
    matches: ['tech stack', 'business tech stack', 'systems & integration'],
    summary:
      'The set of tools your business runs on, picked for how you actually work and connected so information moves between them by itself.',
    short:
      'A tech stack just means the tools your business runs on and how they talk to each other. Most businesses end up with four or five that do not, so the same customer detail gets typed in three times. We map how you actually work, choose tools that fit, and wire them together so a booking becomes a calendar entry, an invoice and a follow-up without anyone re-keying it.',
    included: [
      {
        what: 'A map of how work moves through your business today',
        why:
          'Done before anything is bought. Buying tools first is how businesses end up paying for three things that overlap and none that fit.',
      },
      {
        what: 'Tools chosen to fit how you work',
        why:
          'The alternative is bending your process around whatever the software expects, which is where the daily friction comes from.',
      },
      {
        what: 'The connections between them built and tested',
        why:
          'A booking becomes a calendar entry, an invoice, and a follow-up on its own. This is the part that gives you hours back, and the part most people skip.',
      },
      {
        what: 'One dashboard for the numbers you check daily',
        why:
          'Instead of opening four systems and adding things up by hand.',
      },
      {
        what: 'The whole setup written down',
        why:
          'So the next person you hire can run it, and you are not the only one who knows how it fits together.',
      },
    ],
    outcome:
      'The same information stops being typed in three places, the things that used to get missed stop getting missed, and you own the setup rather than renting it — no per-user fee that climbs every time you hire.',
    excluded: [
      'The monthly subscription fees for the tools themselves — those stay yours, and we will tell you what they cost before you commit',
      'Migrating years of historical data out of an old system, quoted once we have seen it',
      'Ongoing administration of the tools after handover',
      'Custom software where no existing tool fits — that is a web app build, quoted separately',
    ],
    timeline:
      'Typically 3 to 8 weeks depending on how many tools have to talk to each other. The mapping stage at the start is what keeps the rest short.',
    needFromYou: [
      'Time from whoever actually does the work day to day, not just whoever owns the business',
      'A list of what you currently pay for monthly, even the things you forgot you signed up for',
      'Access to the accounts once we have agreed what stays',
      'One person who can decide, so the build does not stall waiting on an answer',
    ],
  },

  {
    // Added 5 Nov 2026 so the Full Studio Design Bundle service has an answer.
    id: 'exp_full_package',
    title: 'Full Studio Design Bundle',
    category: 'Packages',
    matches: ['full studio design bundle', 'studio design bundle', 'full studio bundle'],
    summary:
      'Everything a growing business needs to look and run as one brand: a website, an app design, a dashboard and a complete brand identity, made together.',
    short:
      'This bundle brings everything together in one project: a complete brand identity, a custom website, the design of a mobile app, and a dashboard showing the numbers you run the business on. Because it is all made by one team at the same time, it looks and works as one brand, and it costs less than buying each part separately.',
    included: [
      {
        what: 'A complete brand identity: logo, colours, fonts and a brand guide',
        why:
          'Everything else in the bundle is built on it, so your website, app and dashboard all look like the same business.',
      },
      {
        what: 'A custom website, designed and launched',
        why:
          'Built around what your business sells and what you need visitors to do, rather than a template.',
      },
      {
        what: 'The design of your mobile app, with a clickable prototype',
        why:
          'You can tap through the app on a phone and test it with customers before paying to have it built.',
      },
      {
        what: 'A dashboard for the numbers you run the business on',
        why:
          'Sales, customers or finances in one place, instead of adding them up from several systems by hand.',
      },
      {
        what: 'Priority appointments throughout the project',
        why:
          'Your questions and decisions are dealt with first, which keeps a larger project moving.',
      },
    ],
    outcome:
      'Your business looks established and consistent everywhere a customer meets it, and you can see how it is doing at a glance.',
    excluded: [
      'Building the mobile app and submitting it to the app stores, which is a separate build',
      'Third-party service fees — hosting, domain, email delivery, payment processing',
      'Moving data out of existing systems into the dashboard, quoted once we have seen it',
      'Ongoing hosting, support and changes after launch',
      'Feature work beyond what is agreed at the start — added by written change order so the price never moves without your say-so',
    ],
    timeline:
      'Typically 8 to 12 weeks. The brand comes first, then the website, app design and dashboard are made alongside each other. You approve each stage before the next begins.',
    needFromYou: [
      'An hour at the start to talk through your business, your customers and your competitors',
      'Anything you already have: a logo, photos, wording, a current site',
      'Access to the systems the dashboard will read from',
      'A named person who can sign off — the fastest projects have exactly one',
    ],
  },

  /* ----------------------------------------------------------- video ads -- */
  // Added 5 Nov 2026: the ad presets had no answer, so a video ad line on an
  // invoice had nothing to explain it. The invoice line keeps its own tier
  // list (Starter, Standard, Premium); these add the summary, what is not
  // included and the timeline.
  {
    id: 'exp_video_ad',
    title: 'Video Ad',
    category: 'Video Ads',
    matches: ['starter ad', 'standard ad', 'premium ad', 'video ad', 'video'],
    summary:
      'A short video ad made for your business, ready to post on social media, send by email or play on your website.',
    short:
      'This is a short video ad made for your business and ready to post. It is written and edited around one clear message, with music and an ending card showing how to reach you. Higher levels add more shapes for different platforms, original music, custom footage, a voiceover and rounds of changes.',
    included: [
      {
        what: 'A short video ad built around one clear message',
        why:
          'People scroll past an ad in seconds. One message, said well, is what gets remembered.',
      },
      {
        what: 'Sized for where it will run: square, vertical or wide',
        why:
          'Each platform crops differently. An ad made in the right shape fills the screen instead of shrinking into it.',
      },
      {
        what: 'Music, and an ending card with your contact details',
        why:
          'Someone who likes the ad knows exactly how to reach you before it ends.',
      },
      {
        what: 'Finished files ready to upload',
        why:
          'You get files that post straight to each platform, with no further editing needed.',
      },
    ],
    outcome:
      'You have a professional ad to put in front of customers this week, without filming anything yourself.',
    excluded: [
      'Paying for the ads to be shown — platform ad spend is paid directly by you',
      'Running or managing your ad campaigns',
      'AI footage credits, which are billed separately at what they cost us',
      'Changes beyond the rounds included at your level, quoted per round',
      'Filming on location or with actors, quoted separately',
    ],
    timeline:
      'Typically 3 to 7 working days from the time we have your logo, message and contact details, depending on the level.',
    needFromYou: [
      'Your logo and brand colours',
      'The one thing the ad should say, and who it is for',
      'The contact details for the ending card',
      'Any photos or clips of your business you would like used',
    ],
  },
  {
    id: 'exp_ads_monthly',
    title: 'Monthly Ads',
    category: 'Video Ads',
    matches: ['monthly ads'],
    summary:
      'Fresh video ads for your social media every month, so your accounts never go quiet.',
    short:
      'Each month we make 3 to 4 new video ads for your social media accounts, planned around what you want to promote that month. You approve them before they are finished, and the files arrive ready to post.',
    included: [
      {
        what: '3 to 4 new video ads every month',
        why:
          'Social platforms reward accounts that post regularly. A steady supply keeps you in front of customers.',
      },
      {
        what: 'Planned around what you want to promote that month',
        why:
          'A new service, a sale or a busy season gets its own ad, made in time to matter.',
      },
      {
        what: 'Made in the right shape for each of your accounts',
        why:
          'Each ad fills the screen on the platform it runs on.',
      },
      {
        what: 'You approve each ad before it is finished',
        why:
          'Nothing goes out in your name that you have not seen.',
      },
    ],
    outcome:
      'Your social media keeps working for you every month without you having to make content yourself.',
    excluded: [
      'Paying for the ads to be shown — platform ad spend is paid directly by you',
      'Posting the ads and replying to comments, unless added separately',
      'AI footage credits, which are billed separately at what they cost us',
      'Ads beyond the monthly number, quoted per ad',
    ],
    timeline:
      'Billed monthly. The first set is ready about a week after we agree the month\'s plan, then each month on a regular schedule.',
    needFromYou: [
      'What you want to promote each month, agreed at the start of the month',
      'Your logo and brand colours',
      'Approval of each ad within a few days, so the schedule holds',
    ],
  },
  {
    id: 'exp_ad_site_addon',
    title: 'Website Ad Add-on',
    category: 'Video Ads',
    matches: ['website ad add-on', 'website ad'],
    summary:
      'A video ad made from the website we have just built for you, to announce it and send people to it.',
    short:
      'Once your new website is built, we turn it into a short video ad that shows it off and sends people to it. It reuses the design, photos and wording we have already made, which is why it costs less than an ad made from scratch.',
    included: [
      {
        what: 'A short video ad made from your new website',
        why:
          'Announcing the new site gives people a reason to visit it in its first weeks.',
      },
      {
        what: 'Your site\'s design, photos and wording, in motion',
        why:
          'The ad matches the site exactly, so people recognise it when they arrive.',
      },
      {
        what: 'An ending card with your website address',
        why:
          'Anyone who watches knows exactly where to go.',
      },
    ],
    outcome:
      'Your new website launches with an ad that brings people to it.',
    excluded: [
      'Paying for the ad to be shown — platform ad spend is paid directly by you',
      'New footage or a voiceover, which are part of the Premium Ad',
      'Changes to the website itself',
    ],
    timeline:
      'Typically 3 to 5 working days after your website is finished.',
    needFromYou: [
      'Your approval of the finished website',
      'Where you plan to post the ad, so it is made in the right shape',
    ],
  },
  {
    id: 'exp_ai_credits',
    title: 'AI Footage Credits',
    category: 'Video Ads',
    matches: ['ai footage credits', 'ai footage', 'ai credits'],
    summary:
      'The cost of the AI tools used to create custom footage for your ad, passed on at exactly what they cost us.',
    short:
      'Custom footage for your ad is made with paid AI tools that charge for each clip they create. This line passes that cost on to you exactly as we pay it, with nothing added, so you only pay for the footage your ad actually needed.',
    included: [
      {
        what: 'The AI generation credits used to create your custom footage',
        why:
          'You see this cost on its own line instead of hidden inside the price of the ad.',
      },
      {
        what: 'Charged at exactly our cost, with nothing added',
        why:
          'You pay for what your ad used, and no more.',
      },
    ],
    outcome:
      'Your ad can show footage made just for your business, and you can see exactly what that footage cost.',
    excluded: [
      'The ad itself, which is its own line on this invoice',
    ],
    timeline:
      'Billed once the footage for your ad has been made.',
    needFromYou: [
      'Approval of the footage plan before credits are used',
    ],
  },

  /* ------------------------------------------------------ ongoing work ---- */
  {
    id: 'exp_hourly',
    title: 'Boutique Studio Engineering Hourly Rate',
    category: 'Ongoing Work',
    matches: ['hourly rate', 'engineering hourly', 'per hour', 'hourly'],
    summary:
      'Design and development time billed by the hour, for work after your project has launched.',
    short:
      'Design and development time billed by the hour, for changes, new features, or advice after launch. Every hour is tracked and itemised, so you can see exactly what it went to. Use it when the work is too small or too open-ended to be worth quoting as a project.',
    included: [
      {
        what: 'Design and development time, billed by the hour',
        why:
          'For work that does not justify the overhead of scoping and quoting a whole project.',
      },
      {
        what: 'Changes, new features, or advice after launch',
        why:
          'A new page, a form that needs another field, a question about whether something is possible.',
      },
      {
        what: 'Tracked and itemised',
        why:
          'You see what each hour went to, and can stop at any point. Nothing accumulates out of sight.',
      },
    ],
    outcome:
      'You can make small changes quickly without commissioning a project each time, and without keeping anyone on a retainer you may not use.',
    excluded: [
      'Emergency or out-of-hours response, unless separately agreed',
      'Third-party service fees incurred on your behalf',
      'Large pieces of work — past roughly twenty hours, a fixed quote is usually cheaper for you and we will say so',
    ],
    timeline:
      'Scheduled against current commitments. Small items usually within the week; tell us if something is urgent.',
    needFromYou: [
      'A clear description of what you want changed',
      'An idea of how many hours you want to authorise before we check back',
      'Access to whatever needs changing, if it is not something we built',
    ],
  },
  {
    id: 'exp_consultation',
    title: 'Custom Service / Design Consultation',
    category: 'Ongoing Work',
    matches: ['design consultation', 'custom service', 'consultation'],
    summary:
      'Scoped work or advice that does not fit a standard package, priced for what it actually involves.',
    short:
      'This line covers work specific to your situation that does not fit a standard package — a review of what you already have, advice on a decision, or a piece of design scoped to your needs. The line above it on the invoice describes exactly what was agreed.',
    included: [
      {
        what: 'Work scoped to your specific situation',
        why:
          'Not every job fits a package. This is priced for what it actually involves rather than rounded up to the nearest tier.',
      },
      {
        what: 'A written description of what was agreed',
        why:
          'The invoice line says what the work is, so there is a record neither of us has to remember.',
      },
    ],
    outcome:
      'You pay for the work you need rather than a package built around someone else.',
    excluded: [
      'Anything not named in the agreed description — additions are quoted before they start',
      'Third-party service fees incurred on your behalf',
    ],
    timeline: 'Agreed with you before the work begins.',
    needFromYou: [
      'A clear statement of what you want to achieve',
      'Any background or existing material relevant to it',
    ],
  },
];

/* ------------------------------------------------------------- lookup ----- */

export function explainerById(id: string | null | undefined): ClientExplainer | undefined {
  return id ? CLIENT_EXPLAINERS.find((e) => e.id === id) : undefined;
}

/** A fragment found as whole words: "website ad" is not in "website admin". */
function containsWords(text: string, fragment: string): boolean {
  const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`).test(text);
}

/**
 * Find the explainer for an invoice line. Longest fragment first, so a line
 * reading "Complex Custom Web App / Multi-Page Portal" resolves to the web app
 * entry rather than being caught by the shorter "portal". Fragments match
 * whole words only, so a short one cannot fire inside a longer word.
 */
export function explainerForDescription(description: string): ClientExplainer | undefined {
  const text = description.toLowerCase();
  let best: { explainer: ClientExplainer; length: number } | undefined;

  for (const explainer of CLIENT_EXPLAINERS) {
    for (const fragment of explainer.matches) {
      if (containsWords(text, fragment) && (!best || fragment.length > best.length)) {
        best = { explainer, length: fragment.length };
      }
    }
  }
  return best?.explainer;
}

/* ---------------------------------------------------------- formatting ---- */

/**
 * The full explanation as plain text, ready to paste into an email.
 *
 * Plain text on purpose. It survives every mail client, every phone, and
 * pasting into a document, which rich text does not. The studio name is at the
 * bottom so a forwarded copy still says who wrote it.
 */
export function explainerAsEmail(e: ClientExplainer, priceOverride?: string): string {
  const price = priceOverride ?? e.price ?? '';
  const lines: string[] = [
    e.title.toUpperCase(),
    price ? `Investment: ${price}` : '',
    '',
    e.summary,
    '',
    'WHAT IS INCLUDED',
    '',
  ];

  for (const item of e.included) {
    lines.push(`• ${item.what}`);
    lines.push(`  ${item.why}`);
    lines.push('');
  }

  lines.push('WHAT THIS DOES FOR YOU', '', e.outcome, '');
  lines.push('WHAT IS NOT INCLUDED IN THIS PRICE', '');
  for (const item of e.excluded) lines.push(`• ${item}`);
  lines.push('', 'These can each be quoted separately — just ask.', '');
  lines.push('HOW LONG IT TAKES', '', e.timeline, '');
  lines.push('WHAT WE NEED FROM YOU', '');
  for (const item of e.needFromYou) lines.push(`• ${item}`);
  lines.push(
    '',
    '—',
    'Meridian Interface — Digital Design & Development Studio',
    'Meridianinterface@gmail.com • 281-882-9198 • meridianinterface.com',
  );

  return lines.filter((line, i) => !(line === '' && lines[i - 1] === '')).join('\n');
}

/** The short answer, for a text message or a one-line reply. */
export function explainerAsShort(e: ClientExplainer, priceOverride?: string): string {
  const price = priceOverride ?? e.price ?? '';
  return `${e.title}${price ? ` — ${price}` : ''}\n\n${e.short}\n\nHappy to go through it in more detail if useful.`;
}
