import { IMG } from '../assets/images';
import React, { useState } from 'react';
import { CATERING_PACKAGES } from '../data/mockData';
import { CateringPackage, CartItem } from '../types';

interface CateringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCateringToBag: (item: CartItem) => void;
}

export const CateringModal: React.FC<CateringModalProps> = ({
  isOpen,
  onClose,
  onAddCateringToBag,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<CateringPackage>(CATERING_PACKAGES[0]);
  const [headcount, setHeadcount] = useState<number>(12);
  const [selectedSubs, setSelectedSubs] = useState<string[]>([
    'The #1 Big Sur Original Italian',
    'The #3 Monterey Club Sub',
    'The #14 Carmel Seaside Veggie',
  ]);
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen) return null;

  const availableSubs = [
    'The #1 Big Sur Original Italian',
    'The #3 Monterey Club Sub',
    'Cannery Row Roast Beef',
    'The #14 Carmel Seaside Veggie',
    'The #8 Tuna Fish Delight',
  ];

  const handleToggleSub = (subName: string) => {
    if (selectedSubs.includes(subName)) {
      if (selectedSubs.length > 1) {
        setSelectedSubs(selectedSubs.filter((s) => s !== subName));
      }
    } else {
      setSelectedSubs([...selectedSubs, subName]);
    }
  };

  const calculatedPrice =
    selectedPkg.id === 'cat-box-lunch'
      ? selectedPkg.price * Math.max(8, headcount)
      : selectedPkg.price;

  const handleConfirmCatering = () => {
    const item: CartItem = {
      id: `catering-${Date.now()}`,
      type: 'catering',
      productId: selectedPkg.id,
      name: `${selectedPkg.title} (${headcount} Guests)`,
      image:
        IMG.platter,
      price: calculatedPrice,
      quantity: 1,
      cateringDetails: {
        headcount,
        subChoices: selectedSubs,
        packageType: selectedPkg.title,
      },
    };

    setIsAdded(true);
    setTimeout(() => {
      onAddCateringToBag(item);
      setIsAdded(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[90vh]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-700 text-[20px]">
              celebration
            </span>
            <span className="text-xs font-semibold text-slate-900">
              Monterey Catering & Picnic Builder
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* Intro note */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-slate-600 leading-relaxed">
              Planning an event at Monterey Bay Aquarium, Lovers Point, or a corporate seaside retreat? We prepare our giant sub platters and nautical crates with fresh baked bread daily.
            </p>
          </div>

          {/* Package Selection */}
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-900">1. Select Catering Package</span>
            <div className="space-y-2">
              {CATERING_PACKAGES.map((pkg) => {
                const isSelected = selectedPkg.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 shadow-xs'
                        : 'border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{pkg.title}</span>
                          {pkg.popular && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-900 text-white">
                              Popular
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">{pkg.servesText}</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        ${pkg.price.toFixed(2)}
                        {pkg.id === 'cat-box-lunch' && <span className="text-[10px] text-slate-400">/box</span>}
                      </span>
                    </div>

                    <p className="text-slate-500 mt-1 leading-relaxed text-[11px]">
                      {pkg.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {pkg.includes.map((inc) => (
                        <span
                          key={inc}
                          className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 text-[10px]"
                        >
                          {inc}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Headcount Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">2. Estimated Guests</span>
              <span className="text-slate-500">{headcount} Guests</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[8, 12, 16, 24].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setHeadcount(cnt)}
                  className={`py-1.5 rounded-lg border text-center transition-all ${
                    headcount === cnt
                      ? 'border-slate-900 bg-slate-900 text-white font-medium'
                      : 'border-slate-200/80 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {cnt} Guests
                </button>
              ))}
            </div>
          </div>

          {/* Sub Assortment Selection */}
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-900">
              3. Choose Platter Sub Varieties
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {availableSubs.map((subName) => {
                const isChecked = selectedSubs.includes(subName);
                return (
                  <button
                    key={subName}
                    type="button"
                    onClick={() => handleToggleSub(subName)}
                    className={`p-2 rounded-lg border flex items-center justify-between transition-all ${
                      isChecked
                        ? 'border-slate-900 bg-slate-50 text-slate-900 font-medium'
                        : 'border-slate-200/80 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{subName}</span>
                    <span className="material-symbols-outlined text-[16px]">
                      {isChecked ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
            <span className="text-sm font-semibold text-slate-900">
              ${calculatedPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirmCatering}
            disabled={isAdded}
            className={`flex-1 h-10 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAdded ? 'check' : 'add_shopping_cart'}
            </span>
            <span>{isAdded ? 'Added to Bag' : 'Add Platter to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
