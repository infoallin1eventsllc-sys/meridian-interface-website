import { useState } from 'react';
import { Eye, Sparkles, Filter, Check, Download, Share2 } from 'lucide-react';
import { ASSETS } from '../data/coffeeData';

interface PromoGalleryProps {
  onViewImageModal: (imgSrc: string, title: string) => void;
}

interface GalleryItem {
  id: string;
  title: string;
  category: 'coffee' | 'roasting' | 'atmosphere' | 'bakery';
  src: string;
  description: string;
  tag: string;
  aspect: string;
}

export function PromoGallery({ onViewImageModal }: PromoGalleryProps) {
  const [filter, setFilter] = useState<'all' | 'coffee' | 'roasting' | 'atmosphere' | 'bakery'>('all');
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'marketing-composite',
      title: 'Fog City Roasters • Pacific Coastline & Heritage Reserve',
      category: 'coffee',
      src: ASSETS.marketingComposite,
      description: 'Signature marketing composite featuring Morning Fog light roast and Sutro Sunset reserve tins set against the foggy Golden Gate vista and twilight San Francisco skyline.',
      tag: 'Brand Campaign',
      aspect: 'aspect-[16/9]',
    },
    {
      id: 'hero-promo',
      title: 'Morning Light Pour-Over & Golden Crema',
      category: 'coffee',
      src: ASSETS.heroPromo,
      description: 'Crystal-clear focus on aromatic steam rising from a ceramic mug beside single-origin beans and espresso.',
      tag: 'Vibrant Focus',
      aspect: 'aspect-[16/10]',
    },
    {
      id: 'latte-art-vibrant',
      title: 'Barista Rosetta Pour',
      category: 'coffee',
      src: ASSETS.latteArtVibrant,
      description: 'Intricate heart rosetta latte art contrasting with rich dark hazelnut crema on a warm espresso bar.',
      tag: 'Latte Art',
      aspect: 'aspect-[4/3]',
    },
    {
      id: 'beans-macro',
      title: 'Glossy Drum-Roasted Arabica Beans',
      category: 'roasting',
      src: ASSETS.beansMacro,
      description: 'Vibrant macro detail of fresh specialty coffee beans overflowing from a vintage brass scoop.',
      tag: 'Cast-Iron Drum',
      aspect: 'aspect-[4/3]',
    },
    {
      id: 'iced-caramel',
      title: 'Foggy Sea Salt Caramel Latte',
      category: 'coffee',
      src: ASSETS.icedCraft,
      description: 'Tall ribbed tumbler with clear ice, caramel ribbons blending into rich espresso and cream.',
      tag: 'House Signature',
      aspect: 'aspect-[4/3]',
    },
    {
      id: 'parlour-interior',
      title: 'Historic Victorian Coffeehouse',
      category: 'atmosphere',
      src: ASSETS.cafeInterior,
      description: 'Mornings on Vallejo & Hyde with brass espresso levers, dark oak, and gentle fog outside.',
      tag: 'Flagship Café',
      aspect: 'aspect-[16/10]',
    },
    {
      id: 'barista-craft',
      title: 'Barista Steaming Craft',
      category: 'coffee',
      src: ASSETS.baristaPour,
      description: 'Texturing whole milk to velvety microfoam on the vintage lever machine.',
      tag: 'Heritage Ritual',
      aspect: 'aspect-[4/3]',
    },
    {
      id: 'cardamom-bun',
      title: 'Warm Cardamom Morning Bun',
      category: 'bakery',
      src: ASSETS.morningBun,
      description: 'Caramelized French pastry dough rolled with stone-ground green cardamom and orange zest.',
      tag: 'Fresh Baked 6 AM',
      aspect: 'aspect-[4/3]',
    },
    {
      id: 'russian-hill-sanctum',
      title: 'Russian Hill Roasting Sanctum',
      category: 'atmosphere',
      src: ASSETS.russianHillShop,
      description: 'The cozy sanctuary built in 2013 for writers, dreamers, and early morning fog walkers.',
      tag: 'Est. 2013',
      aspect: 'aspect-[16/10]',
    },
  ];

  const filteredItems = filter === 'all'
    ? galleryItems
    : galleryItems.filter((item) => {
        if (item.id === 'marketing-composite' && (filter === 'coffee' || filter === 'atmosphere')) {
          return true;
        }
        return item.category === filter;
      });

  const handleShare = (item: GalleryItem) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotice(item.id);
    setTimeout(() => setCopiedNotice(null), 2000);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#D4A373] text-xs font-sans font-bold uppercase tracking-[0.3em] mb-1.5">
              <Sparkles className="w-4 h-4 text-[#6F4E37]" />
              <span>Visual Showcase &amp; Craft Imagery</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C1B10] tracking-tight">
              Promotional Coffee Gallery
            </h2>
            <p className="text-sm sm:text-base text-[#5C5043] font-sans mt-1 max-w-xl">
              Clear, vibrant photography capturing our single-origin pour-overs, cast-iron roasting drums, silky latte art, and historic San Francisco atmosphere.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-[11px] font-sans uppercase tracking-wider whitespace-nowrap transition-all ${
                filter === 'all'
                  ? 'bg-[#6F4E37] text-white font-bold shadow-md'
                  : 'bg-[#F2EDE4] text-[#5C5043] hover:bg-[#E9E1D6] font-semibold border border-[#D4A373]/20'
              }`}
            >
              All Images ({galleryItems.length})
            </button>
            <button
              onClick={() => setFilter('coffee')}
              className={`px-4 py-2 rounded-full text-[11px] font-sans uppercase tracking-wider whitespace-nowrap transition-all ${
                filter === 'coffee'
                  ? 'bg-[#6F4E37] text-white font-bold shadow-md'
                  : 'bg-[#F2EDE4] text-[#5C5043] hover:bg-[#E9E1D6] font-semibold border border-[#D4A373]/20'
              }`}
            >
              Coffee &amp; Crema
            </button>
            <button
              onClick={() => setFilter('roasting')}
              className={`px-4 py-2 rounded-full text-[11px] font-sans uppercase tracking-wider whitespace-nowrap transition-all ${
                filter === 'roasting'
                  ? 'bg-[#6F4E37] text-white font-bold shadow-md'
                  : 'bg-[#F2EDE4] text-[#5C5043] hover:bg-[#E9E1D6] font-semibold border border-[#D4A373]/20'
              }`}
            >
              Roasting &amp; Beans
            </button>
            <button
              onClick={() => setFilter('atmosphere')}
              className={`px-4 py-2 rounded-full text-[11px] font-sans uppercase tracking-wider whitespace-nowrap transition-all ${
                filter === 'atmosphere'
                  ? 'bg-[#6F4E37] text-white font-bold shadow-md'
                  : 'bg-[#F2EDE4] text-[#5C5043] hover:bg-[#E9E1D6] font-semibold border border-[#D4A373]/20'
              }`}
            >
              Victorian Atmosphere
            </button>
            <button
              onClick={() => setFilter('bakery')}
              className={`px-4 py-2 rounded-full text-[11px] font-sans uppercase tracking-wider whitespace-nowrap transition-all ${
                filter === 'bakery'
                  ? 'bg-[#6F4E37] text-white font-bold shadow-md'
                  : 'bg-[#F2EDE4] text-[#5C5043] hover:bg-[#E9E1D6] font-semibold border border-[#D4A373]/20'
              }`}
            >
              Pastries &amp; Pairings
            </button>
          </div>
        </div>

        {/* Gallery Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const isCopied = copiedNotice === item.id;
            return (
              <div
                key={item.id}
                className={`bg-[#FAF7F2] rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#6F4E37]/10 transition-all duration-300 border border-[#D4A373]/20 flex flex-col group ${
                  item.id === 'marketing-composite' ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className={`relative ${item.aspect} overflow-hidden bg-[#E9E1D6]`}>
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                    onClick={() => onViewImageModal(item.src, item.title)}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-[#2C1B10]/85 backdrop-blur-md text-[#D4A373] text-[10px] font-sans font-bold px-3 py-0.5 rounded-full uppercase tracking-wider border border-[#D4A373]/30">
                    {item.tag}
                  </div>

                  {/* Quick Expand Button */}
                  <button
                    onClick={() => onViewImageModal(item.src, item.title)}
                    className="absolute top-3 right-3 bg-[#FAF7F2]/90 hover:bg-white text-[#2C1B10] p-2 rounded-full shadow-md transition-transform hover:scale-110 active:scale-95"
                    title="Inspect high-res image"
                    aria-label={`View ${item.title}`}
                  >
                    <Eye className="w-3.5 h-3.5 text-[#6F4E37]" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#FAF7F2] line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <p className="text-xs text-[#5C5043] font-sans leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#D4A373]/20 text-xs">
                    <button
                      onClick={() => onViewImageModal(item.src, item.title)}
                      className="text-[#6F4E37] hover:text-[#8C7851] font-sans font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full View</span>
                    </button>

                    <button
                      onClick={() => handleShare(item)}
                      className="text-[#5C5043] hover:text-[#2C1B10] flex items-center gap-1 text-[11px] font-sans"
                      title="Share link"
                    >
                      {isCopied ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                          <Check className="w-3.5 h-3.5" /> Link Copied
                        </span>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
