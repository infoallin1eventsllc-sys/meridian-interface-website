import React, { useState } from 'react';
import { TabType, ServiceCategory, Appointment } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { SolutionsView } from './components/SolutionsView';
import { ImpactView } from './components/ImpactView';
import { ConnectView } from './components/ConnectView';
import { DashboardView } from './components/DashboardView';
import { OwnerInvoiceView } from './components/OwnerInvoiceView';
import { Modals } from './components/Modals';
import { MotionProvider } from './components/MotionProvider';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [preselectedService, setPreselectedService] = useState<ServiceCategory>('web_design');

  // Modal States
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickBookService = (serviceId: ServiceCategory) => {
    setPreselectedService(serviceId);
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bumped whenever a booking is made. The appointments portal keys off this so
  // a booking made *from* that page shows up immediately — without it the list
  // only reads storage on mount, and a client who just booked sees a stale list
  // and reasonably concludes the booking failed.
  const [bookingVersion, setBookingVersion] = useState(0);

  const handleAppointmentCreated = (_appointment: Appointment) => {
    // Deliberately does not log the appointment: it carries personal data
    // (name, email, phone) that must not be written to the browser console.
    setBookingVersion((v) => v + 1);
  };

  return (
    <MotionProvider>
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-body selection:bg-slate-200">
      {/* Fixed Header */}
      <Header
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onOpenBookModal={() => setIsBookModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Main View Area */}
      <div className="flex-grow">
        {currentTab === 'home' && (
          <HomeView
            onTabChange={handleTabChange}
            onOpenBookModal={() => setIsBookModalOpen(true)}
            onQuickBookService={handleQuickBookService}
          />
        )}

        {currentTab === 'services' && (
          <SolutionsView
            onTabChange={handleTabChange}
            onSelectServiceForBooking={handleQuickBookService}
          />
        )}

        {currentTab === 'portfolio' && (
          <ImpactView
            onTabChange={handleTabChange}
            onOpenBookModal={() => setIsBookModalOpen(true)}
          />
        )}

        {currentTab === 'booking' && (
          <ConnectView
            onTabChange={handleTabChange}
            preselectedService={preselectedService}
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
          <OwnerInvoiceView onTabChange={handleTabChange} />
        )}
      </div>

      {/* Footer */}
      <Footer
        onTabChange={handleTabChange}
        onOpenBookModal={() => setIsBookModalOpen(true)}
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
