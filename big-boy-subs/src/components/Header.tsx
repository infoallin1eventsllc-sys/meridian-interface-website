import React, { useState } from 'react';
import { StoreLocation, TabType } from '../types';
import { LOGO_URL, PROFILE_URL } from '../data/mockData';

interface HeaderProps {
  currentTab: TabType;
  selectedLocation: StoreLocation;
  allLocations: StoreLocation[];
  onSelectLocation: (loc: StoreLocation) => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  selectedLocation,
  allLocations,
  onSelectLocation,
  onOpenProfile,
  onOpenNotifications,
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 pt-safe">
      <div className="h-16 px-margin-mobile flex items-center justify-between gap-space-xs max-w-7xl mx-auto">
        {/* Brand and Current Location Selector */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={LOGO_URL}
            alt="Big Boy Subs Brand Logo"
            className="h-8 w-auto object-contain shrink-0"
          />
          <div className="relative">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex flex-col min-w-0 leading-tight text-left group hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-1">
                <span className="font-headline-sm text-[15px] font-semibold text-slate-900 tracking-tight">
                  Big Boy Subs
                </span>
                <span className="material-symbols-outlined text-[15px] text-slate-400 group-hover:text-slate-900 transition-colors">
                  expand_more
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="material-symbols-outlined text-slate-500 text-[13px] leading-none shrink-0">
                  location_on
                </span>
                <span className="font-label-sm text-[11px] text-slate-500 truncate max-w-[130px] sm:max-w-[200px]">
                  {selectedLocation.shortName}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/60 text-slate-700 font-medium text-[9px] uppercase tracking-wider">
                  Ready 15m
                </span>
              </div>
            </button>

            {/* Location Switcher Dropdown */}
            {showLocationDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLocationDropdown(false)}
                />
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-100 p-2 z-50 flex flex-col gap-1">
                  <div className="px-3 py-1.5 text-[10px] text-slate-400 uppercase tracking-widest font-semibold border-b border-slate-100">
                    Select Location
                  </div>
                  {allLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        onSelectLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      className={`flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                        selectedLocation.id === loc.id
                          ? 'bg-slate-50 text-slate-900 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-slate-500 mt-0.5">
                        store
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-slate-900 flex items-center justify-between">
                          <span className="truncate">{loc.name}</span>
                          <span className="text-[11px] font-normal text-slate-400">{loc.distance}</span>
                        </div>
                        <p className="text-[12px] text-slate-500 truncate">
                          {loc.address}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Header Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-900 ring-2 ring-white"></span>
          </button>

          <button
            aria-label="Account Profile"
            onClick={onOpenProfile}
            className="w-9 h-9 flex items-center justify-center rounded-lg ring-1 ring-slate-200 p-0.5 hover:ring-slate-400 transition-all"
          >
            <img
              src={PROFILE_URL}
              alt="Profile avatar"
              className="w-7 h-7 rounded-md object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
