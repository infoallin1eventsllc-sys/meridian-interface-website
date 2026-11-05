import React, { useEffect, useRef, useState } from 'react';
import { TabType, ServiceCategory, Appointment } from '../types';
import { SERVICES, PORTFOLIO } from '../data/mockData';
import { projectSlug } from './ImpactView';
import { useDialogFocus } from '../lib/useDialogFocus';
import { MeridianLogo } from './MeridianLogo';
import { submitAppointment, newAppointmentId, NOT_DISCUSSED } from '../lib/leads';
import { SpamTrap, caughtBySpamTrap } from './SpamTrap';
import { nextBusinessDay, todayISO, TIME_SLOTS } from '../lib/dates';

interface ModalsProps {
  isConsultationOpen: boolean;
  onCloseConsultation: () => void;
  isSearchOpen: boolean;
  onCloseSearch: () => void;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  onTabChange: (tab: TabType) => void;
  /** Open the Services page on one service. */
  onViewService: (service: ServiceCategory) => void;
  /** Open the Portfolio with one piece's panel. */
  onOpenProject: (slug: string) => void;
  onAppointmentCreated?: (appointment: Appointment) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  isConsultationOpen,
  onCloseConsultation,
  isSearchOpen,
  onCloseSearch,
  isMobileMenuOpen,
  onCloseMobileMenu,
  onTabChange,
  onViewService,
  onOpenProject,
  onAppointmentCreated
}) => {
  const bookRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useDialogFocus(bookRef, isConsultationOpen);
  useDialogFocus(searchRef, isSearchOpen);
  useDialogFocus(menuRef, isMobileMenuOpen);


  // Modal Appointment Form State
  const [modalService, setModalService] = useState<ServiceCategory>('web_design');
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalDate, setModalDate] = useState(nextBusinessDay);
  const [modalTime, setModalTime] = useState('10:00 AM - 11:00 AM CT');
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Same two guards as the booking page: no double booking, and no "Scheduled!"
  // when the studio never received it.
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false); // state alone misses clicks landing in the same tick
  const [delivered, setDelivered] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Closing always leaves the quick-book ready for a fresh booking. Before, a failed send kept the
  // confirmation up, so reopening "Book Appointment" showed the last person's "Scheduled!" screen
  // and no form until the page was reloaded.
  const closeTimer = useRef<number | undefined>(undefined);
  const resetBooking = () => {
    window.clearTimeout(closeTimer.current);
    setIsSubmitted(false);
    setModalName('');
    setModalEmail('');
    setModalPhone('');
  };
  const closeConsultation = () => {
    if (isSubmitted) resetBooking();
    else window.clearTimeout(closeTimer.current);
    onCloseConsultation();
  };
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Escape closes whichever of these three is open, like the concept panel
  // and the lightbox. Without it a keyboard user had no way out but Tab to
  // the close button.
  useEffect(() => {
    if (!isConsultationOpen && !isSearchOpen && !isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isSearchOpen) onCloseSearch();
      else if (isConsultationOpen) closeConsultation();
      else if (isMobileMenuOpen) onCloseMobileMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isConsultationOpen, isSearchOpen, isMobileMenuOpen, isSubmitted, onCloseConsultation, onCloseSearch, onCloseMobileMenu]);

  const handleModalBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    const serviceObj = SERVICES.find(s => s.id === modalService) || SERVICES[0];

    const newApt: Appointment = {
      id: newAppointmentId(),
      clientName: modalName,
      clientEmail: modalEmail,
      clientPhone: modalPhone,
      serviceType: modalService,
      serviceTitle: serviceObj.title,
      preferredDate: modalDate,
      preferredTimeSlot: modalTime,
      budgetRange: NOT_DISCUSSED,
      notes: 'Booked via Quick Modal',
      status: 'Scheduled',
      createdAt: todayISO()
    };

    // Single submission seam — persists locally and delivers to the backend when connected.
    // A spam bot gets the confirmation and nothing is sent or saved.
    const result = caughtBySpamTrap(e.currentTarget as HTMLFormElement)
      ? { delivered: true }
      : await submitAppointment(newApt);
    sendingRef.current = false;
    setSending(false);
    setDelivered(result.delivered);

    if (onAppointmentCreated) {
      onAppointmentCreated(newApt);
    }

    setIsSubmitted(true);
    // A failed send stays on screen: the visitor needs to read the fallback.
    if (!result.delivered) return;
    closeTimer.current = window.setTimeout(() => {
      resetBooking();
      onCloseConsultation();
    }, 2000);
  };

  return (
    <>
      {/* 1. Quick Book Appointment Modal */}
      {isConsultationOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={closeConsultation}>
          <div ref={bookRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Book an appointment" onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 relative border border-slate-200 shadow-2xl">
            <button
              onClick={closeConsultation}
              aria-label="Close dialog"
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl" aria-hidden="true">close</span>
            </button>

            {isSubmitted ? (
              <div data-private className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">check</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-900">
                  {delivered ? 'Appointment Scheduled!' : 'Request Saved on This Device'}
                </h3>
                <p className="font-body text-xs text-slate-600 max-w-sm mx-auto">
                  {delivered ? (
                    <>Thank you, <strong className="text-slate-900">{modalName}</strong>. Your design appointment for {modalDate} ({modalTime}) has been saved to your portal. We'll reply within one business day to confirm it.</>
                  ) : (
                    <>Thank you, <strong className="text-slate-900">{modalName}</strong>. Your request for {modalDate} ({modalTime}) is saved here, but it hasn't reached the studio yet.</>
                  )}
                </p>
                {!delivered && (
                  <p role="alert" className="font-body text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-sm mx-auto text-left">
                    We could not reach the studio's system just now, so this request is saved on this device only. If you do not
                    hear back within one business day, email <a className="underline font-semibold" href="mailto:otis@meridianinterface.com">otis@meridianinterface.com</a> and it will not be lost.
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">event</span>
                  Quick Appointment Booking
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-4">
                  Schedule Design Session
                </h3>

                <form onSubmit={handleModalBookSubmit} className="space-y-4">
                  <SpamTrap />
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Required Design Service
                    </label>
                    <select
                      aria-label="Required design service"
                      autoFocus
                      value={modalService}
                      onChange={(e) => setModalService(e.target.value as ServiceCategory)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-slate-900"
                    >
                      {SERVICES.map((service) => (
                        <option key={service.id} value={service.id}>{service.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        aria-label="Preferred date"
                        value={modalDate}
                        min={todayISO()}
                        onChange={(e) => setModalDate(e.target.value)}
                        className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2 text-xs font-semibold text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Time Slot
                      </label>
                      <select
                        aria-label="Time slot"
                        value={modalTime}
                        onChange={(e) => setModalTime(e.target.value)}
                        className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2 text-xs font-semibold text-slate-800 outline-none"
                      >
                        {TIME_SLOTS.map((slot) => <option key={slot}>{slot}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      aria-label="Full name"
                      placeholder="e.g. Alex Hayes"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-xs outline-none focus:border-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        aria-label="Email address"
                        placeholder="alex@company.com"
                        value={modalEmail}
                        onChange={(e) => setModalEmail(e.target.value)}
                        className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-xs outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        autoComplete="tel"
                        aria-label="Phone number"
                        placeholder="+1 (555) 000-0000"
                        value={modalPhone}
                        onChange={(e) => setModalPhone(e.target.value)}
                        className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-xs outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-[#0f172a] text-white py-3.5 font-body font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-md mt-2 disabled:opacity-60 disabled:cursor-wait"
                  >
                    {sending ? 'Sending…' : 'Confirm Appointment'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onCloseSearch}>
          <div ref={searchRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Search the studio" onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-xl w-full p-4 md:p-6 shadow-2xl border border-slate-200 relative">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <span className="material-symbols-outlined text-slate-500" aria-hidden="true">search</span>
              <input
                type="search"
                autoFocus
                aria-label="Search services, demos and pages"
                placeholder="Search web design, app interfaces, logo packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-body text-slate-900 outline-none bg-transparent"
              />
              <button onClick={onCloseSearch} aria-label="Close search" className="p-1 text-slate-500 hover:text-slate-900">
                <span className="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Quick Studio Navigation'}
              </div>
              {(() => {
                // Built from the same lists the pages use, so a new service or demo shows up here too.
                type SearchItem = { title: string; desc: string; category: string; go: () => void };
                const searchItems: SearchItem[] = [
                  ...SERVICES.map((service) => ({
                    title: service.title,
                    desc: service.categoryName,
                    category: 'Services',
                    go: () => onViewService(service.id),
                  })),
                  { title: 'Book a 1-on-1 Appointment', desc: 'Pick a time to talk through your project with Otis', category: 'Booking', go: () => onTabChange('booking') },
                  { title: 'My Appointments', desc: 'See the sessions you have booked', category: 'Appointments', go: () => onTabChange('appointments') },
                  ...PORTFOLIO.map((piece) => ({
                    title: piece.title,
                    desc: piece.categoryLabel,
                    category: 'Portfolio',
                    go: () => onOpenProject(projectSlug(piece)),
                  })),
                  { title: 'Interactive Project Cost Estimator', desc: 'Scope calculator for web, app, dashboard & logo quotes', category: 'Tool', go: () => onTabChange('services') },
                ];

                const filtered = searchItems.filter(item =>
                  !searchQuery ||
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No matching services or pages found for "{searchQuery}".
                    </div>
                  );
                }

                return filtered.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onCloseSearch();
                      item.go();
                    }}
                    className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between group border border-transparent hover:border-slate-100"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                          {item.category}
                        </span>
                        <p className="font-body font-bold text-xs text-slate-900">{item.title}</p>
                      </div>
                      <p className="font-body text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <span className="material-symbols-outlined text-xs text-slate-400 group-hover:translate-x-1 transition-transform" aria-hidden="true">
                      arrow_forward
                    </span>
                  </button>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 3. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onCloseMobileMenu}>
          <div ref={menuRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Navigation menu" onClick={(e) => e.stopPropagation()} className="bg-white w-4/5 max-w-sm h-full p-6 flex flex-col justify-between shadow-2xl relative">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
                <div>
                  <MeridianLogo size={32} subtext="INTERFACE" />
                </div>
                <button onClick={onCloseMobileMenu} aria-label="Close menu" className="p-1 text-slate-500">
                  <span className="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
              </div>

              <nav className="space-y-1">
                {[
                  { tab: 'home', label: 'Home', icon: 'home' },
                  { tab: 'services', label: 'Services', icon: 'grid_view' },
                  { tab: 'portfolio', label: 'Portfolio', icon: 'palette' },
                  { tab: 'booking', label: 'Book Appointment', icon: 'event' },
                  { tab: 'appointments', label: 'My Appointments', icon: 'dashboard' }
                ].map((nav) => (
                  <button
                    key={nav.tab}
                    onClick={() => {
                      onTabChange(nav.tab as TabType);
                      onCloseMobileMenu();
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl font-body font-bold text-xs hover:bg-slate-100 flex items-center justify-between text-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg" aria-hidden="true">{nav.icon}</span>
                      <span>{nav.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-sm text-slate-400" aria-hidden="true">chevron_right</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <button
                onClick={() => {
                  onCloseMobileMenu();
                  onTabChange('booking');
                }}
                className="w-full bg-[#0f172a] text-white py-3 font-body font-bold text-xs uppercase tracking-widest rounded-lg"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
