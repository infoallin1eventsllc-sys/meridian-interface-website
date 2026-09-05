import { useState } from 'react';
import { Sparkles, ShoppingBag, Check, Coffee, Flame, ShieldCheck } from 'lucide-react';
import { TODAY_ROASTS } from '../data/coffeeData';
import { CoffeeRoast } from '../types';

interface RoastShowcaseProps {
  onAddToCart: (item: { title: string; price: number; grind: string; isBean: boolean; image: string }) => void;
  onViewImageModal: (imgSrc: string, title: string) => void;
}

export function RoastShowcase({ onAddToCart, onViewImageModal }: RoastShowcaseProps) {
  const [selectedGrind, setSelectedGrind] = useState<Record<string, string>>({
    'twin-peaks-dark': 'Whole Bean',
    'sutro-fog-light': 'Whole Bean',
    'mission-sunrise-medium': 'Whole Bean',
  });

  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const grindOptions = ['Whole Bean', 'Chemex / V60', 'Espresso', 'French Press'];

  const handleGrindChange = (roastId: string, grind: string) => {
    setSelectedGrind((prev) => ({ ...prev, [roastId]: grind }));
  };

  const handleAddRoast = (roast: CoffeeRoast) => {
    const grind = selectedGrind[roast.id] || 'Whole Bean';
    onAddToCart({
      title: `${roast.name} (12oz)`,
      price: roast.price,
      grind,
      isBean: true,
      image: roast.image,
    });
    setAddedNotice(roast.id);
    setTimeout(() => setAddedNotice(null), 2200);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#F2EDE4] border-y border-[#D4A373]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-2 text-[#D4A373] font-sans text-xs font-bold uppercase tracking-[0.3em]">
              <Flame className="w-4 h-4 text-[#6F4E37]" />
              <span>Fresh From The Cast-Iron Drum Roaster</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C1B10] tracking-tight">
              Today’s Morning Roast Collection
            </h2>
            <p className="text-sm sm:text-base text-[#5C5043] font-sans max-w-2xl">
              Roasted in micro-batches of twelve pounds inside our restored 1950s Probat cast-iron drum. Hand-stamped and sealed with degas valves.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#FAF7F2] px-4 py-2 rounded-2xl shadow-sm border border-[#D4A373]/30 self-start md:self-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-[#6F4E37] animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7851] font-bold">Active Drum Lot</span>
              <span className="font-serif font-bold text-[#2C1B10] text-sm">Drum Batch #849</span>
            </div>
          </div>
        </div>

        {/* Roast Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TODAY_ROASTS.map((roast) => {
            const currentGrind = selectedGrind[roast.id] || 'Whole Bean';
            const isAdded = addedNotice === roast.id;

            return (
              <div
                key={roast.id}
                className="bg-[#FAF7F2] rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#6F4E37]/10 transition-all duration-300 border border-[#D4A373]/20 flex flex-col justify-between group"
              >
                <div>
                  {/* Vibrant Bean Photo Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#E9E1D6]">
                    <img
                      src={roast.image}
                      alt={roast.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                      onClick={() => onViewImageModal(roast.image, roast.name)}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Roast Level Pill */}
                    <div className="absolute top-3 left-3 bg-[#2C1B10]/85 backdrop-blur-md text-[#D4A373] text-[10px] font-sans font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#D4A373]/30">
                      {roast.roastLevel} Roast • {roast.category}
                    </div>

                    {roast.badge && (
                      <div className="absolute top-3 right-3 bg-[#D4A373] text-[#2C1B10] text-[10px] font-sans font-bold px-3 py-1 rounded-full shadow-sm">
                        {roast.badge}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-xs font-medium tracking-wide bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        {roast.elevation} Elevation
                      </span>
                      {roast.score && (
                        <span className="text-xs font-bold bg-[#6F4E37] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-[#D4A373]" />
                          Q-Grade {roast.score}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-sans font-semibold text-[#8C7851]">{roast.origin}</span>
                        <h3 className="font-serif text-xl font-bold text-[#2C1B10] mt-0.5">
                          {roast.name}
                        </h3>
                      </div>
                      <span className="font-serif text-2xl font-bold text-[#2C1B10] flex-shrink-0">
                        ${roast.price}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5C5043] font-sans leading-relaxed line-clamp-3">
                      {roast.description}
                    </p>

                    {/* Tasting Notes */}
                    <div className="pt-1">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8C7851] block mb-1.5">
                        Tasting Notes
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {roast.notes.map((note) => (
                          <span
                            key={note}
                            className="text-xs px-2.5 py-1 rounded-full bg-[#F2EDE4] text-[#4A3728] font-medium border border-[#D4A373]/20"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Grind Selector */}
                    <div className="pt-2">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8C7851] block mb-1.5">
                        Grind Preference
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {grindOptions.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleGrindChange(roast.id, g)}
                            className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all text-center border ${
                              currentGrind === g
                                ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-sm'
                                : 'bg-[#FAF7F2] text-[#5C5043] border-[#D4A373]/30 hover:bg-[#F2EDE4]'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleAddRoast(roast)}
                    className={`w-full min-h-[44px] py-2.5 px-4 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6F4E37]/15 ${
                      isAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#6F4E37] hover:bg-[#8C7851] text-white active:scale-[0.98]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-[#D4A373]" />
                        <span>Added 12oz Bag to Order!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
                        <span>Add 12oz Bag • ${roast.price}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Roasting Guarantee Note */}
        <div className="mt-10 bg-[#FAF7F2] rounded-[24px] p-5 sm:p-6 border border-[#D4A373]/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A373]/20 text-[#6F4E37] flex items-center justify-center flex-shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#2C1B10] text-base sm:text-lg">
                The 48-Hour Peak Freshness Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-[#5C5043] font-sans">
                Every bag shipped or handed across our marble counter is rested for a minimum of 48 hours to degas and peak in sweetness.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#8C7851] uppercase tracking-wider flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#6F4E37]" />
            <span>Cast Iron Roasted Daily</span>
          </div>
        </div>
      </div>
    </section>
  );
}
