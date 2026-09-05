import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartItemCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  cartItemCount,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Home',
      icon: 'cottage',
    },
    {
      id: 'menu' as TabType,
      label: 'Menu',
      icon: 'restaurant_menu',
    },
    {
      id: 'locations' as TabType,
      label: 'Locations',
      icon: 'explore',
    },
    {
      id: 'merch' as TabType,
      label: 'Merch',
      icon: 'checkroom',
    },
    {
      id: 'my-bag' as TabType,
      label: 'My Bag',
      icon: 'local_mall',
      badge: cartItemCount,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/95 backdrop-blur-md border-t border-slate-100">
      <div className="flex justify-around items-center h-16 px-space-xs max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-2.5 py-1 rounded-lg transition-all gap-0.5 relative ${
                isActive
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>

                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-slate-900 text-white font-medium text-[9px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] tracking-tight ${isActive ? 'font-semibold text-slate-900' : 'font-normal text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
