import { IMG } from '../assets/images';
import React, { useState } from 'react';
import { SubMenuItem } from '../types';

interface HomeScreenProps {
  onOpenMenu: () => void;
  onOpenLocations: () => void;
  onCustomizeSub: (sub: SubMenuItem) => void;
  onQuickAddSub: (sub: SubMenuItem) => void;
  onOpenProfile: () => void;
  punches: number;
  subs: SubMenuItem[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenMenu,
  onOpenLocations,
  onCustomizeSub,
  onQuickAddSub,
  onOpenProfile,
  punches,
  subs,
}) => {
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const handleQuickAdd = (sub: SubMenuItem) => {
    onQuickAddSub(sub);
    setAddedNoticeId(sub.id);
    setTimeout(() => setAddedNoticeId(null), 1200);
  };

  const boardwalkFavorites = subs.filter((s) => s.category !== 'sides').slice(0, 4);

  return (
    <div className="flex flex-col w-full pb-20 max-w-2xl mx-auto">
      {/* Top Ambient Status Bar */}
      <div className="px-margin-mobile py-2.5 bg-slate-50 flex items-center justify-between border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse shrink-0" />
          <span className="text-slate-600 font-medium truncate">
            Bakery Oven #2: Fresh Rosemary Baguettes ready in 6m
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold shrink-0 bg-white border border-slate-200/80 px-2 py-0.5 rounded-full ml-2">
          Alvarado Flagship
        </span>
      </div>

      {/* Hero Section: Clean Minimalism */}
      <section className="px-margin-mobile pt-4 pb-3">
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col">
          {/* Visual Header */}
          <div className="relative w-full h-56 overflow-hidden bg-slate-100">
            <img
              src={IMG.italian}
              alt="Giant California Coastal Big Boy Sub sliced fresh on butcher paper"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

            {/* Clean Minimalist Badges */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 border border-slate-200/80 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
              Sliced Fresh To Order
            </div>

            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide shadow-xs">
              Oil & Red Wine Vinegar Splash
            </div>
          </div>

          {/* Hero Content */}
          <div className="p-5 flex flex-col gap-3 bg-white">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
                Since 1978 • Monterey, CA
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 leading-snug">
              Sliced fresh <span className="font-semibold italic">before your eyes</span>.
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              The Monterey Way — Jersey-style juice splash, crisp shredded iceberg, ripe Roma tomatoes, and artisan bread baked fresh every hour.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenMenu}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 text-sm font-medium py-3 px-5 rounded-lg shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Order Now — Pickup in 15 Min</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fulfillment Selector & Kitchen Status */}
      <section className="px-margin-mobile py-2">
        <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
            <button
              type="button"
              onClick={() => setFulfillment('pickup')}
              className={`py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                fulfillment === 'pickup'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span>Pickup Alvarado St</span>
            </button>
            <button
              type="button"
              onClick={() => setFulfillment('delivery')}
              className={`py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                fulfillment === 'delivery'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">moped</span>
              <span>Beach Delivery</span>
            </button>
          </div>

          <div className="px-1 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-slate-400">timer</span>
              <span>Kitchen Wait Time:</span>
              <span className="font-semibold text-slate-900">12–18 min</span>
            </div>
            <button
              type="button"
              onClick={onOpenLocations}
              className="text-[11px] text-slate-600 hover:text-slate-900 font-medium underline flex items-center gap-0.5"
            >
              <span>Change</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Shore Points Loyalty Card: Clean Dark Minimalist Accent */}
      <section className="px-margin-mobile py-2">
        <div
          onClick={onOpenProfile}
          className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm cursor-pointer hover:bg-slate-800 transition-colors flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-300 text-[18px]">
                verified
              </span>
              <span className="text-sm font-semibold tracking-tight text-white">
                Big Boy Shore Points
              </span>
            </div>
            <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
              {punches} of 8 Punched
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Buy 8 Subs, receive 1 Giant 14" Sub on the house at any Peninsula counter.
          </p>

          <div className="pt-1 flex items-center gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => {
              const isPunched = i < punches;
              const isLast = i === 7;
              return (
                <div
                  key={i}
                  className={`h-7 flex-1 rounded flex items-center justify-center text-xs transition-all ${
                    isPunched
                      ? 'bg-white text-slate-900 font-bold'
                      : isLast
                      ? 'bg-slate-800 text-slate-400 border border-dashed border-slate-600'
                      : 'bg-slate-800 text-slate-500 border border-slate-700/60'
                  }`}
                >
                  {isPunched ? (
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  ) : isLast ? (
                    <span className="material-symbols-outlined text-[14px]">redeem</span>
                  ) : (
                    <span className="text-[10px] font-medium">{i + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Header: Signature Subs */}
      <section className="px-margin-mobile pt-5 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Counter Classics
          </p>
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
            Boardwalk Favorites
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenMenu}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <span>View All ({subs.length})</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </section>

      {/* Signature Subs Feed */}
      <section className="px-margin-mobile flex flex-col gap-3 pb-4">
        {boardwalkFavorites.map((sub) => {
          const isJustAdded = addedNoticeId === sub.id;
          return (
            <article
              key={sub.id}
              className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col gap-2.5"
            >
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100 relative">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {sub.itemNumber && (
                    <span className="absolute top-1 left-1 bg-slate-900 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                      {sub.itemNumber}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {sub.name}
                      </h3>
                      <span className="text-sm font-semibold text-slate-900 shrink-0">
                        ${sub.regularPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded font-medium">
                      The Works Included
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">{sub.calRange}</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onCustomizeSub(sub)}
                  className="text-slate-600 hover:text-slate-900 text-xs font-medium flex items-center gap-1.5 py-1 px-2 rounded hover:bg-slate-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-slate-400">tune</span>
                  <span>Customize</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(sub)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isJustAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  {isJustAdded ? 'Added' : 'Add to Bag'}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Delicatessen Creed: Minimal 3-Column Grid */}
      <section className="px-margin-mobile py-2">
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Our Delicatessen Creed
              </p>
              <h3 className="text-base font-semibold text-slate-900">Done The Big Boy Way</h3>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[24px]">verified</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200/70 flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-900">Baked Daily</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Crusty outside, tender inside.
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/70 flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-900">Sliced Fresh</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Never pre-cut, zero sweat.
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/70 flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-900">"The Juice"</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Aged vinegar & pure EVOO splash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seaside Patio Feature */}
      <section className="px-margin-mobile pt-3 pb-6">
        <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-white">
          <div className="w-full h-48 relative bg-slate-100">
            <img
              src={IMG.patio}
              alt="Seaside patio in Monterey"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          </div>
          <div className="p-4 text-white absolute inset-x-0 bottom-0 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-slate-300 font-medium">
              Outdoor Seating
            </span>
            <h3 className="text-lg font-semibold text-white">
              Dine On Our Seaside Patio
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2">
              Pick up your order and enjoy Monterey Bay ocean air with complimentary deli pickle spears.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenLocations}
                className="bg-white text-slate-900 px-3.5 py-1.5 rounded-md text-xs font-medium hover:bg-slate-100 transition-colors"
              >
                Directions & Hours
              </button>
              <span className="text-slate-300 text-[11px]">Open daily 10am – 9pm</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
