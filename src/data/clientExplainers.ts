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
  category: 'Websites' | 'Brand & Logo' | 'Packages' | 'Ongoing Work';
  /** Displayed as-is; the invoice carries the figure that was actually billed. */
  price: string;
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
    price: '$3,800',
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
    price: '$8,500',
    matches: ['custom 3–7 page', 'custom 3-7 page', '3–7 page business', 'business site'],
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
      'Pages beyond the seventh — quoted individually',
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
    id: 'exp_web_app',
    title: 'Complex Custom Web App / Multi-Page Portal',
    category: 'Websites',
    price: '$18,500 – $22,000',
    matches: [
      'complex custom web app',
      'complex web app',
      'multi-page portal',
      'web app',
      'portal',
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

  /* --------------------------------------------------------- brand & logo -- */
  {
    id: 'exp_logo_suite',
    title: 'Boutique Logo Design Suite',
    category: 'Brand & Logo',
    price: '$2,500',
    matches: ['boutique logo design suite', 'basic logo', 'logo design suite', 'logo suite'],
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
    price: '$6,500',
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
    price: '$4,500',
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
    price: '$9,500',
    matches: ['growth / professional', 'growth package', 'professional package', 'growth'],
    summary:
      'A full brand kit plus a larger site with working tools built in — for a business the simple site has outgrown.',
    short:
      'For a business that has outgrown a basic site and needs the website to do actual work. You get a complete brand kit, a six to twelve page site or web app designed from scratch, and working tools built in — a price calculator, online booking, and a client login area — plus your domain connected and us on hand through launch.',
    included: [
      {
        what: 'A complete brand kit',
        why:
          'Main logo, alternate, browser icon, and a guide so everything stays consistent as more people touch it.',
      },
      {
        what: 'A six to twelve page site or web app, designed from scratch',
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
    price: '$22,500',
    matches: ['enterprise custom application', 'enterprise / custom', 'enterprise package', 'enterprise'],
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
    price: '$7,500',
    matches: ['tech stack', 'business tech stack', 'systems & integration', 'integration'],
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

  /* ------------------------------------------------------ ongoing work ---- */
  {
    id: 'exp_hourly',
    title: 'Boutique Studio Engineering Hourly Rate',
    category: 'Ongoing Work',
    price: '$150 / hour',
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
    price: 'Quoted per engagement',
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

/**
 * Find the explainer for an invoice line. Longest fragment first, so a line
 * reading "Complex Custom Web App / Multi-Page Portal" resolves to the web app
 * entry rather than being caught by the shorter "portal".
 */
export function explainerForDescription(description: string): ClientExplainer | undefined {
  const text = description.toLowerCase();
  let best: { explainer: ClientExplainer; length: number } | undefined;

  for (const explainer of CLIENT_EXPLAINERS) {
    for (const fragment of explainer.matches) {
      if (text.includes(fragment) && (!best || fragment.length > best.length)) {
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
  const price = priceOverride ?? e.price;
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
    'Meridianinterface@gmail.com • 281-882-9198 • www.meridianinterface.com',
  );

  return lines.filter((line, i) => !(line === '' && lines[i - 1] === '')).join('\n');
}

/** The short answer, for a text message or a one-line reply. */
export function explainerAsShort(e: ClientExplainer, priceOverride?: string): string {
  const price = priceOverride ?? e.price;
  return `${e.title}${price ? ` — ${price}` : ''}\n\n${e.short}\n\nHappy to go through it in more detail if useful.`;
}
