import { useState } from 'react';
import { ArrowRight, Store, Sparkles, MapPin, Coffee, Flame, Award, Eye } from 'lucide-react';
import { ASSETS } from '../data/coffeeData';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onFindCafe: () => void;
  onOrderAhead: () => void;
  onViewImageModal: (imgSrc: string, title: string) => void;
}

export function HeroSection({
  onExploreMenu,
  onFindCafe,
  onOrderAhead,
  onViewImageModal,
}: HeroSectionProps) {
  // Allow user to switch between the stunning visual perspectives
  const [activeVisual, setActiveVisual] = useState<number>(0);

  const visuals = [
    {
      id: 'promo-table',
      title: 'Artisan Table & Golden Crema',
      subtitle: 'Vibrant morning pour-over & single-origin espresso',
      tag: 'Fresh Roast Batch',
      image: ASSETS.heroPromo,
      description: 'Single-origin beans ground to order, unlocking layered floral aromas and dense hazelnut crema.',
    },
    {
      id: 'latte-art',
      title: 'The Silky Microfoam Pour',
      subtitle: 'Hand-crafted latte art over custom roasted espresso',
      tag: 'Craft Barista',
      image: ASSETS.latteArtVibrant,
      description: 'Every cup textured with organic local milk at 145°F for gentle sweetness without scald.',
    },
    {
      id: 'historic-parlour',
      title: 'Mornings on Vallejo & Hyde',
      subtitle: 'Victorian parlour overlooking the Powell-Hyde cable car',
      tag: 'Pacific Heights Flagship',
      image: ASSETS.cafeInterior,
      description: 'Hand-carved oak wainscoting and warm morning light piercing through coastal fog.',
    },
  ];

  const currentVisual = visuals[activeVisual];

  return (
    <section id="hero-section" className="relative pt-6 pb-12 sm:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9E1D6] text-[#4A3728] border border-[#D4A373]/30 shadow-sm text-xs font-sans font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#6F4E37] animate-pulse" />
            <span>San Francisco, CA • Est. 2013</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A373]/20 text-[#6F4E37] border border-[#D4A373]/40 text-xs font-sans font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#6F4E37]" />
            <span>Open Daily 6:30am – 6:00pm</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Narrative & Promotion */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 text-[#D4A373] font-sans uppercase tracking-[0.3em] text-xs font-bold">
              <Coffee className="w-4 h-4 text-[#6F4E37]" />
              <span>Small Batch • Ethically Sourced</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.12] text-[#2C1B10] font-bold tracking-tight">
              Slow mornings in the fog, roasted with care since 2013.
            </h1>

            <p className="text-base sm:text-lg text-[#5C5043] font-sans leading-relaxed max-w-xl">
              Handcrafted single-origin pour-overs, heritage lever espresso, and fresh sourdough cardamom pastries served in our historic Pacific Heights Victorian coffeehouse.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 py-3 border-y border-[#D4A373]/20">
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold text-[#2C1B10]">40 yrs</span>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7851]">Family Owned</span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold text-[#6F4E37]">100%</span>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7851]">Direct Trade</span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold text-[#2C1B10]">12 lb</span>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7851]">Drum Batches</span>
              </div>
            </div>

            {/* Interactive CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="btn-hero-explore-menu"
                onClick={onExploreMenu}
                className="min-h-[46px] px-7 py-3 rounded-full bg-[#6F4E37] text-white text-xs font-sans font-bold tracking-widest uppercase shadow-xl shadow-[#6F4E37]/20 hover:bg-[#8C7851] transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <span>Explore Artisan Menu</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#D4A373]" />
              </button>

              <button
                id="btn-hero-shop-roasts"
                onClick={onOrderAhead}
                className="min-h-[46px] px-6 py-3 rounded-full bg-[#D4A373] text-[#2C1B10] hover:bg-[#E5D3C0] text-xs font-sans font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
              >
                <Flame className="w-4 h-4 text-[#6F4E37]" />
                <span>Shop Fresh Roasts</span>
              </button>

              <button
                id="btn-hero-visit-cafe"
                onClick={onFindCafe}
                className="min-h-[46px] px-5 py-3 rounded-full bg-[#F2EDE4] text-[#4A3728] hover:bg-[#E9E1D6] text-xs font-sans font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 border border-[#D4A373]/30"
              >
                <Store className="w-4 h-4 text-[#6F4E37]" />
                <span>Visit Café</span>
              </button>
            </div>

            {/* Local Roasting Note */}
            <div className="flex items-center gap-2 text-xs text-[#5C5043] pt-1">
              <Award className="w-4 h-4 text-[#8C7851] flex-shrink-0" />
              <span>Voted SF Chronicle Best Independent Coffeehouse &amp; Best Morning Roaster</span>
            </div>
          </div>

          {/* Right Column: High-Res Vibrant Visual Showcase */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="relative rounded-[28px] overflow-hidden shadow-xl bg-[#E9E1D6] border border-[#D4A373]/30 group">
              {/* Main Prominent Image */}
              <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden">
                <img
                  src={currentVisual.image}
                  alt={currentVisual.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1B10]/85 via-[#2C1B10]/20 to-transparent pointer-events-none" />

                {/* Inspect Button */}
                <button
                  id="btn-hero-inspect-image"
                  onClick={() => onViewImageModal(currentVisual.image, currentVisual.title)}
                  className="absolute top-4 right-4 bg-[#FAF7F2]/90 hover:bg-white text-[#2C1B10] p-2.5 rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
                  title="View full high-resolution image"
                  aria-label="Expand image"
                >
                  <Eye className="w-4 h-4 text-[#6F4E37]" />
                  <span className="hidden sm:inline">Inspect Vibrant Image</span>
                </button>

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 bg-[#2C1B10]/85 backdrop-blur-md px-3.5 py-1 rounded-full text-[#D4A373] text-[11px] font-sans font-bold tracking-widest uppercase border border-[#D4A373]/30">
                  {currentVisual.tag}
                </div>

                {/* Bottom Overlay Text */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#D4A373] font-bold">
                    {currentVisual.subtitle}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF7F2] leading-tight">
                    {currentVisual.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E5D3C0] mt-1 line-clamp-2">
                    {currentVisual.description}
                  </p>
                </div>
              </div>

              {/* Visual Perspective Switcher Tabs */}
              <div className="p-3.5 bg-[#F2EDE4] border-t border-[#D4A373]/20 flex items-center justify-between gap-2">
                <span className="text-[10px] font-sans font-bold text-[#8C7851] uppercase tracking-widest hidden sm:inline">
                  Select Perspective:
                </span>
                <div id="hero-perspective-tabs" className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                  {visuals.map((vis, idx) => (
                    <button
                      id={`btn-hero-perspective-${idx}`}
                      key={vis.id}
                      onClick={() => setActiveVisual(idx)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all text-center truncate ${
                        activeVisual === idx
                          ? 'bg-[#6F4E37] text-white shadow-md'
                          : 'bg-[#E9E1D6] text-[#4A3728] hover:bg-[#D4A373]/30'
                      }`}
                    >
                      {vis.id === 'promo-table' && '☕ Pour-Over'}
                      {vis.id === 'latte-art' && '🥛 Latte Art'}
                      {vis.id === 'historic-parlour' && '🏛️ Flagship'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Micro Bar Under Image */}
            <div className="flex items-center justify-between text-xs text-[#5C5043] px-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#6F4E37]" />
                1420 Vallejo &amp; Hyde St, Russian Hill
              </span>
              <span className="text-[#6F4E37] font-semibold">
                Batch Roasted This Morning
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
