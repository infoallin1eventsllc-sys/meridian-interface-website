import React, { useState } from 'react';
import { SubMenuItem, SubSize, CartCustomization } from '../types';

interface SubCustomizerModalProps {
  sub: SubMenuItem | null;
  onClose: () => void;
  onAddToCart: (
    sub: SubMenuItem,
    customization: CartCustomization,
    finalPrice: number
  ) => void;
}

export const SubCustomizerModal: React.FC<SubCustomizerModalProps> = ({
  sub,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<SubSize>('regular');
  const [selectedBread, setSelectedBread] = useState('Italian Crusty Baguette');
  const [selectedCheese, setSelectedCheese] = useState('Aged Provolone');
  const [isTheWorks, setIsTheWorks] = useState(true);

  // Individual toppings (pre-populated by The Works)
  const defaultTheWorksToppings = [
    'Shaved Sweet Onions',
    'Crisp Iceberg Lettuce',
    'Ripe Roma Tomatoes',
    'Red Wine Vinegar & Olive Oil ("The Juice")',
    'Oregano & Deli Spices',
  ];

  const [selectedToppings, setSelectedToppings] = useState<string[]>(
    defaultTheWorksToppings
  );

  const [extraCondiments, setExtraCondiments] = useState<string[]>([]);
  const [cutPreference, setCutPreference] = useState('Cut in Half');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  if (!sub) return null;

  // Price Calculation
  const basePrice =
    selectedSize === 'giant'
      ? sub.giantPrice
      : selectedSize === 'mini'
      ? sub.miniPrice
      : sub.regularPrice;

  let extrasTotal = 0;
  if (selectedBread === 'Gluten-Free Roll') extrasTotal += 1.5;
  if (extraCondiments.includes('Applewood Smoked Bacon')) extrasTotal += 2.0;
  if (extraCondiments.includes('Double Sliced Meat')) extrasTotal += 2.75;
  if (extraCondiments.includes('Extra Provolone / Cheese')) extrasTotal += 1.25;

  const finalPrice = basePrice + extrasTotal;

  // Toggle "The Works"
  const handleToggleTheWorks = () => {
    if (isTheWorks) {
      setIsTheWorks(false);
      setSelectedToppings([]);
    } else {
      setIsTheWorks(true);
      setSelectedToppings(defaultTheWorksToppings);
    }
  };

  const handleToggleTopping = (topping: string) => {
    if (selectedToppings.includes(topping)) {
      const updated = selectedToppings.filter((t) => t !== topping);
      setSelectedToppings(updated);
      if (updated.length < defaultTheWorksToppings.length) {
        setIsTheWorks(false);
      }
    } else {
      const updated = [...selectedToppings, topping];
      setSelectedToppings(updated);
      if (defaultTheWorksToppings.every((t) => updated.includes(t))) {
        setIsTheWorks(true);
      }
    }
  };

  const handleToggleExtra = (extra: string) => {
    if (extraCondiments.includes(extra)) {
      setExtraCondiments(extraCondiments.filter((e) => e !== extra));
    } else {
      setExtraCondiments([...extraCondiments, extra]);
    }
  };

  const handleConfirmAdd = () => {
    setIsAdded(true);
    setTimeout(() => {
      onAddToCart(
        sub,
        {
          size: selectedSize,
          bread: selectedBread,
          cheese: selectedCheese,
          isTheWorks,
          selectedToppings,
          extraCondiments,
          cutPreference,
          specialInstructions,
        },
        finalPrice
      );
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200/80">
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {sub.itemNumber && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {sub.itemNumber}
              </span>
            )}
            <h2 className="text-sm font-semibold text-slate-900 truncate">
              {sub.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shrink-0"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Sub Preview Card */}
          <div className="relative w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-200/70 flex flex-col">
            <div className="relative w-full h-44 overflow-hidden bg-slate-100">
              <img
                src={sub.image}
                alt={sub.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                <span className="text-white text-base font-semibold">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="bg-white/90 backdrop-blur-xs text-slate-900 px-2 py-0.5 rounded text-[10px] font-medium">
                  {sub.calRange}
                </span>
              </div>
            </div>
            <div className="p-3 bg-white">
              <p className="text-xs text-slate-500 leading-relaxed">
                {sub.description}
              </p>
            </div>
          </div>

          {/* Sizing Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">
                1. Select Sub Size
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Baked Fresh Daily
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { size: 'mini' as SubSize, label: 'Mini (7")', price: sub.miniPrice, sublabel: 'Light Snack' },
                { size: 'regular' as SubSize, label: 'Regular (9")', price: sub.regularPrice, sublabel: 'Most Popular' },
                { size: 'giant' as SubSize, label: 'Giant (14")', price: sub.giantPrice, sublabel: 'Feeds Two' },
              ].map((sz) => (
                <button
                  key={sz.size}
                  type="button"
                  onClick={() => setSelectedSize(sz.size)}
                  className={`p-2.5 rounded-lg border flex flex-col items-center text-center transition-all ${
                    selectedSize === sz.size
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-medium">{sz.label}</span>
                  <span className={`text-xs font-semibold ${selectedSize === sz.size ? 'text-slate-200' : 'text-slate-900'}`}>
                    ${sz.price.toFixed(2)}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${selectedSize === sz.size ? 'text-slate-400' : 'text-slate-400'}`}>
                    {sz.sublabel}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bread Choice */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-900">
              2. Fresh Baked Bread
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Italian Crusty Baguette', note: 'Signature' },
                { name: 'Rosemary Parmesan Loaf', note: 'Herbed' },
                { name: 'Whole Wheat Deli Roll', note: 'Grains' },
                { name: 'Gluten-Free Roll', note: '+$1.50' },
              ].map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => setSelectedBread(b.name)}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                    selectedBread === b.name
                      ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold'
                      : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs truncate">{b.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                    {b.note}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cheese Selection */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-900">
              3. Deli Cheese
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                'Aged Provolone',
                'Monterey Jack',
                'White American',
                'Swiss Cheese',
                'No Cheese',
              ].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCheese(c)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    selectedCheese === c
                      ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold'
                      : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs">{c}</span>
                </button>
              ))}
            </div>
          </div>

          {/* "The Works" Feature */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-900">
                  Done The Big Boy Way ("The Works")
                </h3>
                <p className="text-[11px] text-slate-500">
                  Onions, Lettuce, Tomato, Red Wine Vinegar, Olive Oil & Oregano
                </p>
              </div>

              {/* The Works Toggle Switch */}
              <button
                type="button"
                onClick={handleToggleTheWorks}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                  isTheWorks ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                    isTheWorks ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Individual Topping Chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {defaultTheWorksToppings.map((top) => {
                const isChecked = selectedToppings.includes(top);
                return (
                  <button
                    key={top}
                    type="button"
                    onClick={() => handleToggleTopping(top)}
                    className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-all ${
                      isChecked
                        ? 'bg-white border border-slate-200 text-slate-900 font-medium shadow-xs'
                        : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      {isChecked ? 'check' : 'close'}
                    </span>
                    <span>{top}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extra Sauces & Toppings */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-900">
              4. Extra Sauces & Add-ons
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { name: 'Spicy Cherry Pepper Relish', price: 'Free' },
                { name: 'Deli Mayonnaise', price: 'Free' },
                { name: 'Spicy Brown Dijon', price: 'Free' },
                { name: 'Crisp Dill Pickles', price: 'Free' },
                { name: 'Applewood Smoked Bacon', price: '+$2.00' },
                { name: 'Double Sliced Meat', price: '+$2.75' },
                { name: 'Extra Provolone / Cheese', price: '+$1.25' },
                { name: 'Pickled Jalapeño Slices', price: 'Free' },
              ].map((extra) => {
                const isSelected = extraCondiments.includes(extra.name);
                return (
                  <button
                    key={extra.name}
                    type="button"
                    onClick={() => handleToggleExtra(extra.name)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold'
                        : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs truncate">{extra.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                      {extra.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cut Options */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-900">
              5. Cut Style
            </span>
            <div className="grid grid-cols-3 gap-2">
              {['Cut in Half', 'Cut in Thirds', 'Leave Whole'].map((cut) => (
                <button
                  key={cut}
                  type="button"
                  onClick={() => setCutPreference(cut)}
                  className={`py-1.5 px-2 rounded-lg border text-center text-xs transition-all ${
                    cutPreference === cut
                      ? 'border-slate-900 bg-slate-900 text-white font-medium'
                      : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cut}
                </button>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-1 pb-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Special Instructions
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra butcher wrap for beach picnic, easy vinegar..."
              className="w-full h-9 px-3 bg-slate-50 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200/80 focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-xs px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Total
            </span>
            <span className="text-sm font-semibold text-slate-900">
              ${finalPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirmAdd}
            disabled={isAdded}
            className={`flex-1 h-11 rounded-lg text-xs font-medium flex items-center justify-center gap-2 shadow-xs transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAdded ? 'check' : 'shopping_bag'}
            </span>
            <span>
              {isAdded ? 'Added to Bag' : `Add to Bag • $${finalPrice.toFixed(2)}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
