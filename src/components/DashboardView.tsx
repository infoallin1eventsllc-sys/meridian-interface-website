import React, { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { INITIAL_APPOINTMENTS } from '../data/mockData';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';

interface DashboardViewProps {
  onOpenBookModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenBookModal }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [docTarget, setDocTarget] = useState<{ appointment: Appointment; mode: 'invoice' | 'receipt' } | null>(null);

  useEffect(() => {
    // Load from localStorage combined with mock initial data
    try {
      const stored = localStorage.getItem('meridian_appointments');
      if (stored) {
        const parsed: Appointment[] = JSON.parse(stored);
        // combine avoiding duplicates
        const combined = [...parsed];
        INITIAL_APPOINTMENTS.forEach(init => {
          if (!combined.some(a => a.id === init.id)) {
            combined.push(init);
          }
        });
        setAppointments(combined);
      } else {
        setAppointments(INITIAL_APPOINTMENTS);
      }
    } catch (err) {
      setAppointments(INITIAL_APPOINTMENTS);
    }
  }, []);

  const handleCancelAppointment = (id: string) => {
    if (confirm(`Request a change to appointment #${id}? We'll mark it "In Review" and follow up with you.`)) {
      const updated = appointments.map(a => a.id === id ? { ...a, status: 'In Review' as const } : a);
      setAppointments(updated);
      try {
        localStorage.setItem('meridian_appointments', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filtered = appointments.filter(apt => {
    const matchesSearch = apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || apt.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="pt-24 pb-24 md:pb-16 px-4 md:px-12 max-w-[1440px] mx-auto animate-fadeIn bg-slate-50 min-h-screen">
      {/* Top Banner */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-800 rounded-full text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">assignment_ind</span>
            Client Appointment Portal
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-slate-900 font-black tracking-tight">
            My Appointments & Consultations
          </h1>
          <p className="font-body text-sm text-slate-600">
            Track, review, or modify your web design, app interface, and logo branding appointments.
          </p>
        </div>

        <button
          onClick={onOpenBookModal}
          className="px-6 py-3 bg-[#0f172a] text-white font-body font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-all shadow-md flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          Book New Appointment
        </button>
      </section>

      {/* Analytics Counter Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Booked</div>
          <div className="font-display font-black text-2xl text-slate-900">{appointments.length}</div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirmed</div>
          <div className="font-display font-black text-2xl text-slate-900">
            {appointments.filter(a => a.status === 'Confirmed').length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Scheduled</div>
          <div className="font-display font-black text-2xl text-blue-600">
            {appointments.filter(a => a.status === 'Scheduled').length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">In Review</div>
          <div className="font-display font-black text-2xl text-slate-900">
            {appointments.filter(a => a.status === 'In Review').length}
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search APT reference or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 rounded-lg outline-none focus:border-slate-900 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Confirmed', 'Scheduled', 'In Review'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                selectedStatus === st
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </section>

      {/* Appointments List */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-slate-400">event_busy</span>
            <h3 className="font-display font-bold text-lg text-slate-800">No Appointments Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't have any appointments matching your search criteria. Book a new design appointment to get started.
            </p>
            <button
              onClick={onOpenBookModal}
              className="mt-2 px-4 py-2 bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider rounded-lg"
            >
              Book Appointment Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Ref ID</th>
                  <th className="p-4">Client / Company</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{apt.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{apt.clientName}</div>
                      <div className="text-[11px] text-slate-500">{apt.clientEmail}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{apt.serviceTitle}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{apt.preferredDate}</div>
                      <div className="text-[11px] text-slate-500">{apt.preferredTimeSlot}</div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{apt.budgetRange}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'Scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => setDocTarget({ appointment: apt, mode: 'invoice' })}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="View invoice"
                        aria-label={`View invoice for ${apt.clientName}`}
                      >
                        <span className="material-symbols-outlined text-lg">description</span>
                      </button>
                      <button
                        onClick={() => setDocTarget({ appointment: apt, mode: 'receipt' })}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="View receipt"
                        aria-label={`View receipt for ${apt.clientName}`}
                      >
                        <span className="material-symbols-outlined text-lg">payments</span>
                      </button>
                      <button
                        onClick={() => setActiveAppointment(apt)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="View details"
                        aria-label={`View details for ${apt.clientName}`}
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="p-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                        title="Request a change"
                        aria-label={`Request a change to ${apt.clientName}'s appointment`}
                      >
                        <span className="material-symbols-outlined text-lg">edit_calendar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Appointment Detail Modal */}
      {activeAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 relative border border-slate-200 shadow-2xl">
            <button
              onClick={() => setActiveAppointment(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded">
                  #{activeAppointment.id}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  {activeAppointment.status}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-slate-900">
                {activeAppointment.serviceTitle}
              </h3>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Client Name:</span>
                  <span className="font-bold text-slate-900">{activeAppointment.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Email Address:</span>
                  <span className="font-bold text-slate-900">{activeAppointment.clientEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="font-bold text-slate-900">{activeAppointment.clientPhone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Date & Time:</span>
                  <span className="font-bold text-slate-900">{activeAppointment.preferredDate} ({activeAppointment.preferredTimeSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Budget Scope:</span>
                  <span className="font-bold text-slate-900">{activeAppointment.budgetRange}</span>
                </div>
              </div>

              {activeAppointment.notes && (
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Project Notes:</div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed italic">
                    "{activeAppointment.notes}"
                  </div>
                </div>
              )}

              {/* Document Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setDocTarget({ appointment: activeAppointment, mode: 'invoice' })}
                  className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base text-blue-700">description</span>
                  Service Invoice
                </button>
                <button
                  onClick={() => setDocTarget({ appointment: activeAppointment, mode: 'receipt' })}
                  className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base text-emerald-700">payments</span>
                  Payment Receipt
                </button>
              </div>

              <div className="pt-3 flex gap-3 border-t border-slate-100">
                <button
                  onClick={() => setDocTarget({ appointment: activeAppointment, mode: 'invoice' })}
                  className="flex-1 py-3 bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">receipt_long</span>
                  Generate Official Pass & Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice / Receipt Document Modal */}
      {docTarget && (
        <InvoiceReceiptModal
          appointment={docTarget.appointment}
          initialMode={docTarget.mode}
          onClose={() => setDocTarget(null)}
          onUpdateAppointmentStatus={(updated) => {
            const newList = appointments.map(a => a.id === updated.id ? updated : a);
            setAppointments(newList);
            if (activeAppointment && activeAppointment.id === updated.id) {
              setActiveAppointment(updated);
            }
            try {
              localStorage.setItem('meridian_appointments', JSON.stringify(newList));
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}
    </main>
  );
};
