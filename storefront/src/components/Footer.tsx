import React from 'react';

interface FooterProps {
  onNavigatePolicy: (policyName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePolicy }) => {
  return (
    <footer className="bg-[#1A1A1A] text-[#F9F7F2] py-16 md:py-20 w-full mt-auto border-t border-[#1A1A1A]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-5 md:px-16 max-w-[1280px] mx-auto items-start">
        {/* Brand & Copyright Column */}
        <div className="md:col-span-6 flex flex-col justify-between h-full">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans text-[#F9F7F2]/40 block mb-2 font-medium">
              Editorial Publication & Archive
            </span>
            <div className="font-serif italic text-3xl sm:text-4xl text-[#F9F7F2] tracking-tight font-black">
              Modern Street<span className="not-italic text-[#F9F7F2]/40">.</span>
            </div>
          </div>
          <div className="font-sans text-[11px] tracking-[0.2em] text-[#F9F7F2]/40 mt-8 uppercase">
            © 2026 MODERN_STREET EDITIONS. A DEMONSTRATION STORE.
          </div>
        </div>

        {/* Legal & Help Links Column */}
        <div className="md:col-span-6 flex flex-wrap gap-x-8 gap-y-4 md:justify-end items-center pt-2 md:pt-6">
          <button
            onClick={() => onNavigatePolicy('Privacy Policy')}
            className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#F9F7F2]/60 hover:text-[#F9F7F2] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onNavigatePolicy('Terms of Service')}
            className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#F9F7F2]/60 hover:text-[#F9F7F2] transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={() => onNavigatePolicy('Shipping')}
            className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#F9F7F2]/60 hover:text-[#F9F7F2] transition-colors cursor-pointer"
          >
            Shipping
          </button>
          <button
            onClick={() => onNavigatePolicy('Returns')}
            className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#F9F7F2]/60 hover:text-[#F9F7F2] transition-colors cursor-pointer"
          >
            Returns
          </button>
        </div>
      </div>
    </footer>
  );
};
