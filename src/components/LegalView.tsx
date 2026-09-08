import React, { useEffect } from 'react';

/**
 * Privacy policy and terms.
 *
 * Written from what this system actually does, not from a template. Every
 * claim here was checked against the code: the booking form posts to the
 * `intake` edge function, which writes a contact, a deal and an activity into
 * Supabase; follow-ups are drafted by Claude and held until a human approves
 * them; payment is a hosted Stripe Checkout page, so no card number ever
 * reaches this site or its server. If any of that changes, this page is part
 * of the change.
 *
 * Two things are deliberately absent, and their absence is stated rather than
 * papered over: the postal address (CAN-SPAM wants a real one and inventing an
 * address would be worse than admitting it is coming), and any claim to be
 * legal advice. Otis should have a qualified person read this before it does
 * real work.
 */

const UPDATED = '8 September 2026';

const CONTACT = {
  email: 'otis@meridianinterface.com',
  phone: '281-882-9198',
  location: 'Houston, Texas',
};

const H: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="font-display font-bold text-base text-slate-900 mt-8 mb-2">{children}</h3>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-body text-sm text-slate-700 leading-relaxed mb-3">{children}</p>
);

const LI: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="font-body text-sm text-slate-700 leading-relaxed mb-1.5">{children}</li>
);

interface LegalViewProps {
  /** 'privacy' or 'terms' — which document to open at. */
  doc?: 'privacy' | 'terms';
}

