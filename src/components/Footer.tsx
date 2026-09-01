import React from 'react';
import { TabType } from '../types';
import { MeridianLogo } from './MeridianLogo';
import { BuiltBy } from './BuiltBy';

interface FooterProps {
  onTabChange: (tab: TabType) => void;
  onOpenBookModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, onOpenBookModal }) => {
  // The studio login is always reachable. An earlier version hid it whenever no
  // passcode was configured, on the theory that a gate nobody can pass should
  // not be advertised — but the effect was that the owner shipped the site and
  // silently lost the door to his own invoicing tool. The portal now explains
  // how to configure itself instead of vanishing, so being unconfigured is a
  // visible, fixable state rather than a missing feature.

  return (
    <footer className="bg-slate-900 text-white pt-12 pb-24 md:pb-12 px-4 md:px-12 border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start">
            <MeridianLogo size={36} lightText subtext="INTERFACE" />
          </div>
          <p className="text-slate-300 text-xs max-w-sm pt-1">
            Web design, mobile app interfaces, analytics &amp; CRM dashboards, and brand identity systems.
          </p>
          <div className="text-xs text-slate-300 font-semibold pt-1 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
            <a href="https://meridianinterface.com" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">language</span>
              meridianinterface.com
            </a>
            <a href="tel:+12818829198" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">call</span>
              281-882-9198
            </a>
            <a href="mailto:otis@meridianinterface.com" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">mail</span>
              otis@meridianinterface.com
            </a>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-wider text-slate-300">
          <button onClick={() => onTabChange('home')} className="hover:text-white transition-colors">
            Home
          </button>
          <button onClick={() => onTabChange('services')} className="hover:text-white transition-colors">
            Services
          </button>
          <button onClick={() => onTabChange('portfolio')} className="hover:text-white transition-colors">
            Portfolio
          </button>
          <button onClick={() => onTabChange('booking')} className="hover:text-white transition-colors">
            Book Appointment
          </button>
          <button onClick={() => onTabChange('appointments')} className="hover:text-white transition-colors">
            Client Portal
          </button>
        </nav>

        <div className="text-center md:text-right space-y-2">
          <button
            onClick={onOpenBookModal}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-500 transition-all shadow-sm"
          >
            Book Appointment
          </button>
          <div className="flex flex-col items-center md:items-end gap-1.5 pt-1">
            <span className="font-body text-xs text-slate-400">
              © 2026 Meridian Interface. All rights reserved.
            </span>
            <button
                onClick={() => onTabChange('owner_invoice')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                Studio login
              </button>
          </div>
        </div>
      </div>

      {/* The studio plate, below the working part of the footer and separated
          from it. On Meridian's own site the default "this website built by"
          line is redundant, so it carries the studio line instead. */}
      <div className="max-w-[1440px] mx-auto mt-12 pt-10 border-t border-slate-800">
        <BuiltBy kicker="A MERIDIAN INTERFACE BUILD" />
      </div>
    </footer>
  );
};
