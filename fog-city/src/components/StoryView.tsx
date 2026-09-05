import { useState } from 'react';
import { Verified, Calendar, MapPin, Compass, Flame, Heart, ChevronDown, Award, Eye } from 'lucide-react';
import { ASSETS, STORY_TIMELINE } from '../data/coffeeData';

interface StoryViewProps {
  onOpenCupping: () => void;
  onViewImageModal: (imgSrc: string, title: string) => void;
}

export function StoryView({ onOpenCupping, onViewImageModal }: StoryViewProps) {
  const [isFamilyOpen, setIsFamilyOpen] = useState(false);

  return (
    <div className="py-8 sm:py-12 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Prologue */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A373]/20 text-[#6F4E37] border border-[#D4A373]/40 text-xs font-sans font-bold uppercase tracking-[0.25em] mb-3 shadow-sm">
            <Verified className="w-3.5 h-3.5 text-[#6F4E37]" />
            <span>Est. 2013 • San Francisco, California</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C1B10] tracking-tight max-w-2xl">
            Forty Years of Warmth in the City by the Bay
          </h1>

          <p className="text-sm sm:text-base text-[#5C5043] font-sans max-w-2xl mt-4 leading-relaxed">
            Before third-wave was a phrase, we fired up our cast-iron vintage drum roaster inside an 1890s Victorian storefront on the slope of Russian Hill. While Karl the Fog rolled through the Golden Gate, we built a sanctuary for thinkers, writers, dreamers, and early-morning walkers.
          </p>

          {/* Metric Badges */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-6">
            <div className="bg-[#F2EDE4] rounded-[24px] p-4 text-center border border-[#D4A373]/25 shadow-sm">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1B10] block leading-none">
                2013
              </span>
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#5C5043] font-bold mt-1.5 block">
                Founded
              </span>
            </div>
            <div className="bg-[#F2EDE4] rounded-[24px] p-4 text-center border border-[#D4A373]/25 shadow-sm">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#6F4E37] block leading-none">
                100%
              </span>
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#5C5043] font-bold mt-1.5 block">
                Direct Origin
              </span>
            </div>
            <div className="bg-[#F2EDE4] rounded-[24px] p-4 text-center border border-[#D4A373]/25 shadow-sm">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1B10] block leading-none">
                12 lb
              </span>
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#5C5043] font-bold mt-1.5 block">
                Drum Batches
              </span>
            </div>
          </div>
        </div>

        {/* Atmospheric Visual Feature */}
        <div className="relative rounded-[32px] overflow-hidden shadow-xl border border-[#D4A373]/30 mb-12 group">
          <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#E9E1D6]">
            <img
              src={ASSETS.russianHillShop}
              alt="Russian Hill Roastery Sanctum"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
              onClick={() =>
                onViewImageModal(
                  ASSETS.russianHillShop,
                  'Historic Russian Hill Roasting Sanctum, Est. 2013'
                )
              }
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C1B10]/95 via-[#2C1B10]/40 to-transparent pointer-events-none" />

            <button
              onClick={() =>
                onViewImageModal(
                  ASSETS.russianHillShop,
                  'Historic Russian Hill Roasting Sanctum, Est. 2013'
                )
              }
              className="absolute top-4 right-4 bg-[#FAF7F2]/90 hover:bg-white text-[#2C1B10] p-2.5 rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider"
              aria-label="Inspect Roastery Sanctum"
            >
              <Eye className="w-4 h-4 text-[#6F4E37]" />
              <span className="hidden sm:inline">Inspect Image</span>
            </button>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#D4A373] font-bold block mb-1">
                Russian Hill Sanctum
              </span>
              <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#FAF7F2] leading-snug">
                “Where cold maritime wind yields to warm porcelain and roasted hazelnut notes.”
              </blockquote>
            </div>
          </div>
        </div>

        {/* Philosophy & Craft Pillars */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#D4A373] font-bold block">
                Our Guiding Tenets
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1B10]">
                Philosophy &amp; Craft
              </h2>
            </div>
            <Award className="w-8 h-8 text-[#6F4E37]/40" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Tenet 1 */}
            <div className="bg-[#FAF7F2] rounded-[24px] p-6 border border-[#D4A373]/20 shadow-sm hover:shadow-xl hover:shadow-[#6F4E37]/10 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4A373]/25 text-[#6F4E37] flex items-center justify-center flex-shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-lg font-bold text-[#2C1B10]">
                    Direct Trade &amp; Terroir
                  </h3>
                  <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[#F2EDE4] text-[#5C5043] font-semibold border border-[#D4A373]/20">
                    High Elevation
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5C5043] font-sans leading-relaxed">
                  We partner directly with smallholder farming cooperatives in Oaxaca, Huehuetenango, and Sidama, paying 35% above fair trade standards to safeguard regenerative micro-lots and preserve high-altitude cloud forest biodiversity.
                </p>
              </div>
            </div>

            {/* Tenet 2 */}
            <div className="bg-[#FAF7F2] rounded-[24px] p-6 border border-[#D4A373]/20 shadow-sm hover:shadow-xl hover:shadow-[#6F4E37]/10 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#6F4E37]/15 text-[#6F4E37] flex items-center justify-center flex-shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-lg font-bold text-[#2C1B10]">
                    Vintage Cast-Iron Drum
                  </h3>
                  <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[#F2EDE4] text-[#5C5043] font-semibold border border-[#D4A373]/20">
                    12 lb Batches
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5C5043] font-sans leading-relaxed">
                  Slow, small-batch roasting in our restored 1950s cast-iron drum roaster that coaxes out natural cane sweetness, nuanced citrus acidity, and a rich, velvety chocolate body without bitter smokiness.
                </p>
              </div>
            </div>

            {/* Tenet 3 */}
            <div className="bg-[#FAF7F2] rounded-[24px] p-6 border border-[#D4A373]/20 shadow-sm hover:shadow-xl hover:shadow-[#6F4E37]/10 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4A373]/25 text-[#6F4E37] flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-lg font-bold text-[#2C1B10]">
                    The Third Place Tradition
                  </h3>
                  <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[#F2EDE4] text-[#5C5043] font-semibold border border-[#D4A373]/20">
                    Analog Ritual
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5C5043] font-sans leading-relaxed">
                  Hand-carved mahogany booths, antique brass taps, and the timeless hiss of our 1961 Faema E61 lever machine. No rush, no digital screens on tables, no pretense—just unhurried conversation and honest warmth.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Founders Spotlight: Marco & Elena Rossi */}
        <div className="bg-gradient-to-br from-[#6F4E37] to-[#2C1B10] text-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-[#D4A373]/30 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#D4A373] flex-shrink-0 bg-[#2C1B10]">
              <img
                src={ASSETS.rossiFamily}
                alt="Marco and Elena Rossi"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() =>
                  onViewImageModal(
                    ASSETS.rossiFamily,
                    'Marco & Elena Rossi, Second Generation Roastmasters'
                  )
                }
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#D4A373] font-bold block">
                Second Generation Roasters
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#FAF7F2]">
                Marco &amp; Elena Rossi
              </h3>
              <p className="text-xs sm:text-sm text-[#E5D3C0] font-sans">
                Stewarding the family craft on Vallejo St. since 2008
              </p>
            </div>
          </div>

          <blockquote className="bg-[#2C1B10]/70 rounded-[20px] p-4 sm:p-5 border border-[#D4A373]/25 mb-4">
            <p className="font-serif text-lg sm:text-xl text-[#D4A373] italic leading-snug">
              “Great coffee is half agronomy and half hospitality. You need both to warm someone up after a windy morning walk across the Marina.”
            </p>
            <cite className="text-xs font-sans uppercase tracking-widest text-[#E5D3C0] font-semibold not-italic block mt-2">
              — Marco Rossi, Roastmaster
            </cite>
          </blockquote>

          {/* Toggle Accordion */}
          <button
            id="btn-toggle-family-history"
            onClick={() => setIsFamilyOpen(!isFamilyOpen)}
            className="w-full flex items-center justify-between py-2 text-xs font-sans uppercase font-bold tracking-widest text-[#D4A373] hover:text-white transition-colors border-t border-[#D4A373]/20 pt-3"
          >
            <span>Read The Full Rossi Family Heritage</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isFamilyOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isFamilyOpen && (
            <div className="pt-3 text-xs sm:text-sm text-[#FAF7F2]/90 font-sans leading-relaxed">
              Arriving from Lucca, Tuscany in the early 1970s, their father Giancarlo worked the San Francisco docks before opening the original roastery with a single burlap delivery van. Today, Marco oversees roast curves and barrel calibration while Elena coordinates single-origin cuppings, farm contracts, and community tastings in the Victorian backroom.
            </div>
          )}
        </div>

        {/* Roasting Timeline */}
        <div className="mb-12">
          <div className="mb-6">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#D4A373] font-bold block">
              San Francisco Chronicle
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1B10]">
              Decades of Roasting Under the Fog
            </h2>
          </div>

          <div className="bg-[#FAF7F2] rounded-[32px] p-6 sm:p-8 border border-[#D4A373]/25 shadow-sm flex flex-col gap-6">
            {STORY_TIMELINE.map((item, index) => (
              <div key={item.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[#6F4E37] border-2 border-[#FAF7F2] shadow-sm flex-shrink-0" />
                  {index < STORY_TIMELINE.length - 1 && (
                    <div className="w-0.5 flex-1 bg-[#D4A373]/30 my-1" />
                  )}
                </div>
                <div className="pb-2">
                  <span className="font-serif font-bold text-[#2C1B10] text-base sm:text-lg block">
                    {item.year} • {item.title}
                  </span>
                  <p className="text-xs sm:text-sm text-[#5C5043] font-sans mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasting Room Callout */}
        <div className="bg-[#F2EDE4] rounded-[32px] p-6 sm:p-8 border border-[#D4A373]/30 text-center flex flex-col items-center">
          <Calendar className="w-10 h-10 text-[#6F4E37] mb-3" />
          <h3 className="font-serif text-2xl font-bold text-[#2C1B10]">
            Visit Our Historic Tasting Room
          </h3>
          <p className="text-xs sm:text-sm text-[#5C5043] font-sans max-w-md mt-1 mb-5">
            Join our head roaster every Thursday at 10:00 AM for complimentary public cuppings and sensory aroma evaluation.
          </p>
          <button
            id="btn-story-reserve-cupping"
            onClick={onOpenCupping}
            className="min-h-[44px] px-8 py-3 rounded-full bg-[#6F4E37] hover:bg-[#8C7851] text-white text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#6F4E37]/15 active:scale-95"
          >
            Reserve Cupping Seat
          </button>
        </div>
      </div>
    </div>
  );
}