export const LegalView: React.FC<LegalViewProps> = ({ doc = 'privacy' }) => {
  useEffect(() => {
    const el = document.getElementById(doc);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [doc]);

  return (
    <main className="px-4 md:px-12 max-w-3xl mx-auto py-12 space-y-10">
      <header className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Legal</p>
        <h1 className="font-display font-bold text-3xl text-slate-900">Privacy &amp; Terms</h1>
        <p className="font-body text-sm text-slate-600">Last updated {UPDATED}.</p>
      </header>

      {/* ------------------------------------------------------- privacy --- */}
      <section id="privacy" className="scroll-mt-24">
        <h2 className="font-display font-bold text-2xl text-slate-900 border-b border-slate-200 pb-2">
          Privacy Policy
        </h2>

        <P>
          Meridian Interface is a web and software development studio based in {CONTACT.location}.
          This policy explains what we collect when you use this website, why, and what you can
          ask us to do about it. It is written in plain language on purpose.
        </P>

        <H>What we collect</H>
        <P>
          <strong>When you book an appointment or send an enquiry,</strong> we collect what you type
          into the form: your name, email address, phone number, company name if you give one, the
          service you are interested in, your preferred date and time, any budget range you select,
          and your notes.
        </P>
        <P>
          <strong>How you found us.</strong> If you arrive through a campaign link, the form carries
          the campaign tag with it so we know which channel brought you. We do not run advertising
          trackers or third-party analytics on this site.
        </P>
        <P>
          <strong>What stays in your own browser.</strong> A copy of your booking is kept in your
          browser's local storage so the appointments page works. That copy never leaves your
          device and we cannot read it. Clearing your browser data removes it.
        </P>

        <H>What we do with it</H>
        <ul className="list-disc pl-5 mb-3">
          <LI>Reply to you, and arrange the work you asked about.</LI>
          <LI>Keep a record of the enquiry in our own customer database so nothing gets lost.</LI>
          <LI>
            Draft a reply. We use an AI assistant (Anthropic's Claude) to help write follow-up
            emails. <strong>Nothing it writes is sent automatically</strong> — a person reads and
            approves every message before it goes out, and your details are not used to train
            anyone's AI model.
          </LI>
          <LI>Send you an invoice, if you become a client.</LI>
        </ul>
        <P>
          We do not sell your information. We do not share it for anyone else's marketing.
        </P>

        <H>Who else touches it</H>
        <P>
          We use a small number of service providers to run the studio, and your information passes
          through them only for the purposes above: <strong>Supabase</strong> (our database and
          servers), <strong>Vercel</strong> (website hosting), <strong>Anthropic</strong> (drafting
          replies), <strong>SendGrid</strong> (sending email), and <strong>Stripe</strong> (taking
          payment).
        </P>
        <P>
          <strong>Card payments go to Stripe directly.</strong> Payment happens on a page Stripe
          hosts. Your card number never reaches this website or our servers, and we never see or
          store it.
        </P>

        <H>How long we keep it</H>
        <P>
          Enquiries and client records are kept while there is a live conversation or an ongoing
          relationship, and afterwards only as long as we need them for our business and tax
          records. Ask us to delete yours and we will, unless the law requires us to keep a copy.
        </P>

        <H>Your choices</H>
        <ul className="list-disc pl-5 mb-3">
          <LI>
            <strong>Stop marketing email at any time.</strong> Every marketing email carries an
            unsubscribe link that works immediately and needs no reply from us. You will still get
            messages about work in progress, like a booking confirmation or an invoice.
          </LI>
          <LI>
            <strong>Ask what we hold, or ask us to correct or delete it.</strong> Email{' '}
            <a className="text-blue-700 underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> and
            we will answer.
          </LI>
        </ul>
        <P>
          If you are a Texas resident, state law gives you rights over your personal data. The two
          points above are how you exercise them here; write to us and we will not make it
          difficult.
        </P>

        <H>Security, honestly stated</H>
        <P>
          Your records sit in a database that denies access by default and is reachable only by our
          own server code. Our staff area is behind a login. Payment card data never touches our
          systems at all. No system is perfect, and we would rather say that than claim otherwise.
        </P>

        <H>Children</H>
        <P>This is a service for businesses. It is not directed at children, and we do not knowingly collect their information.</P>

        <H>Contact</H>
        <P>
          <a className="text-blue-700 underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          {' · '}
          <a className="text-blue-700 underline" href={`tel:+12818829198`}>{CONTACT.phone}</a>
          {' · '}
          {CONTACT.location}
        </P>
      </section>

      {/* --------------------------------------------------------- terms --- */}
      <section id="terms" className="scroll-mt-24">
        <h2 className="font-display font-bold text-2xl text-slate-900 border-b border-slate-200 pb-2">
          Terms of Use
        </h2>

        <H>What this website is</H>
        <P>
          This site describes what Meridian Interface does, shows examples of our work, and lets you
          request an appointment. Using it means you accept these terms.
        </P>

        <H>Booking a call is not a contract</H>
        <P>
          Requesting an appointment starts a conversation. It does not commit either of us to a
          project. Work begins only when we have both agreed the scope and the price in writing.
        </P>

        <H>Prices</H>
        <P>
          Prices shown on this site are our published starting prices for the scope described. The
          price for your project is the one written in your own quote or invoice, which is what
          governs.
        </P>

        <H>The demonstrations</H>
        <P>
          The working demos on this site are examples we built to show what we can do. The
          businesses in them — the shops, the restaurants, the banks — are <strong>fictional</strong>.
          Nothing in them is a real product, a real price, or a real offer, and no demo takes a real
          payment.
        </P>

        <H>Our work belongs to you</H>
        <P>
          When you commission and pay for a project, the finished work is yours. We keep the right
          to show it as an example of what we do unless you ask us not to.
        </P>

        <H>What we do not promise</H>
        <P>
          We build software; we do not promise business outcomes. In particular we do not promise
          search rankings, traffic levels, or revenue, and we do not run advertising accounts. This
          site is provided as it is, and to the extent the law allows, our liability for using it is
          limited to what you paid us.
        </P>

        <H>Changes</H>
        <P>
          We may update these terms and this policy. The date at the top tells you when they last
          changed.
        </P>

        <H>Governing law</H>
        <P>These terms are governed by the laws of the State of Texas.</P>
      </section>
    </main>
  );
};
