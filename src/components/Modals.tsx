import React, { useState } from 'react';
import { TabType, ServiceCategory, Appointment } from '../types';
import { SERVICES } from '../data/mockData';
import { MeridianLogo } from './MeridianLogo';
import { submitAppointment, newAppointmentId } from '../lib/leads';

interface ModalsProps {
  isConsultationOpen: boolean;
  onCloseConsultation: () => void;
  isSearchOpen: boolean;
  onCloseSearch: () => void;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  onTabChange: (tab: TabType) => void;
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
  onAppointmentCreated
}) => {
  // Modal Appointment Form State
  const [modalService, setModalService] = useState<ServiceCategory>('web_design');
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalDate, setModalDate] = useState('2026-08-05');
  const [modalTime, setModalTime] = useState('10:00 AM - 11:00 AM EST');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const handleModalBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      budgetRange: '$3,000 - $5,000',
      notes: 'Booked via Quick Modal',
      status: 'Scheduled',
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Single submission seam — persists locally and delivers to the backend when connected.
    await submitAppointment(newApt);

    if (onAppointmentCreated) {
      onAppointmentCreated(newApt);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onCloseConsultation();
      setModalName('');
      setModalEmail('');
      setModalPhone('');
    }, 2000);
  };

  return (
    <>
      {/* 1. Quick Book Appointment Modal */}
      {isConsultationOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onCloseConsultation}>
          <div role="dialog" aria-modal="true" aria-label="Book an appointment" onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 relative border border-slate-200 shadow-2xl">
            <button
              onClick={onCloseConsultation}
              aria-label="Close dialog"
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">check</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-900">
                  Appointment Scheduled!
                </h3>
                <p className="font-body text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you, <strong className="text-slate-900">{modalName}</strong>. Your design appointment for {modalDate} ({modalTime}) has been saved to your portal.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
                  <span className="material-symbols-outlined text-sm">event</span>
                  Quick Appointment Booking
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-4">
                  Schedule Design Session
                </h3>

                <form onSubmit={handleModalBookSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Required Design Service
                    </label>
                    <select
                      aria-label="Required design service"
                      value={modalService}
                      onChange={(e) => setModalService(e.target.value as ServiceCategory)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-slate-900"
                    >
                      <option value="web_design">Web Design & Development</option>
                      <option value="app_design">Mobile App UI/UX Design</option>
                      <option value="dashboards">Data Analyst, CRM & Financial Dashboards</option>
                      <option value="logo_brand">Logo Design & Brand Identity</option>
                      <option value="full_package">Full Studio Design Bundle</option>
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
                        <option>10:00 AM - 11:00 AM EST</option>
                        <option>01:00 PM - 02:00 PM EST</option>
                        <option>03:30 PM - 04:30 PM EST</option>
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
                    className="w-full bg-[#0f172a] text-white py-3.5 font-body font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-md mt-2"
                  >
                    Confirm Appointment
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
          <div role="dialog" aria-modal="true" aria-label="Search the studio" onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-xl w-full p-4 md:p-6 shadow-2xl border border-slate-200 relative">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <span className="material-symbols-outlined text-slate-500">search</span>
              <input
                type="text"
                autoFocus
                placeholder="Search web design, app interfaces, logo packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-body text-slate-900 outline-none bg-transparent"
              />
              <button onClick={onCloseSearch} aria-label="Close search" className="p-1 text-slate-500 hover:text-slate-900">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Quick Studio Navigation'}
              </div>
              {(() => {
                const searchItems = [
                  { title: 'Web Design & Development', desc: 'Custom responsive sites, landing pages, CMS & e-commerce', tab: 'services', category: 'Services' },
                  { title: 'Mobile App Design (iOS & Android)', desc: 'Mobile UI/UX design, interactive prototypes & app flows', tab: 'services', category: 'Services' },
                  { title: 'Data Analyst & Financial Dashboards', desc: 'CRM, business metrics, financial charts & analytics UI', tab: 'services', category: 'Services' },
                  { title: 'Logo Design & Brand Identity', desc: 'Custom vector logos, brand guidelines & style guides', tab: 'services', category: 'Services' },
                  { title: 'Schedule 1-on-1 Discovery Session', desc: 'Lock in an appointment time slot with lead designers', tab: 'booking', category: 'Booking' },
                  { title: 'Client Appointments Portal', desc: 'Track, review, or modify your scheduled sessions & passes', tab: 'appointments', category: 'Portal' },
                  { title: 'Financial & Revenue BI Dashboard', desc: 'Concept: real-time financial analytics dashboard', tab: 'portfolio', category: 'Concept' },
                  { title: 'Mobile Banking & Wealth App', desc: 'Concept: fintech iOS & Android UI', tab: 'portfolio', category: 'Concept' },
                  { title: 'Artisan Coffee Brand Identity', desc: 'Concept: logo, packaging & brand system', tab: 'portfolio', category: 'Concept' },
                  { title: 'Interactive Project Cost Estimator', desc: 'Scope calculator for web, app, dashboard & logo quotes', tab: 'services', category: 'Tool' }
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
                      onTabChange(item.tab as TabType);
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
                    <span className="material-symbols-outlined text-xs text-slate-400 group-hover:translate-x-1 transition-transform">
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
          <div role="dialog" aria-modal="true" aria-label="Navigation menu" onClick={(e) => e.stopPropagation()} className="bg-white w-4/5 max-w-sm h-full p-6 flex flex-col justify-between shadow-2xl relative">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
                <div>
                  <MeridianLogo size={32} subtext="INTERFACE" />
                </div>
                <button onClick={onCloseMobileMenu} aria-label="Close menu" className="p-1 text-slate-500">
                  <span className="material-symbols-outlined">close</span>
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
                      <span className="material-symbols-outlined text-lg">{nav.icon}</span>
                      <span>{nav.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
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
