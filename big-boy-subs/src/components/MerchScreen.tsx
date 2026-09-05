import React, { useState } from 'react';
import { MerchItem } from '../types';

interface MerchScreenProps {
  items: MerchItem[];
  onAddMerchToBag: (item: MerchItem, size: string) => void;
}

export const MerchScreen: React.FC<MerchScreenProps> = ({
  items,
  onAddMerchToBag,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    'merch-1': 'L',
    'merch-2': 'L',
    'merch-3': 'XL',
    'merch-4': 'L',
  });
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const filtered = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleSelectSize = (itemId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }));
  };

  const handleAddToCart = (item: MerchItem) => {
    const size = selectedSizes[item.id] || 'L';
    onAddMerchToBag(item, size);
    setAddedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-2xl mx-auto px-margin-mobile pt-3 gap-4">
      {/* Header Banner */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Monterey Coastal Threads
        </p>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Official Deli Merch
        </h1>
        <p className="text-xs text-slate-500">
          Heavyweight custom blanks crafted for chilly Pacific breezes and Lover’s Point sunsets
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'all', label: 'All Styles' },
          { id: 'surf', label: 'Retro Surf' },
          { id: 'minimalist', label: 'Pocket Tees' },
          { id: 'graphic', label: 'Cypress Graphic' },
          { id: 'hoodie', label: 'Hoodies' },
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

      {/* Merchandise List */}
      <div className="flex flex-col gap-5">
        {filtered.map((item) => {
          const isAdded = addedMap[item.id];
          const activeSize = selectedSizes[item.id] || 'L';

          return (
            <article
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 flex flex-col group transition-all"
            >
              {/* Product Photo */}
              <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-slate-50 flex items-center justify-center border-b border-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain p-4 group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase text-slate-700 shadow-xs">
                  {item.variationLabel}
                </div>
                <div className="absolute top-3 right-3 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                  ${item.price.toFixed(2)}
                </div>
              </div>

              {/* Details */}
              <div className="p-4 flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-semibold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {item.badges.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200/60 text-slate-600 text-[10px] font-medium"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Fabric Specifications Matrix */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      {item.specs.label1}
                    </span>
                    <span className="text-xs text-slate-900 font-semibold">
                      {item.specs.val1}
                    </span>
                  </div>
                  <div className="flex flex-col border-x border-slate-200">
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      {item.specs.label2}
                    </span>
                    <span className="text-xs text-slate-900 font-semibold">
                      {item.specs.val2}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      {item.specs.label3}
                    </span>
                    <span className="text-xs text-slate-900 font-semibold">
                      {item.specs.val3}
                    </span>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Select Size
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Relaxed fit
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {['S', 'M', 'L', 'XL', '2XL'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleSelectSize(item.id, sz)}
                        className={`h-9 rounded-md text-xs font-medium transition-all ${
                          activeSize === sz
                            ? 'bg-slate-900 text-white shadow-xs font-semibold'
                            : 'bg-slate-50 text-slate-700 border border-slate-200/80 hover:bg-slate-100'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add To Bag CTA */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  disabled={isAdded}
                  className={`w-full h-11 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isAdded ? 'check' : 'shopping_bag'}
                  </span>
                  <span>
                    {isAdded
                      ? `Added ${activeSize} to Bag`
                      : `Add ${activeSize} to Bag • $${item.price.toFixed(2)}`}
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Sustainable Note */}
      <div className="bg-slate-50 rounded-xl p-4 text-center text-xs text-slate-500 flex flex-col gap-1 border border-slate-100">
        <span className="font-semibold text-slate-900">Locally Screenprinted in Monterey County</span>
        <p className="text-[11px] leading-relaxed">
          Printed using eco-friendly water-based inks on organic ring-spun cotton.
        </p>
      </div>
    </div>
  );
};
