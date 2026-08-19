import React, { useState } from 'react';
import { Appointment } from '../types';
import { MeridianLogo } from './MeridianLogo';

interface InvoiceReceiptModalProps {
  appointment: Appointment;
  initialMode?: 'invoice' | 'receipt';
  onClose: () => void;
  onUpdateAppointmentStatus?: (updatedApt: Appointment) => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  appointment,
  initialMode = 'invoice',
  onClose,
  onUpdateAppointmentStatus
}) => {
  const [activeTab, setActiveTab] = useState<'invoice' | 'receipt'>(initialMode);
  const [paymentState, setPaymentState] = useState<'deposit_paid' | 'paid_in_full'>(
    appointment.status === 'Confirmed' ? 'paid_in_full' : 'deposit_paid'
  );

  const cleanId = appointment.id.replace('APT-', '');
  const invoiceNum = `INV-2026-${cleanId}`;
  const receiptNum = `RCP-2026-${cleanId}`;
  const transactionNum = `TXN-884${cleanId}`;
  const issueDate = appointment.createdAt || new Date().toISOString().split('T')[0];

  // Calculate dates
  const dueDateObj = new Date(issueDate);
  dueDateObj.setDate(dueDateObj.getDate() + 14);
  const dueDate = dueDateObj.toISOString().split('T')[0];

  const depositAmount = 250.00;
  const projectEstimateAmount = 3500.00;
  const totalPaid = paymentState === 'paid_in_full' ? projectEstimateAmount : depositAmount;
  const balanceDue = paymentState === 'paid_in_full' ? 0.00 : projectEstimateAmount - depositAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCopy = () => {
    const isInvoice = activeTab === 'invoice';
    const content = `
==================================================
MERIDIAN DIGITAL DESIGN STUDIO LLC
100 Meridian Plaza, Suite 400, New York, NY 10001
Official Contact: otis@meridianinterface.com | Phone: 281-882-9198 | Web: www.meridianinterface.com
==================================================

DOCUMENT: ${isInvoice ? 'OFFICIAL SERVICE INVOICE' : 'PAYMENT RECEIPT'}
DOCUMENT NUMBER: ${isInvoice ? invoiceNum : receiptNum}
DATE: ${issueDate}
${isInvoice ? `DUE DATE: ${dueDate}` : `TRANSACTION REF: ${transactionNum}`}
STATUS: ${paymentState === 'paid_in_full' ? 'PAID IN FULL' : 'DEPOSIT RECEIVED / BALANCE DUE'}

CLIENT DETAILS:
--------------------------------------------------
Name: ${appointment.clientName}
Company: ${appointment.companyName || 'N/A'}
Email: ${appointment.clientEmail}
Phone: ${appointment.clientPhone || 'N/A'}
Appointment Ref: #${appointment.id} (${appointment.preferredDate} ${appointment.preferredTimeSlot})

ITEMIZED BREAKDOWN:
--------------------------------------------------
1. Service Consultation Deposit (${appointment.serviceTitle})
   Qty: 1 | Rate: $250.00 | Total: $250.00

2. Design Engineering & Deliverable Scope Retainer
   Qty: 1 | Rate: $3,250.00 | Total: $3,250.00

--------------------------------------------------
Subtotal: $3,500.00
Tax (0%): $0.00
Total Amount: $3,500.00
Amount Paid to Date: $${totalPaid.toFixed(2)}
Balance Due: $${balanceDue.toFixed(2)}

==================================================
Thank you for choosing Meridian Digital Design Studio.
==================================================
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${isInvoice ? invoiceNum : receiptNum}_${appointment.clientName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTogglePaymentStatus = () => {
    const nextState = paymentState === 'deposit_paid' ? 'paid_in_full' : 'deposit_paid';
    setPaymentState(nextState);
    if (onUpdateAppointmentStatus) {
      onUpdateAppointmentStatus({
        ...appointment,
        status: nextState === 'paid_in_full' ? 'Confirmed' : 'Scheduled'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 relative overflow-hidden print:shadow-none print:border-none print:max-h-none print:w-full">
        
        {/* Modal Header & Navigation Controls (Hidden in Print) */}
        <div className="p-4 md:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 text-2xl">
              receipt_long
            </span>
            <div>
              <h2 className="font-display font-bold text-lg md:text-xl text-white">
                Client Invoice & Payment Receipt
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Appointment Reference #{appointment.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="bg-slate-800 p-1 rounded-lg flex gap-1 border border-slate-700">
              <button
                onClick={() => setActiveTab('invoice')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'invoice'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span className="material-symbols-outlined text-sm">description</span>
                Invoice
              </button>
              <button
                onClick={() => setActiveTab('receipt')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'receipt'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span className="material-symbols-outlined text-sm">payments</span>
                Receipt
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
              title="Close Modal"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document View */}
        <div className="p-6 md:p-10 overflow-y-auto flex-1 space-y-8 bg-white text-slate-900 font-body">
          {/* Document Header Logo & Studio Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-2">
              <MeridianLogo size={42} subtext="INTERFACE" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Digital Web, App & Brand Studio LLC
              </p>
              <div className="text-xs text-slate-500 leading-relaxed pt-1">
                100 Meridian Plaza, Suite 400<br />
                New York, NY 10001, United States<br />
                Tel: 281-882-9198 • otis@meridianinterface.com • www.meridianinterface.com
              </div>
            </div>

            <div className="text-left sm:text-right space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[220px]">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {activeTab === 'invoice' ? 'Service Invoice' : 'Payment Receipt'}
              </div>
              <div className="font-mono font-bold text-lg text-slate-900">
                {activeTab === 'invoice' ? invoiceNum : receiptNum}
              </div>

              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                {paymentState === 'paid_in_full' ? (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    ✓ Paid in Full
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    ✓ Deposit Received ($250.00)
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-500 pt-1 space-y-0.5 font-medium">
                <div>Issue Date: <strong className="text-slate-800">{issueDate}</strong></div>
                {activeTab === 'invoice' ? (
                  <div>Due Date: <strong className="text-slate-800">{dueDate}</strong></div>
                ) : (
                  <div>Txn Ref: <strong className="text-slate-800">{transactionNum}</strong></div>
                )}
              </div>
            </div>
          </div>

          {/* Client & Appointment Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Billed To Client
              </span>
              <div className="font-bold text-sm text-slate-900">{appointment.clientName}</div>
              {appointment.companyName && (
                <div className="font-semibold text-slate-700">{appointment.companyName}</div>
              )}
              <div className="text-slate-600">{appointment.clientEmail}</div>
              {appointment.clientPhone && <div className="text-slate-600">{appointment.clientPhone}</div>}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Appointment Reference
              </span>
              <div className="font-mono font-bold text-slate-900">ID: #{appointment.id}</div>
              <div className="font-semibold text-slate-800">{appointment.serviceTitle}</div>
              <div className="text-slate-600">
                📅 {appointment.preferredDate} ({appointment.preferredTimeSlot})
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5 text-center">Qty</th>
                  <th className="p-3.5 text-right">Unit Rate</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                <tr>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">
                      Initial Consultation & Design Strategy Retainer
                    </div>
                    <div className="text-[11px] text-slate-500">
                      1-on-1 discovery session for {appointment.serviceTitle}
                    </div>
                  </td>
                  <td className="p-3.5 text-center font-mono">1</td>
                  <td className="p-3.5 text-right font-mono">$250.00</td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">$250.00</td>
                </tr>
                <tr>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">
                      Primary Project Design & UI Engineering Scope
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Custom deliverables, design systems, assets & milestone setup
                    </div>
                  </td>
                  <td className="p-3.5 text-center font-mono">1</td>
                  <td className="p-3.5 text-right font-mono">$3,250.00</td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">$3,250.00</td>
                </tr>
              </tbody>
            </table>

            {/* Total Summary Breakdown */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-900 font-bold">$3,500.00</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Sales Tax (0.0%):</span>
                <span className="font-mono text-slate-900">$0.00</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium pt-1 border-t border-slate-200">
                <span>Total Project Estimated Value:</span>
                <span className="font-mono font-bold text-slate-900">$3,500.00</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold pt-1">
                <span>Amount Paid ({paymentState === 'paid_in_full' ? 'Paid in Full' : 'Deposit Received'}):</span>
                <span className="font-mono text-emerald-700">-${totalPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-300">
                <span>Balance Due:</span>
                <span className={`font-mono ${balanceDue > 0 ? 'text-amber-700' : 'text-emerald-600'}`}>
                  ${balanceDue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method / Terms Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Payment Terms & Remittance
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Deposit of $250.00 holds your appointment slot. Remaining project balance is invoiced across standard project milestones. Electronic payments processed securely via Stripe Card / Bank ACH.
              </p>
            </div>

            <div className="space-y-2 text-left md:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-slate-700 text-[11px] font-bold">
                <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
                Verified Digital Certificate
              </div>
              <p className="text-[10px] text-slate-400">
                Meridian Digital Studio LLC • Executive Billing Desk<br />
                Document Hash: {invoiceNum}-{receiptNum}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Bar (Hidden in Print) */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePaymentStatus}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">
                {paymentState === 'paid_in_full' ? 'restart_alt' : 'task_alt'}
              </span>
              {paymentState === 'paid_in_full' ? 'Mark as Deposit Only' : 'Mark Paid in Full ($3,500)'}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadCopy}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 text-white hover:bg-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Download Text Copy
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#0f172a] text-white hover:bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
