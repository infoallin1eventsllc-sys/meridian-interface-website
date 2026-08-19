import React, { useState } from 'react';
import { TabType, ServiceCategory, Appointment } from '../types';
import { SERVICES } from '../data/mockData';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';
import { submitAppointment, newAppointmentId } from '../lib/leads';

interface AppointmentBookingViewProps {
  onTabChange?: (tab: TabType) => void;
  preselectedService?: ServiceCategory;
  onAppointmentCreated?: (appointment: Appointment) => void;
}

export const ConnectView: React.FC<AppointmentBookingViewProps> = ({
  onTabChange,
  preselectedService = 'web_design',
  onAppointmentCreated
}) => {
  // Booking Form State
  const [selectedService, setSelectedService] = useState<ServiceCategory>(preselectedService);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-08-05');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('10:00 AM - 11:00 AM EST');
  const [budgetRange, setBudgetRange] = useState('$3,000 - $5,000');
  const [notes, setNotes] = useState('');

  // Submission State
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [docModalMode, setDocModalMode] = useState<'invoice' | 'receipt' | null>(null);

  const activeServiceObj = SERVICES.find(s => s.id === selectedService) || SERVICES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newApt: Appointment = {
      id: newAppointmentId(),
      clientName,
      clientEmail,
      clientPhone,
      companyName,
      serviceType: selectedService,
      serviceTitle: activeServiceObj.title,
      preferredDate,
      preferredTimeSlot,
      budgetRange,
      notes,
      status: 'Scheduled',
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Route through the single submission seam: persists locally and, when the
    // marketing backend is connected, delivers to it. See src/lib/leads.ts.
    await submitAppointment(newApt);

    if (onAppointmentCreated) {
      onAppointmentCreated(newApt);
    }

    setCreatedAppointment(newApt);
  };

  const handleReset = () => {
    setCreatedAppointment(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setCompanyName('');
    setNotes('');
  };

  return (
    <main className="pt-24 pb-24 md:pb-16 px-4 md:px-12 max-w-[1440px] mx-auto animate-fadeIn bg-slate-50 min-h-screen">
      {/* Page Title */}
      <section className="mb-10 max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0f172a] text-white rounded-full text-xs font-bold uppercase tracking-widest">
          <span className="material-symbols-outlined text-sm">calendar_add_on</span>
          MERIDIAN Appointment Desk
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 font-black leading-tight tracking-tight">
          Schedule Your Design Appointment
        </h1>
        <p className="font-body text-base md:text-lg text-slate-600 leading-relaxed">
          Book a dedicated 1-on-1 discovery consultation for your website design, mobile application interface, or brand logo identity project.
        </p>
      </section>

      {createdAppointment ? (
        /* Confirmation Screen */
        <section className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-xl space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Appointment Reference #{createdAppointment.id}
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
              Appointment Successfully Booked!
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Thank you, <strong className="text-slate-900">{createdAppointment.clientName}</strong>. Your design consultation has been scheduled.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-left space-y-3 text-xs text-slate-700">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold">Selected Service:</span>
              <span className="font-bold text-slate-900">{createdAppointment.serviceTitle}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold">Scheduled Date:</span>
              <span className="font-bold text-slate-900">{createdAppointment.preferredDate}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold">Time Slot:</span>
              <span className="font-bold text-slate-900">{createdAppointment.preferredTimeSlot}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold">Contact Email:</span>
              <span className="font-bold text-slate-900">{createdAppointment.clientEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Status:</span>
              <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px] uppercase tracking-wider">
                {createdAppointment.status}
              </span>
            </div>
          </div>

          {/* Invoice & Payment Receipt Document Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setDocModalMode('invoice')}
              className="py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-body font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-lg text-blue-700">description</span>
              View Official Service Invoice
            </button>
            <button
              onClick={() => setDocModalMode('receipt')}
              className="py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-body font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-lg text-emerald-700">payments</span>
              View Deposit Receipt
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => onTabChange && onTabChange('appointments')}
              className="flex-1 py-3.5 bg-[#0f172a] text-white font-body font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">dashboard</span>
              View in My Appointments Portal
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3.5 bg-slate-100 text-slate-700 font-body font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-slate-200 transition-all"
            >
              Book Another Session
            </button>
          </div>

          {docModalMode && createdAppointment && (
            <InvoiceReceiptModal
              appointment={createdAppointment}
              initialMode={docModalMode}
              onClose={() => setDocModalMode(null)}
              onUpdateAppointmentStatus={(updated) => setCreatedAppointment(updated)}
            />
          )}
        </section>
      ) : (
        /* Multi-Step Appointment Form Grid */
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Appointment Form */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Service Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                  Select Design Service
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setSelectedService(s.id)}
                      className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
                        selectedService === s.id
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-2xl mt-0.5 ${
                        selectedService === s.id ? 'text-blue-400' : 'text-slate-600'
                      }`}>
                        {s.icon}
                      </span>
                      <div className="space-y-0.5">
                        <div className="font-display font-bold text-sm">{s.title}</div>
                        <div className={`text-[11px] font-semibold ${
                          selectedService === s.id ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {s.categoryName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Date & Time Picker */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                  Preferred Date & Time Slot
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Consultation Date
                    </label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Preferred Time Slot
                    </label>
                    <select
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-slate-900 transition-colors"
                    >
                      <option>09:00 AM - 10:00 AM EST</option>
                      <option>10:00 AM - 11:00 AM EST</option>
                      <option>01:00 PM - 02:00 PM EST</option>
                      <option>03:30 PM - 04:30 PM EST</option>
                      <option>05:00 PM - 06:00 PM EST</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Contact & Project Details */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                  Your Contact & Project Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@company.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Horizon Labs"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Project Goals / Description / References
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us briefly about your web design, app interface, dashboard, or logo requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 rounded-lg p-3 text-sm outline-none focus:border-slate-900 transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0f172a] text-white py-4 font-body font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <span className="material-symbols-outlined text-lg">event_available</span>
                Confirm & Schedule Appointment
              </button>
            </form>
          </div>

          {/* Sidebar Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0f172a] text-white p-6 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <span className="material-symbols-outlined text-3xl text-blue-400">verified</span>
                <div>
                  <h3 className="font-display font-bold text-lg">Appointment Summary</h3>
                  <p className="text-slate-400 text-xs">Direct 1-on-1 Studio Session</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Selected Service:</span>
                  <span className="font-bold text-white text-right">{activeServiceObj.title}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Category:</span>
                  <span className="font-bold text-white">{activeServiceObj.categoryName}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Zero Commitment Consultation
                </div>
                <p>You can reschedule or modify your appointment details anytime through your client portal.</p>
              </div>
            </div>

            {/* Studio Contact Info */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
              <h4 className="font-display font-bold text-sm text-slate-900">Direct Studio Line</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need immediate assistance or custom enterprise agreements? Contact our studio directly.
              </p>
              <div className="space-y-1.5 pt-1 text-xs font-semibold text-slate-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-500 text-base">language</span>
                  meridianinterface.com
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-500 text-base">call</span>
                  281-882-9198
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-500 text-base">mail</span>
                  otis@meridianinterface.com
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
