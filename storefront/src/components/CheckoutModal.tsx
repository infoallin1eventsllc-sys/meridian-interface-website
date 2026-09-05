import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Lock, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'processing' | 'confirmed'>('details');
  const [formData, setFormData] = useState({
    email: 'sample.customer@example.com',
    firstName: 'Sample',
    lastName: 'Customer',
    address: '1200 Main Street, Suite 400',
    city: 'Houston',
    state: 'TX',
    zip: '77002',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.0825;
  const total = subtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      setStep('confirmed');
    }, 1200);
  };

  const handleFinish = () => {
    onOrderCompleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="absolute inset-0" onClick={step !== 'processing' ? onClose : undefined} />

      <div className="relative bg-[#FFFFFF] w-full max-w-2xl z-10 border border-[#1A1A1A]/20 shadow-2xl my-8">
        {step !== 'confirmed' && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]/10 bg-[#ECE8E1]">
            <div className="flex items-center gap-2">
              <span className="font-serif italic font-normal text-lg tracking-tight text-[#1A1A1A]">
                Modern Street<span className="not-italic text-[#1A1A1A]/40">.</span>
              </span>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#1A1A1A]/60">• Checkout</span>
            </div>
            <button
              id="close-checkout-modal-btn"
              onClick={onClose}
              className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors p-1 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-16 flex flex-col items-center justify-center text-center bg-[#FFFFFF]">
            <Loader2 size={36} className="text-[#1A1A1A] animate-spin mb-6" />
            <h3 className="font-serif text-2xl font-normal text-[#1A1A1A] mb-2">
              Authorizing Payment & Manifest
            </h3>
            <p className="font-sans text-xs text-[#1A1A1A]/70 max-w-sm">
              Simulating authorisation and building the dispatch manifest…
            </p>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-8 md:p-12 text-center flex flex-col items-center bg-[#FFFFFF]">
            <div className="w-14 h-14 bg-[#ECE8E1] text-[#1A1A1A] flex items-center justify-center mb-6">
              <CheckCircle2 size={30} />
            </div>
            <span className="text-[10px] font-sans uppercase font-bold text-[#1A1A1A]/50 tracking-[0.3em] mb-1">
              Acquisition Confirmed
            </span>
            <h2 className="font-serif text-3xl font-normal text-[#1A1A1A] mb-2">
              #MS-2026-8849
            </h2>
            <p className="font-sans text-xs text-[#1A1A1A]/70 max-w-md mb-8 leading-relaxed">
              Thank you, {formData.firstName}. Your requisition has been archived and confirmation has been dispatched to{' '}
              <strong className="text-[#1A1A1A]">{formData.email}</strong>.
            </p>

            <div className="w-full bg-[#F9F7F2] border border-[#1A1A1A]/15 p-6 text-left mb-8 space-y-3 font-sans text-xs">
              <div className="flex justify-between text-[#1A1A1A]/70">
                <span>Shipping Destination</span>
                <span className="font-medium text-[#1A1A1A]">{formData.address}, {formData.city}, {formData.state}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A]/70">
                <span>Delivery Protocol</span>
                <span className="font-medium text-[#1A1A1A]">Express courier (2–3 days)</span>
              </div>
              <div className="flex justify-between border-t border-[#1A1A1A]/10 pt-3 font-bold text-[#1A1A1A]">
                <span>Total Settled</span>
                <span className="text-sm font-semibold">${total.toFixed(2)} USD</span>
              </div>
            </div>

            <button
              id="checkout-finish-btn"
              onClick={handleFinish}
              className="h-12 px-8 bg-[#1A1A1A] text-[#F9F7F2] font-sans font-semibold text-xs uppercase tracking-[0.25em] hover:bg-[#333] transition-colors cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={handleSubmit} autoComplete="off" className="p-6 md:p-8 bg-[#FFFFFF]">
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="font-serif text-base font-normal text-[#1A1A1A] mb-3">
                  1. Contact Dossier
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-sans uppercase font-bold text-[#1A1A1A]/60 mb-1 tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-10 px-3 bg-[#F9F7F2] border border-[#1A1A1A]/20 text-xs font-sans text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans uppercase font-bold text-[#1A1A1A]/60 mb-1 tracking-wider">Recipient Name</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="First"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-1/2 h-10 px-3 bg-[#F9F7F2] border border-[#1A1A1A]/20 text-xs font-sans text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Last"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-1/2 h-10 px-3 bg-[#F9F7F2] border border-[#1A1A1A]/20 text-xs font-sans text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="font-serif text-base font-normal text-[#1A1A1A] mb-3">
                  2. Dispatch Location
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F9F7F2] border border-[#1A1A1A]/20 text-xs font-sans text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="h-10 px-3 bg-[#F9F7F2] border border-[#1A1A1A]/20 text-xs font-sans text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="h-10 px-3 bg-[#F9F7F2] border border-[#1A1A1A]/20 text-xs font-sans text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Postal Code"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="h-10 px-3 bg-[#F9F7F2] border border-[#1A1A1A]/20 text-xs font-sans text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method — deliberately not a real card field. See note below. */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-base font-normal text-[#1A1A1A]">
                    3. Payment
                  </h4>
                  <span className="flex items-center gap-1 text-[10px] font-sans uppercase tracking-wider text-[#1A1A1A]/50">
                    <Lock size={11} /> Simulated
                  </span>
                </div>

                <div className="bg-[#F9F7F2] border border-[#1A1A1A]/20 p-4 space-y-3">
                  <div className="flex items-center gap-2 border border-[#1A1A1A]/15 bg-[#ECE8E1] h-10 px-3 text-[#1A1A1A]/60">
                    <CreditCard size={16} />
                    <span className="text-xs font-sans tracking-wider">4242 •••• •••• 4242</span>
                    <span className="ml-auto text-[10px] font-sans uppercase tracking-[0.15em]">Test card</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-sans text-[#1A1A1A]/60">
                    <div className="h-10 px-3 bg-[#ECE8E1] border border-[#1A1A1A]/15 flex items-center">12 / 28</div>
                    <div className="h-10 px-3 bg-[#ECE8E1] border border-[#1A1A1A]/15 flex items-center">•••</div>
                  </div>
                  <p className="text-[11px] font-sans text-[#1A1A1A]/60 leading-relaxed">
                    <strong className="text-[#1A1A1A]">This is a demonstration.</strong> No card can be
                    entered and no payment is taken. In a live store this step is handed to a payment
                    processor, so card details never touch the shop&rsquo;s own servers.
                  </p>
                </div>
              </div>

              {/* Order Breakdown */}
              <div className="bg-[#ECE8E1] p-4 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-[#1A1A1A]/70">
                  <span>Selected Pieces ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span>${subtotal.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-[#1A1A1A]/70">
                  <span>Courier Shipping</span>
                  <span>{shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)} USD`}</span>
                </div>
                <div className="flex justify-between text-[#1A1A1A]/70">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-[#1A1A1A] border-t border-[#1A1A1A]/10 pt-2 uppercase tracking-wider">
                  <span>Total Due</span>
                  <span>${total.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="submit-order-btn"
                type="submit"
                className="w-full h-12 bg-[#1A1A1A] text-[#F9F7F2] font-sans font-semibold text-xs uppercase tracking-[0.25em] hover:bg-[#333] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Place demonstration order — ${total.toFixed(2)}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
