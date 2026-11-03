import { Suspense, lazy, useEffect, useState } from 'react';
import { TabType, ServiceCategory, Appointment } from './types';
import { BucketView } from './components/BucketView';
import { initAnalytics, trackPage } from './lib/analytics';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { SolutionsView } from './components/SolutionsView';
import { ImpactView } from './components/ImpactView';
import { ConnectView } from './components/ConnectView';
import { DashboardView } from './components/DashboardView';
import { LegalView } from './components/LegalView';
import { UnsubscribeView } from './components/UnsubscribeView';
import { Modals } from './components/Modals';
import { MotionProvider } from './components/MotionProvider';

// The studio portal is for one person. Loading it on demand keeps its invoice
// editor, security tab and QR library out of what every visitor downloads.
const OwnerInvoiceView = lazy(() =>
  import('./components/OwnerInvoiceView').then((m) => ({ default: m.OwnerInvoiceView })),
);

/** What a browser history entry remembers: the section, which legal page and service it was
    showing, and how far down the visitor had scrolled when they left it. */
type HistoryEntry = { tab: TabType; legal: 'privacy' | 'terms'; service: ServiceCategory; y?: number };

export default function App() {
  // An unsubscribe link must work for someone who has never seen this site and
  // does not want to. It is not a tab: no header, no nav, no booking prompt —
  // it does the one thing they asked for and gets out of the way.
  const isUnsubscribe = typeof window !== 'undefined' &&
    window.location.pathname.replace(/\/+$/, '') === '/unsubscribe';

  // A ?project= or ?book= link lands on its section (the effects below fill in the details). Starting
  // there, rather than on Home, keeps Back from stopping on a Home page the visitor never saw.
  const [currentTab, setCurrentTab] = useState<TabType>(() => {
    if (isUnsubscribe) return 'home';
    const query = new URLSearchParams(window.location.search);
    return query.get('project') ? 'portfolio' : query.has('book') ? 'booking' : 'home';
  });

  /* Analytics starts once, and never on the unsubscribe page: that page is
     reached by someone asking to hear less from this business, and measuring
     them on their way out would be the wrong instinct. Inert unless a PostHog
     key is configured — see src/lib/analytics.ts. */
  useEffect(() => {
    if (isUnsubscribe) return;
    initAnalytics();
    trackPage('home');
  }, [isUnsubscribe]);
  const [preselectedService, setPreselectedService] = useState<ServiceCategory>('web_design');

  // `?book=<service>` opens the booking form directly, with that service chosen:
  // the hosted demos link here ("Book an appointment"), and a visitor who has
  // just clicked through one should land on the form, not the homepage.
  useEffect(() => {
    if (isUnsubscribe) return;
    const want = new URLSearchParams(window.location.search).get('book');
    if (want === null) return;
    const services: ServiceCategory[] = ['web_design', 'app_design', 'dashboards', 'logo_brand', 'systems', 'tech_stack', 'full_package'];
    if (services.includes(want as ServiceCategory)) setPreselectedService(want as ServiceCategory);
    setCurrentTab('booking');
    trackPage('booking');
  }, [isUnsubscribe]);

  // `?project=<slug>` opens the Portfolio with that piece's panel: a link a recruiter or client can be
  // sent, instead of the home page. ImpactView reads the slug and keeps the address bar in step.
  const [openProject, setOpenProject] = useState<string | null>(() =>
    isUnsubscribe ? null : new URLSearchParams(window.location.search).get('project'));
  const forgetProject = () => {
    setOpenProject(null);
    const url = new URL(window.location.href);
    if (url.searchParams.has('project')) {
      url.searchParams.delete('project');
      window.history.replaceState(window.history.state, '', url);
    }
  };
  useEffect(() => {
    if (!openProject) return;
    setCurrentTab('portfolio');
    trackPage('portfolio');
  }, [openProject]);

  // Modal States
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Where this section was left, so Back can return to the same spot.
  const rememberScroll = () =>
    window.history.replaceState({ ...window.history.state, y: window.scrollY }, '');

  const handleTabChange = (tab: TabType) => {
    rememberScroll();
    forgetProject();
    setCurrentTab(tab);
    trackPage(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // A home-page service card opens the Services page on that service.
  const [servicesFocus, setServicesFocus] = useState<ServiceCategory>('web_design');
  const handleViewService = (serviceId: ServiceCategory) => {
    setServicesFocus(serviceId);
    handleTabChange('services');
  };

  // Notes a booking starts with: the brief from the Services page scope builder.
  const [bookingNotes, setBookingNotes] = useState('');
  const handleQuickBookService = (serviceId: ServiceCategory, brief = '') => {
    setPreselectedService(serviceId);
    setBookingNotes(brief);
    rememberScroll();
    forgetProject();
    setCurrentTab('booking');
    trackPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bumped whenever a booking is made. The appointments portal keys off this so
  // a booking made *from* that page shows up immediately — without it the list
  // only reads storage on mount, and a client who just booked sees a stale list
  // and reasonably concludes the booking failed.
  const [bookingVersion, setBookingVersion] = useState(0);
  // Which legal document the footer asked for. Both live on one page; this
  // only decides which heading it opens at.
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms'>('privacy');

  // Each section gets its own browser-tab title. The site is one address with
  // no router, so this is for people (tabs, history, bookmarks) and analytics
  // rather than Google, which only ever sees the homepage title in index.html.
  useEffect(() => {
    if (isUnsubscribe) { document.title = 'Unsubscribe | Meridian Interface'; return; }
    const titles: Record<TabType, string> = {
      home: 'Houston Web Design, Apps & Dashboards | Meridian Interface',
      services: 'Services: Web Design, Apps & Dashboards in Houston | Meridian Interface',
      portfolio: 'Portfolio: Working Demos | Meridian Interface',
      booking: 'Book an Appointment | Meridian Interface',
      bucket: 'Your Saved List | Meridian Interface',
      appointments: 'My Appointments | Meridian Interface',
      owner_invoice: 'Studio Portal | Meridian Interface',
      legal: legalDoc === 'terms' ? 'Terms of Use | Meridian Interface' : 'Privacy Policy | Meridian Interface',
    };
    document.title = titles[currentTab];
  }, [currentTab, legalDoc, isUnsubscribe]);

  // Back and Forward move between sections. There is still one address and no router: each change
  // of section adds a history entry saying which section it was, so the browser's Back button
  // returns to the previous section instead of leaving the site.
  useEffect(() => {
    if (isUnsubscribe) return;
    const entry = { tab: currentTab, legal: legalDoc, service: servicesFocus };
    const here = window.history.state as HistoryEntry | null;
    if (!here?.tab) window.history.replaceState({ ...here, ...entry }, '');
    else if (here.tab !== entry.tab || here.legal !== entry.legal || here.service !== entry.service)
      window.history.pushState(entry, '');
  }, [currentTab, legalDoc, servicesFocus, isUnsubscribe]);

  useEffect(() => {
    if (isUnsubscribe) return;
    // The browser would restore the scroll before the section has drawn; this puts people back after.
    window.history.scrollRestoration = 'manual';
    const onBackOrForward = (event: PopStateEvent) => {
      const entry = event.state as HistoryEntry | null;
      if (!entry?.tab) return;
      setLegalDoc(entry.legal);
      setServicesFocus(entry.service);
      setOpenProject(new URLSearchParams(window.location.search).get('project'));
      setCurrentTab(entry.tab);
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
      trackPage(entry.tab);
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, entry.y ?? 0)));
    };
    window.addEventListener('popstate', onBackOrForward);
    return () => window.removeEventListener('popstate', onBackOrForward);
  }, [isUnsubscribe]);

  const handleOpenLegal = (doc: 'privacy' | 'terms') => {
    setLegalDoc(doc);
    handleTabChange('legal');
  };

  const handleAppointmentCreated = (_appointment: Appointment) => {
    // Deliberately does not log the appointment: it carries personal data
    // (name, email, phone) that must not be written to the browser console.
    setBookingVersion((v) => v + 1);
  };

  if (isUnsubscribe) {
    return (
      <MotionProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-body">
          <UnsubscribeView />
        </div>
      </MotionProvider>
    );
  }

  return (
    <MotionProvider>
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-body selection:bg-slate-200">
      {/* Skip link — first thing in the tab order, invisible until focused.
          Without it, anyone navigating by keyboard has to tab through the whole
          header (logo, five nav items, search, book, menu) on every section
          change before reaching the content. `sr-only` keeps it out of the
          layout; `focus:not-sr-only` brings it back the moment it is reached. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-[#0f172a] focus:text-white focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Skip to main content
      </a>

      {/* Fixed Header */}
      <Header
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onOpenBookModal={() => setIsBookModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Main View Area. The id is the skip link's target; tabIndex={-1} lets it
          receive focus programmatically so the next Tab continues from here
          rather than jumping back to the top of the document. */}
      <div id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
        {currentTab === 'home' && (
          <HomeView
            onTabChange={handleTabChange}
            onOpenBookModal={() => setIsBookModalOpen(true)}
            onViewService={handleViewService}
          />
        )}

        {currentTab === 'services' && (
          <SolutionsView
            key={servicesFocus}
            onTabChange={handleTabChange}
            onSelectServiceForBooking={handleQuickBookService}
            initialServiceId={servicesFocus}
          />
        )}

        {currentTab === 'portfolio' && (
          <ImpactView
            onTabChange={handleTabChange}
            onOpenBookModal={() => setIsBookModalOpen(true)}
            openProject={openProject}
          />
        )}

        {currentTab === 'booking' && (
          <ConnectView
            onTabChange={handleTabChange}
            preselectedService={preselectedService}
            initialNotes={bookingNotes}
            onAppointmentCreated={handleAppointmentCreated}
          />
        )}

        {currentTab === 'appointments' && (
          <DashboardView
            key={bookingVersion}
            onOpenBookModal={() => setIsBookModalOpen(true)}
          />
        )}

        {currentTab === 'owner_invoice' && (
          <Suspense
            fallback={
              <p role="status" className="py-24 text-center text-sm text-slate-500">
                Loading the studio portal…
              </p>
            }
          >
            <OwnerInvoiceView onTabChange={handleTabChange} />
          </Suspense>
        )}

        {currentTab === 'bucket' && <BucketView onTabChange={handleTabChange} />}

        {currentTab === 'legal' && <LegalView doc={legalDoc} />}
      </div>

      {/* Footer */}
      <Footer
        onTabChange={handleTabChange}
        onOpenBookModal={() => setIsBookModalOpen(true)}
        onOpenLegal={handleOpenLegal}
      />

      {/* Floating Bottom Navigation Bar for Mobile */}
      <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />

      {/* All Interactive Modals & Drawers */}
      <Modals
        isConsultationOpen={isBookModalOpen}
        onCloseConsultation={() => setIsBookModalOpen(false)}
        isSearchOpen={isSearchOpen}
        onCloseSearch={() => setIsSearchOpen(false)}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        onTabChange={handleTabChange}
        onAppointmentCreated={handleAppointmentCreated}
      />
    </div>
    </MotionProvider>
  );
}
