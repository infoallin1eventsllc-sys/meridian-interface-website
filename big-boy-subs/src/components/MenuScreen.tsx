import React, { useState, useMemo } from 'react';
import { SubMenuItem, SubSize, DietaryType } from '../types';

interface MenuScreenProps {
  subs: SubMenuItem[];
  onCustomizeSub: (sub: SubMenuItem) => void;
  onQuickAddSub: (sub: SubMenuItem, size?: SubSize) => void;
  cartCount: number;
  cartTotal: number;
  onGoToBag: () => void;
  favorites: string[];
  onToggleFavorite: (subId: string) => void;
  onOpenCatering: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  subs,
  onCustomizeSub,
  onQuickAddSub,
  cartCount,
  cartTotal,
  onGoToBag,
  favorites,
  onToggleFavorite,
  onOpenCatering,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDietary, setSelectedDietary] = useState<DietaryType | 'favorites' | 'all'>('all');
  const [matrixSize, setMatrixSize] = useState<SubSize>('regular');
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const handleAdd = (sub: SubMenuItem) => {
    onQuickAddSub(sub, matrixSize);
    setAddedItemMap((prev) => ({ ...prev, [sub.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [sub.id]: false }));
    }, 1200);
  };

  const filteredSubs = useMemo(() => {
    return subs.filter((sub) => {
      const matchesSearch =
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter
      if (selectedCategory === 'cold' && sub.category !== 'cold') return false;
      if (selectedCategory === 'hot' && sub.category !== 'hot') return false;
      if (selectedCategory === 'sides' && sub.category !== 'sides') return false;
      if (selectedCategory === 'specials' && !sub.popular) return false;

      // Dietary filter
      if (selectedDietary === 'favorites') {
        if (!favorites.includes(sub.id)) return false;
      } else if (selectedDietary !== 'all') {
        if (!sub.dietary || !sub.dietary.includes(selectedDietary)) return false;
      }

      return true;
    });
  }, [subs, searchQuery, selectedCategory, selectedDietary, favorites]);

  const coldSubs = filteredSubs.filter((s) => s.category === 'cold');
  const hotSubs = filteredSubs.filter((s) => s.category === 'hot');
  const sideItems = filteredSubs.filter((s) => s.category === 'sides');

  return (
    <div className="flex flex-col w-full pb-32 max-w-2xl mx-auto">
      {/* Sticky Search & Filter Category Ribbon */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md px-margin-mobile pt-3 pb-2.5 space-y-2 border-b border-slate-100">
        {/* Search Bar */}
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subs, sides, ingredients..."
            className="w-full h-9 pl-9 pr-9 bg-slate-50 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 transition-all outline-none border border-slate-200/80"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-slate-900"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Category Filter Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'All Subs' },
            { id: 'cold', label: 'Cold Subs' },
            { id: 'hot', label: 'Hot Grilled' },
            { id: 'specials', label: 'Monterey Specials' },
            { id: 'sides', label: 'Sides & Drinks' },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white font-medium shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Dietary & Allergen Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 text-[11px]">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider shrink-0 pr-1">
            Filter:
          </span>
          {[
            { id: 'all', label: 'Any Diet' },
            { id: 'vegetarian', label: 'Vegetarian' },
            { id: 'gluten-free', label: 'Gluten-Free Opt' },
            { id: 'high-protein', label: 'High Protein' },
            { id: 'under-600-cal', label: '< 600 Cal' },
            { id: 'favorites', label: `Saved (${favorites.length})` },
          ].map((item) => {
            const isSelected = selectedDietary === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedDietary(item.id as any)}
                className={`shrink-0 px-2.5 py-0.5 rounded-md transition-all ${
                  isSelected
                    ? 'bg-slate-200 text-slate-900 font-semibold border border-slate-300'
                    : 'bg-white text-slate-600 border border-slate-200/70 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Catering Platter Banner Shortcut */}
      <section className="px-margin-mobile pt-3">
        <div className="bg-slate-900 text-white rounded-xl p-3 flex items-center justify-between shadow-xs border border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-slate-300 text-[20px] shrink-0">
              celebration
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">
                Aquarium & Beach Group Catering
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                Giant Sub Platters & Nautical Picnic Crates (Feeds 8–24)
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenCatering}
            className="px-3 py-1 rounded-md bg-white text-slate-900 hover:bg-slate-100 text-[11px] font-medium shrink-0"
          >
            Build Platter
          </button>
        </div>
      </section>

      {/* Sub Sizing Matrix Guide Banner */}
      <section className="px-margin-mobile pt-2.5 pb-1">
        <div className="bg-slate-50 p-3 rounded-xl flex flex-col gap-2 border border-slate-200/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-slate-500 text-[16px]">straighten</span>
              <span className="text-xs font-semibold text-slate-900">Sub Sizing Guide</span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              Baked Fresh Daily
            </span>
          </div>

          {/* 3-Segment Interactive Selector */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/50 rounded-lg">
            <button
              type="button"
              onClick={() => setMatrixSize('mini')}
              className={`flex flex-col items-center py-1.5 px-1 rounded-md transition-all text-center ${
                matrixSize === 'mini'
                  ? 'bg-white shadow-xs text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="text-xs">Mini (7")</span>
              <span className="text-[10px] text-slate-400">Light Snack</span>
            </button>
            <button
              type="button"
              onClick={() => setMatrixSize('regular')}
              className={`flex flex-col items-center py-1.5 px-1 rounded-md transition-all text-center ${
                matrixSize === 'regular'
                  ? 'bg-white shadow-xs text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="text-xs">Regular (9")</span>
              <span className="text-[10px] text-slate-500 font-medium">Most Popular</span>
            </button>
            <button
              type="button"
              onClick={() => setMatrixSize('giant')}
              className={`flex flex-col items-center py-1.5 px-1 rounded-md transition-all text-center ${
                matrixSize === 'giant'
                  ? 'bg-white shadow-xs text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="text-xs">Giant (14")</span>
              <span className="text-[10px] text-slate-400">Feeds Two</span>
            </button>
          </div>
        </div>
      </section>

      {/* Menu Content Stream */}
      <div className="px-margin-mobile space-y-6 pt-2">
        {filteredSubs.length === 0 && (
          <div className="bg-white rounded-xl p-8 border border-slate-200/80 text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-slate-300 text-[28px]">search_off</span>
            <p className="text-xs font-semibold text-slate-900">No items match this filter</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDietary('all');
                setSearchQuery('');
              }}
              className="text-xs text-slate-600 underline mt-1"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Category 1: Famous Cold Subs */}
        {coldSubs.length > 0 && (
          <section className="space-y-3">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded">
                  Deli Cut
                </span>
                <h2 className="text-base font-semibold text-slate-900">Famous Cold Subs</h2>
              </div>
              <p className="text-xs text-slate-500">
                Sliced ultra-fresh to order • Monterey East Coast tradition
              </p>
            </div>

            {coldSubs.map((sub) => {
              const isAdded = addedItemMap[sub.id];
              const isFav = favorites.includes(sub.id);
              const displayPrice =
                matrixSize === 'giant'
                  ? sub.giantPrice
                  : matrixSize === 'mini'
                  ? sub.miniPrice
                  : sub.regularPrice;

              if (sub.isHero) {
                return (
                  <article
                    key={sub.id}
                    className="bg-white rounded-xl overflow-hidden shadow-xs border border-slate-200/80 flex flex-col group transition-all"
                  >
                    <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-slate-200 text-slate-900 text-[10px] font-medium tracking-wide shadow-xs">
                          Customer Favorite
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-slate-200 text-slate-700 text-[10px] font-medium tracking-wide shadow-xs">
                          The Works Included
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(sub.id);
                        }}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition-colors shadow-xs ${
                          isFav ? 'bg-rose-50 text-rose-600' : 'bg-white/90 text-slate-400 hover:text-slate-900'
                        }`}
                        aria-label="Toggle favorite"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isFav ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>

                      <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                        {sub.calRange}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{sub.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between gap-2 mt-1 border-t border-slate-100">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-semibold text-slate-900">
                              ${displayPrice.toFixed(2)}
                            </span>
                            <span className="text-xs text-slate-400 capitalize">
                              {matrixSize} ({matrixSize === 'giant' ? '14"' : matrixSize === 'mini' ? '7"' : '9"'})
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Giant (14") ${sub.giantPrice.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onCustomizeSub(sub)}
                            className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium flex items-center gap-1 hover:bg-slate-50 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px] text-slate-400">tune</span>
                            <span>Customize</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdd(sub)}
                            className={`px-3.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                            }`}
                          >
                            <span>{isAdded ? 'Added' : 'Add to Bag'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }

              return (
                <article
                  key={sub.id}
                  className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col gap-2 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">
                          {sub.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(sub.id)}
                          className={`text-xs ${isFav ? 'text-rose-500' : 'text-slate-300 hover:text-slate-500'}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isFav ? 'favorite' : 'favorite_border'}
                          </span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>
                    {sub.image && (
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-100"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 mt-1">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-semibold text-slate-900">
                          ${displayPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 capitalize">
                          {matrixSize}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Giant ${sub.giantPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onCustomizeSub(sub)}
                        className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium hover:bg-slate-50 transition-colors"
                      >
                        Customize
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdd(sub)}
                        className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                        }`}
                      >
                        <span>{isAdded ? 'Added' : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* Category 2: Hot Grilled Subs */}
        {hotSubs.length > 0 && (
          <section className="space-y-3">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded">
                  Flat-Top Grilled
                </span>
                <h2 className="text-base font-semibold text-slate-900">Hot Grilled Subs</h2>
              </div>
              <p className="text-xs text-slate-500">
                Sizzling off the flat top grill to piping perfection
              </p>
            </div>

            {hotSubs.map((sub) => {
              const isAdded = addedItemMap[sub.id];
              const isFav = favorites.includes(sub.id);
              const displayPrice =
                matrixSize === 'giant'
                  ? sub.giantPrice
                  : matrixSize === 'mini'
                  ? sub.miniPrice
                  : sub.regularPrice;

              return (
                <article
                  key={sub.id}
                  className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col gap-2 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">
                          {sub.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(sub.id)}
                          className={`text-xs ${isFav ? 'text-rose-500' : 'text-slate-300 hover:text-slate-500'}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isFav ? 'favorite' : 'favorite_border'}
                          </span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>
                    {sub.image && (
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-100"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 mt-1">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-semibold text-slate-900">
                          ${displayPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 capitalize">
                          {matrixSize}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Giant ${sub.giantPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onCustomizeSub(sub)}
                        className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium hover:bg-slate-50 transition-colors"
                      >
                        Customize
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdd(sub)}
                        className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                        }`}
                      >
                        <span>{isAdded ? 'Added' : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* Category 3: Deli Sides & Cold Drinks */}
        {sideItems.length > 0 && (
          <section className="space-y-3">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded">
                  Snacks & Refreshment
                </span>
                <h2 className="text-base font-semibold text-slate-900">Deli Sides & Drinks</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {sideItems.map((side) => {
                const isAdded = addedItemMap[side.id];
                const icon =
                  side.id === 'side-1'
                    ? 'bakery_dining'
                    : side.id === 'side-2'
                    ? 'cookie'
                    : 'local_drink';

                return (
                  <div
                    key={side.id}
                    className="bg-white p-3 rounded-xl flex items-center justify-between border border-slate-200/70 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600 shrink-0">
                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-900">{side.name}</span>
                        <span className="text-[11px] text-slate-500">
                          {side.description}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(side)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 shrink-0 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                      }`}
                    >
                      <span>${side.regularPrice.toFixed(2)}</span>
                      <span className="material-symbols-outlined text-[14px]">
                        {isAdded ? 'check' : 'add'}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Bottom Preview Bar */}
      {cartCount > 0 && (
        <aside className="fixed bottom-16 inset-x-0 z-40 px-margin-mobile pb-2 pt-1 pointer-events-none max-w-2xl mx-auto">
          <div className="pointer-events-auto bg-slate-900 text-white rounded-xl p-3 shadow-lg flex items-center justify-between border border-slate-800">
            <div className="flex items-center gap-3 pl-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">
                    {cartCount} item{cartCount > 1 ? 's' : ''}
                  </span>
                  <span className="text-xs font-medium text-slate-300">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">
                  Ready in ~15 mins at Alvarado Flagship
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToBag}
              className="px-4 py-2 rounded-lg bg-white text-slate-900 hover:bg-slate-100 text-xs font-medium flex items-center gap-1 shrink-0 active:scale-95 transition-transform"
            >
              <span>Review Bag</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};
