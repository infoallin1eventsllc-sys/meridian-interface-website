import React from 'react';
import { TabType } from '../types';
import { MeridianLogo } from './MeridianLogo';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenBookModal: () => void;
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenBookModal,
  onOpenSearch,
  onOpenMobileMenu
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#f8fafc]/90 backdrop-blur-md border-b border-slate-200/80 h-16 transition-all shadow-xs">
      <div className="flex items-center justify-between px-4 md:px-8 h-full w-full max-w-[1440px] mx-auto">
        {/* Left Branding & Mobile Menu */}
        <div className="flex items-center gap-3 md:gap-8">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden text-[#0f172a] hover:opacity-70 transition-opacity p-1"
            aria-label="Open Navigation Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <button
            onClick={() => onTabChange('home')}
            className="group text-left py-1 hover:opacity-90 transition-opacity"
            aria-label="Meridian Interface Home"
          >
            <MeridianLogo size={34} subtext="INTERFACE" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 ml-4">
            <button
              onClick={() => onTabChange('home')}
              className={`font-body text-xs font-bold uppercase tracking-widest py-1 transition-colors relative ${
                currentTab === 'home'
                  ? 'text-[#0f172a] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0f172a]'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onTabChange('services')}
              className={`font-body text-xs font-bold uppercase tracking-widest py-1 transition-colors relative ${
                currentTab === 'services'
                  ? 'text-[#0f172a] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0f172a]'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => onTabChange('portfolio')}
              className={`font-body text-xs font-bold uppercase tracking-widest py-1 transition-colors relative ${
                currentTab === 'portfolio'
                  ? 'text-[#0f172a] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0f172a]'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => onTabChange('appointments')}
              className={`font-body text-xs font-bold uppercase tracking-widest py-1 transition-colors relative ${
                currentTab === 'appointments'
                  ? 'text-[#0f172a] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0f172a]'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              My Appointments
            </button>
          </nav>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#0f172a] hover:bg-slate-200/60 rounded-full transition-colors active:scale-95"
            aria-label="Search Studio"
            title="Search Web, App & Logo Services"
          >
            <span className="material-symbols-outlined text-xl">search</span>
          </button>

          <button
            onClick={onOpenBookModal}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            Book Appointment
          </button>
        </div>
      </div>
    </header>
  );
};
