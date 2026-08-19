import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 md:hidden shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
            currentTab === 'home' ? 'text-[#0f172a]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>

        <button
          onClick={() => onTabChange('services')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
            currentTab === 'services' ? 'text-[#0f172a]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="material-symbols-outlined text-xl">grid_view</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-wider">Services</span>
        </button>

        <button
          onClick={() => onTabChange('booking')}
          className="flex flex-col items-center gap-0.5 px-3 py-1 bg-[#0f172a] text-white rounded-full transition-transform active:scale-95 shadow-md -mt-4"
        >
          <span className="material-symbols-outlined text-xl">add_card</span>
          <span className="font-body text-[9px] font-bold uppercase tracking-wider">Book</span>
        </button>

        <button
          onClick={() => onTabChange('portfolio')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
            currentTab === 'portfolio' ? 'text-[#0f172a]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="material-symbols-outlined text-xl">palette</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-wider">Work</span>
        </button>

        <button
          onClick={() => onTabChange('appointments')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
            currentTab === 'appointments' ? 'text-[#0f172a]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="material-symbols-outlined text-xl">event_available</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-wider">Portal</span>
        </button>
      </div>
    </nav>
  );
};
