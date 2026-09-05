import { MapPin, Clock, Calendar, Navigation, Phone, Mail, Sparkles, Train } from 'lucide-react';
import { ASSETS } from '../data/coffeeData';

interface LocationsViewProps {
  onOpenCupping: () => void;
  onViewImageModal: (imgSrc: string, title: string) => void;
}

export function LocationsView({ onOpenCupping, onViewImageModal }: LocationsViewProps) {
  return (
    <div className="py-8 sm:py-12 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="text-center sm:text-left mb-8">
          <div className="inline-flex items-center gap-2 text-[#D4A373] text-xs font-sans font-bold uppercase tracking-[0.3em] mb-2">
            <MapPin className="w-4 h-4 text-[#6F4E37]" />
            <span>San Francisco Coffeehouses</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C1B10] tracking-tight">
            Our Cafés &amp; Tasting Rooms
          </h1>
          <p className="text-sm sm:text-base text-[#5C5043] font-sans mt-2 max-w-2xl">
            Drop by our historic Russian Hill Victorian parlour for warm porcelain cups and fresh sourdough, or explore our weekend farmers market bar.
          </p>
        </div>

        {/* Flagship Card */}
        <div className="bg-[#FAF7F2] rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#6F4E37]/10 transition-all border border-[#D4A373]/25 mb-12">
          {/* Map & Flagship Header */}
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-[#E9E1D6]">
            <img
              src={ASSETS.map}
              alt="Map of 1420 Vallejo St, San Francisco"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() =>
                onViewImageModal(
                  ASSETS.map,
                  'San Francisco Flagship Location: 1420 Vallejo St & Hyde'
                )
              }
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 bg-[#2C1B10]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-sans font-bold text-[#D4A373] border border-[#D4A373]/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Russian Hill Flagship Parlour</span>
              </div>
              <span className="hidden sm:inline-block text-xs font-sans bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                Vallejo &amp; Hyde St.
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Details */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div>
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#D4A373] font-bold">
                  Historic Victorian Coffeehouse
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1B10] mt-0.5">
                  1420 Vallejo Street
                </h2>
                <p className="text-xs sm:text-sm text-[#5C5043] font-sans mt-1">
                  Russian Hill / Pacific Heights border, San Francisco, CA 94109
                </p>
              </div>

              {/* Transit Tip */}
              <div className="p-4 bg-[#F2EDE4] rounded-[20px] border border-[#D4A373]/25 flex items-start gap-3">
                <Train className="w-5 h-5 text-[#6F4E37] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-sans uppercase tracking-wider text-[#2C1B10] block">
                    San Francisco Transit Tip:
                  </strong>
                  <p className="text-xs text-[#5C5043] font-sans mt-0.5 leading-relaxed">
                    Take the historic <strong>Powell-Hyde Cable Car</strong> and hop off right at Vallejo &amp; Hyde. Our brass espresso chimney will be wafting warm roasting aroma across the corner.
                  </p>
                </div>
              </div>

              {/* Hours Grid */}
              <div className="bg-[#F2EDE4] p-4 rounded-[20px] border border-[#D4A373]/25 flex flex-col gap-2.5 text-xs sm:text-sm font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-[#5C5043] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#6F4E37]" /> Monday – Friday
                  </span>
                  <span className="font-bold text-[#2C1B10]">6:30 AM – 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#D4A373]/20 pt-2">
                  <span className="text-[#5C5043] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#6F4E37]" /> Saturday – Sunday
                  </span>
                  <span className="font-bold text-[#2C1B10]">7:00 AM – 7:00 PM</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#D4A373]/20 pt-2">
                  <span className="text-[#6F4E37] font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Weekly Public Cuppings
                  </span>
                  <span className="font-bold text-[#6F4E37]">Thursdays at 10:00 AM</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  id="btn-location-directions"
                  href="https://maps.google.com/?q=1420+Vallejo+St,+San+Francisco,+CA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#F2EDE4] hover:bg-[#E9E1D6] text-[#2C1B10] text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-[#D4A373]/30"
                >
                  <Navigation className="w-4 h-4 text-[#6F4E37]" />
                  <span>Get Directions</span>
                </a>

                <button
                  id="btn-location-reserve-cupping"
                  onClick={onOpenCupping}
                  className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#6F4E37] hover:bg-[#8C7851] text-white text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md shadow-[#6F4E37]/15"
                >
                  <Calendar className="w-4 h-4 text-[#D4A373]" />
                  <span>Reserve Tasting Seat</span>
                </button>
              </div>
            </div>

            {/* Right Photo Column */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="relative rounded-[24px] overflow-hidden aspect-[4/3] bg-[#E9E1D6] shadow-sm">
                <img
                  src={ASSETS.cafeInterior}
                  alt="Historic Cafe Interior on Vallejo St"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() =>
                    onViewImageModal(
                      ASSETS.cafeInterior,
                      'Warm Historic Interior at 1420 Vallejo St'
                    )
                  }
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white text-xs font-sans font-semibold">
                  Antique Oak Wainscoting &amp; Vintage Brass Lever Bar
                </div>
              </div>

              <div className="bg-[#F2EDE4] p-4 rounded-[20px] border border-[#D4A373]/25 flex flex-col gap-1.5 text-xs text-[#5C5043] font-sans">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#6F4E37]" />
                  <span>(415) 555-FOG1 • Front Counter Line</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#6F4E37]" />
                  <span>hello@fogcityroasters.sf</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Satellite Outposts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#FAF7F2] rounded-[28px] p-6 border border-[#D4A373]/25 shadow-sm hover:shadow-xl hover:shadow-[#6F4E37]/10 transition-all">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#D4A373] font-bold block mb-1">
              Production Roastery &amp; Lab
            </span>
            <h3 className="font-serif text-xl font-bold text-[#2C1B10]">
              North Beach Roasting Works
            </h3>
            <p className="text-xs text-[#5C5043] font-sans mt-1 mb-3 leading-relaxed">
              520 Columbus Ave. Home of our 1950s cast-iron Probat roaster and raw bean cooling trays. Open for weekend barrel tours.
            </p>
            <span className="text-xs font-sans font-semibold text-[#6F4E37]">
              Roasting Batches: Mon – Thu mornings
            </span>
          </div>

          <div className="bg-[#FAF7F2] rounded-[28px] p-6 border border-[#D4A373]/25 shadow-sm hover:shadow-xl hover:shadow-[#6F4E37]/10 transition-all">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#D4A373] font-bold block mb-1">
              Waterfront Espresso Kiosk
            </span>
            <h3 className="font-serif text-xl font-bold text-[#2C1B10]">
              Ferry Building Saturday Market
            </h3>
            <p className="text-xs text-[#5C5043] font-sans mt-1 mb-3 leading-relaxed">
              Embarcadero Pier. Pour-over bar and fresh whole bean sacks beside sourdough bakers and organic citrus growers.
            </p>
            <span className="text-xs font-sans font-semibold text-[#6F4E37]">
              Saturdays 8:00 AM – 2:00 PM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
