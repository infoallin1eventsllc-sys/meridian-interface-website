import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

interface PolicyModalProps {
  policyName: string | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policyName, onClose }) => {
  if (!policyName) return null;

  const getContent = () => {
    switch (policyName) {
      case 'Shipping':
        return {
          icon: <Truck size={24} className="text-[#0448ff]" />,
          title: 'Shipping',
          content: [
            'Complimentary standard express shipping on all domestic orders exceeding $150.',
            'Orders placed before the daily cut-off are packed and dispatched the same working day.',
            'Tracking is issued at dispatch and updates as the parcel moves.',
            'Signature confirmation is available at checkout on higher-value orders.',
          ],
        };
      case 'Returns':
        return {
          icon: <RotateCcw size={24} className="text-[#0448ff]" />,
          title: '30-Day Returns & Exchanges',
          content: [
            'Garments may be returned within 30 days of arrival in unwashed, unworn condition with original tags attached.',
            'Instant digital return label generation with pre-paid postage.',
            'Direct exchanges for alternate sizes or colors are processed immediately with priority dispatch.',
            'Refunds are credited to the original payment method within 3–5 business days.',
          ],
        };
      case 'Privacy Policy':
        return {
          icon: <ShieldCheck size={24} className="text-[#0448ff]" />,
          title: 'Privacy & Data Protection',
          content: [
            'Card details are handled by a payment processor and are never stored on this store\u2019s own servers.',
            'We never sell, rent, or distribute customer demographic data to third-party ad brokers.',
            'Your shopping history is retained exclusively to provide order status updates and customized capsule drop notices.',
            'You may request complete erasure of your profile and data at any time.',
          ],
        };
      default:
        return {
          icon: <FileText size={24} className="text-[#0448ff]" />,
          title: 'Terms of Service',
          content: [
            'All MODERN_STREET products are released in limited capsule volumes subject to immediate allocation.',
            'Prices and currency exchange evaluations are strictly quoted at checkout.',
            'All intellectual property, typography and photography remain the rights of MODERN_STREET.',
          ],
        };
    }
  };

  const info = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-[#FFFFFF] w-full max-w-lg z-10 border border-[#1A1A1A]/20 shadow-2xl p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A] p-1 cursor-pointer transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#ECE8E1] text-[#1A1A1A] flex items-center justify-center">
            {info.icon}
          </div>
          <div>
            <span className="text-[10px] font-sans uppercase font-bold text-[#1A1A1A]/40 tracking-[0.25em] block mb-0.5">
              Protocol Documentation
            </span>
            <h3 className="font-serif text-xl font-normal text-[#1A1A1A]">
              {info.title}
            </h3>
          </div>
        </div>

        <div className="space-y-3 font-sans text-xs text-[#1A1A1A]/75 leading-relaxed mb-8">
          {info.content.map((p, idx) => (
            <p key={idx} className="flex items-start gap-2.5">
              <span className="text-[#1A1A1A] font-serif text-sm">•</span>
              <span>{p}</span>
            </p>
          ))}
        </div>

        <p className="text-[11px] font-sans text-[#1A1A1A]/50 leading-relaxed border-t border-[#1A1A1A]/10 pt-4 mb-4">
          Placeholder policy text for a demonstration store. A live shop replaces this
          with its own terms, reviewed by its own advisers.
        </p>

        <div className="text-right border-t border-[#1A1A1A]/10 pt-4">
          <button
            onClick={onClose}
            className="h-9 px-6 bg-[#1A1A1A] text-[#F9F7F2] text-[10px] font-sans font-semibold uppercase tracking-[0.2em] hover:bg-[#333] transition-colors cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
