import React, { useState } from 'react';
import { PROFILE_URL } from '../data/mockData';
import { PastOrder, CartItem } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  punches: number;
  onPunchSub: () => void;
  onResetPunches: () => void;
  pastOrders: PastOrder[];
  onReorder: (items: CartItem[]) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  punches,
  onPunchSub,
  onResetPunches,
  pastOrders,
  onReorder,
}) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/80 p-5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header with Close */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Monterey Shore Club
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <img
            src={PROFILE_URL}
            alt="Profile Avatar"
            className="w-12 h-12 rounded-full object-cover border border-slate-200"
          />
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              Otis M.
            </h3>
            <span className="text-xs text-slate-500 truncate">
              otis@meridianinterface.com
            </span>
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-[12px] text-amber-500">stars</span>
              VIP Sub Club Member
            </span>
          </div>
        </div>

        {/* Tab Switcher: Rewards vs Order History */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'rewards'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Shore Points ({punches}/8)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Order History ({pastOrders.length})
          </button>
        </div>

        {/* Scrollable tab content */}
        <div className="overflow-y-auto max-h-[50vh] pr-0.5 space-y-3">
          {activeTab === 'rewards' ? (
            <>
              {/* Shore Points Loyalty Punch Card */}
              <div className="bg-slate-900 text-white rounded-xl p-4 shadow-xs border border-slate-800 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Big Boy Shore Points
                  </span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-medium">
                    {punches} of 8 Punched
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Buy 8 subs, receive a Giant 14" sub free at any Peninsula counter.
                </p>

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {Array.from({ length: 8 }).map((_, i) => {
                    const isPunched = i < punches;
                    const isReward = i === 7;
                    return (
                      <div
                        key={i}
                        className={`h-9 rounded-lg flex items-center justify-center font-medium text-xs transition-all ${
                          isPunched
                            ? 'bg-white text-slate-900 shadow-xs'
                            : isReward
                            ? 'bg-slate-800 text-slate-400 border border-dashed border-slate-600'
                            : 'bg-slate-800/60 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {isPunched ? (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        ) : isReward ? (
                          <span className="material-symbols-outlined text-[16px]">redeem</span>
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={onPunchSub}
                    className="text-xs text-white hover:underline flex items-center gap-1 font-medium"
                  >
                    <span className="material-symbols-outlined text-[14px]">add_circle</span>
                    Simulate Sub Stamp
                  </button>
                  {punches > 0 && (
                    <button
                      type="button"
                      onClick={onResetPunches}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Reset Stamps
                    </button>
                  )}
                </div>
              </div>

              {/* Favorite Sub Shortcut */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Counter Go-To Order
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-900">
                      The #1 Big Sur Original Italian
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Reg (9") • Rosemary Parmesan • The Works
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-900">$11.45</span>
                </div>
              </div>
            </>
          ) : (
            /* Order History Tab */
            <div className="space-y-2.5">
              {pastOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No orders placed yet.
                </div>
              ) : (
                pastOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-semibold text-slate-900">
                          Order #{ord.orderNumber}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {ord.date} • {ord.locationName}
                        </p>
                      </div>
                      <span className="font-semibold text-slate-900">
                        ${ord.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-1.5 text-[11px] text-slate-600 space-y-0.5">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="truncate">
                            {it.quantity}x {it.name}
                          </span>
                          <span className="text-slate-400">
                            ${(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onReorder(ord.items);
                        onClose();
                      }}
                      className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium flex items-center justify-center gap-1 transition-colors mt-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">replay</span>
                      <span>Reorder Items to Bag</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors text-center"
        >
          Close
        </button>
      </div>
    </div>
  );
};
