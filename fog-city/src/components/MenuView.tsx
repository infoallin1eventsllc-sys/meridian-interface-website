import { useState } from 'react';
import { Flame, Plus, Check, Coffee, Sparkles, ShoppingBag, Eye } from 'lucide-react';
import { MENU_ITEMS, ASSETS } from '../data/coffeeData';
import { MenuItem } from '../types';

interface MenuViewProps {
  onAddToCart: (item: { title: string; price: number; quantity: number; image?: string; isBean?: boolean }) => void;
  onViewImageModal: (imgSrc: string, title: string) => void;
}

export function MenuView({ onAddToCart, onViewImageModal }: MenuViewProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'espresso' | 'signatures' | 'bakery' | 'pourover'>('all');
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const filteredItems = activeCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const handleAdd = (item: MenuItem) => {
    onAddToCart({
      title: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      isBean: false,
    });
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Intro */}
        <div className="mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-[#D4A373] text-xs font-sans font-bold uppercase tracking-[0.3em] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#6F4E37]" />
            <span>Roasting Daily Since 2013 • San Francisco, CA</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C1B10] tracking-tight">
            Our Artisan Menu
          </h1>
          <p className="text-sm sm:text-base text-[#5C5043] font-sans mt-2 max-w-2xl">
            Carefully sourced single-origins, classic espresso drinks, and morning bakeries fresh from our ovens.
          </p>

          {/* Daily Batch Profile Banner */}
          <div className="mt-5 bg-[#F2EDE4] p-4 rounded-[24px] flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#D4A373]/30 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4A373] flex items-center justify-center text-[#2C1B10] flex-shrink-0 shadow-sm">
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-sans uppercase font-bold text-[#8C7851] tracking-widest block">
                  Today's Drum Batch Profile
                </span>
                <span className="font-serif font-bold text-[#2C1B10] text-sm sm:text-base">
                  Ethiopia Yirgacheffe • Washed Heirloom Process
                </span>
              </div>
            </div>
            <span className="text-xs font-sans font-medium px-3.5 py-1 rounded-full bg-[#E9E1D6] text-[#4A3728] border border-[#D4A373]/20">
              Aroma: Jasmine Blossom, Bergamot, Honey
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div id="menu-category-filter-bar" className="sticky top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md py-3 mb-8 -mx-4 px-4 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-[#D4A373]/20">
          <button
            id="menu-filter-all"
            onClick={() => setActiveCategory('all')}
            className={`min-h-[40px] px-5 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${
              activeCategory === 'all'
                ? 'bg-[#6F4E37] text-white'
                : 'bg-[#F2EDE4] text-[#5C5043] hover:bg-[#E9E1D6] border border-[#D4A373]/20'
            }`}
          >
            All Offerings ({MENU_ITEMS.length})
          </button>
          <button
            id="menu-filter-espresso"
            onClick={() => setActiveCategory('espresso')}
            className={`min-h-[40px] px-5 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${
              activeCategory === 'espresso'
                ? 'bg-[#6F4E37] text-white'
                : 'bg-[#F2EDE4] text-[#5C5043] hover:bg-[#E9E1D6] border border-[#D4A373]/20'
            }`}
          >
            Espresso &amp; Classics
          </button>
          <button
            id="menu-filter-signatures"
            onClick={() => setActiveCategory('signatures')}
            className={`min-h-[40px] px-5 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${
              activeCategory === 'signatures'
                ? 'bg-[#6F4E37] text-white'
                : 'bg-[#F2EDE4] text-[#5C5043] hover:bg-[#E9E1D6] border border-[#D4A373]/20'
            }`}
          >
            Fog City Signatures
          </button>
          <button
            id="menu-filter-bakery"
            onClick={() => setActiveCategory('bakery')}
            className={`min-h-[40px] px-5 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${
              activeCategory === 'bakery'
                ? 'bg-[#6F4E37] text-white'
                : 'bg-[#F2EDE4] text-[#5C5043] hover:bg-[#E9E1D6] border border-[#D4A373]/20'
            }`}
          >
            Morning Bakery &amp; Toast
          </button>
          <button
            id="menu-filter-pourover"
            onClick={() => setActiveCategory('pourover')}
            className={`min-h-[40px] px-5 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${
              activeCategory === 'pourover'
                ? 'bg-[#6F4E37] text-white'
                : 'bg-[#F2EDE4] text-[#5C5043] hover:bg-[#E9E1D6] border border-[#D4A373]/20'
            }`}
          >
            Slow Pour-Over Bar
          </button>
        </div>

        {/* Menu Items Grid */}
        <div id="menu-items-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredItems.map((item) => {
            const isAdded = addedItem === item.id;
            return (
              <div
                id={`card-menu-${item.id}`}
                key={item.id}
                className="bg-[#FAF7F2] rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#6F4E37]/10 transition-all border border-[#D4A373]/20 flex flex-col justify-between"
              >
                <div>
                  {item.image && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#E9E1D6] group">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                        onClick={() => onViewImageModal(item.image!, item.name)}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                      {item.featuredBadge && (
                        <div className="absolute top-3 left-3 bg-[#2C1B10]/85 backdrop-blur-md text-[#D4A373] text-[10px] font-sans font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#D4A373]/30">
                          {item.featuredBadge}
                        </div>
                      )}

                      <button
                        onClick={() => onViewImageModal(item.image!, item.name)}
                        className="absolute top-3 right-3 bg-[#FAF7F2]/90 hover:bg-white text-[#2C1B10] p-2 rounded-full shadow-md transition-transform hover:scale-110 active:scale-95"
                        title="View photo"
                        aria-label="Inspect menu image"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#6F4E37]" />
                      </button>
                    </div>
                  )}

                  <div className="p-5 flex flex-col gap-2.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-xl font-bold text-[#2C1B10]">
                        {item.name}
                      </h3>
                      <span className="font-serif text-xl font-bold text-[#6F4E37] flex-shrink-0">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5C5043] font-sans leading-relaxed">
                      {item.description}
                    </p>

                    {item.details && (
                      <span className="text-xs text-[#8C7851] font-sans font-medium">
                        • {item.details}
                      </span>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F2EDE4] text-[#5C5043] border border-[#D4A373]/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    id={`btn-add-menu-${item.id}`}
                    onClick={() => handleAdd(item)}
                    className={`w-full min-h-[42px] py-2 px-4 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6F4E37]/15 ${
                      isAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#6F4E37] hover:bg-[#8C7851] text-white active:scale-[0.98]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-[#D4A373]" />
                        <span>Added to Order</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[#D4A373]" />
                        <span>Add to Order Ahead</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Craft Bar Section */}
        <div className="bg-gradient-to-br from-[#6F4E37] to-[#2C1B10] text-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-[#D4A373]/30 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#D4A373] text-[#2C1B10] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#D4A373]">
                Custom Craft Bar &amp; Whole Bean Tins
              </h3>
              <p className="text-xs sm:text-sm text-[#E5D3C0] font-sans">
                Every cup can be dialed to your personal taste at our barista counter.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#FAF7F2] pt-2 border-t border-[#D4A373]/20">
            <div>
              <strong className="text-[#D4A373] uppercase tracking-wider block mb-1 font-sans">
                Milk &amp; Alternative Selections:
              </strong>
              <p className="text-[#E5D3C0] leading-relaxed font-sans">
                Straus Family Organic Whole, Minor Figures Barista Oat, House Stone-Ground Hazelnut Milk (+0.75).
              </p>
            </div>
            <div>
              <strong className="text-[#D4A373] uppercase tracking-wider block mb-1 font-sans">
                Whole Bean Tins To Take Home:
              </strong>
              <p className="text-[#E5D3C0] leading-relaxed font-sans">
                12oz nitrogen-sealed craft tins available at the front counter. Whole bean or complimentary custom grind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
