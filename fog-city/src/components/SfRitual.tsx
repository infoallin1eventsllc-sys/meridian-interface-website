import { useState } from 'react';
import { Droplet, Thermometer, Gauge, Clock, ShieldAlert, Sparkles, Eye } from 'lucide-react';
import { ASSETS } from '../data/coffeeData';

interface SfRitualProps {
  onViewImageModal: (imgSrc: string, title: string) => void;
  onExploreMenu: () => void;
}

export function SfRitual({ onViewImageModal, onExploreMenu }: SfRitualProps) {
  const [activeParam, setActiveParam] = useState<'pressure' | 'temp' | 'ratio' | 'water'>('pressure');

  const extractionParams = {
    pressure: {
      label: 'Manual Spring Lever (9 → 6 Bar Declining Curve)',
      desc: 'Our 1961 Faema E61 spring levers begin with gentle 3-bar pre-infusion before peaking at 9 bars and gently tapering to 6 bars. This prevents channeling and coaxes out natural floral esters without bitterness.',
    },
    temp: {
      label: 'Thermal Stability at 201.5°F',
      desc: 'Saturated group heads with copper boiler heat exchangers maintain steady extraction temperatures accurate within 0.2°F, matching each single-origin elevation profile.',
    },
    ratio: {
      label: '1:2 Brew Ratio in 28 Seconds',
      desc: 'We dose exactly 19.5 grams in precision ridgeless baskets, yielding 39 grams of concentrated liquid silk with thick amber tiger-striping crema.',
    },
    water: {
      label: 'Hetch Hetchy Snowmelt Mineral Blend',
      desc: 'San Francisco enjoys pure Sierra Nevada alpine water from Hetch Hetchy Reservoir. We remineralize with magnesium and bicarbonate to an optimal 125 ppm for clean fruit acidity.',
    },
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#6F4E37] to-[#2C1B10] text-white rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden border border-[#D4A373]/30">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 text-[#D4A373] text-xs font-sans font-bold uppercase tracking-[0.3em]">
                <Droplet className="w-4 h-4 text-[#D4A373]" />
                <span>San Francisco Craft Heritage</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAF7F2] leading-tight">
                The SF Ritual
              </h2>

              <p className="text-base sm:text-lg text-[#E5D3C0] font-sans leading-relaxed max-w-xl">
                Steamed milk, misty mornings &amp; vintage brass lever espresso machines. For four decades, we have pulled shots the patient way—never rushed, honoring the quiet pause before the city stirs into motion.
              </p>

              {/* 4 Heritage Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-4 bg-[#2C1B10]/60 rounded-2xl border border-[#D4A373]/20">
                  <span className="font-serif text-2xl font-bold text-[#D4A373] block">2013</span>
                  <span className="text-xs text-[#FAF7F2]/80">Roasting on Vallejo St.</span>
                </div>
                <div className="p-4 bg-[#2C1B10]/60 rounded-2xl border border-[#D4A373]/20">
                  <span className="font-serif text-2xl font-bold text-[#D4A373] block">100%</span>
                  <span className="text-xs text-[#FAF7F2]/80">Direct-trade smallholders</span>
                </div>
                <div className="p-4 bg-[#2C1B10]/60 rounded-2xl border border-[#D4A373]/20">
                  <span className="font-serif text-2xl font-bold text-[#D4A373] block">24 hr</span>
                  <span className="text-xs text-[#FAF7F2]/80">Fermented morning sourdough</span>
                </div>
                <div className="p-4 bg-[#2C1B10]/60 rounded-2xl border border-[#D4A373]/20">
                  <span className="font-serif text-2xl font-bold text-[#D4A373] block">3-Group</span>
                  <span className="text-xs text-[#FAF7F2]/80">Custom Italian manual levers</span>
                </div>
              </div>

              {/* Interactive Espresso Calibration Lab */}
              <div className="bg-[#2C1B10]/80 rounded-[24px] p-5 border border-[#D4A373]/30 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#D4A373] font-sans font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                    Barista Calibration Specs
                  </span>
                  <span className="text-[11px] text-[#D4A373]/70 font-sans">Click to inspect variables</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <button
                    onClick={() => setActiveParam('pressure')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all text-left flex items-center gap-1.5 ${
                      activeParam === 'pressure'
                        ? 'bg-[#D4A373] text-[#2C1B10] shadow'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <Gauge className="w-3.5 h-3.5" />
                    <span>Pressure</span>
                  </button>
                  <button
                    onClick={() => setActiveParam('temp')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all text-left flex items-center gap-1.5 ${
                      activeParam === 'temp'
                        ? 'bg-[#D4A373] text-[#2C1B10] shadow'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>Temp</span>
                  </button>
                  <button
                    onClick={() => setActiveParam('ratio')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all text-left flex items-center gap-1.5 ${
                      activeParam === 'ratio'
                        ? 'bg-[#D4A373] text-[#2C1B10] shadow'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Ratio</span>
                  </button>
                  <button
                    onClick={() => setActiveParam('water')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all text-left flex items-center gap-1.5 ${
                      activeParam === 'water'
                        ? 'bg-[#D4A373] text-[#2C1B10] shadow'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <Droplet className="w-3.5 h-3.5" />
                    <span>Water</span>
                  </button>
                </div>

                <div className="bg-black/25 p-3.5 rounded-2xl border border-[#D4A373]/20">
                  <h4 className="text-xs font-bold text-[#D4A373]">
                    {extractionParams[activeParam].label}
                  </h4>
                  <p className="text-xs text-[#FAF7F2]/90 mt-1 leading-relaxed font-sans">
                    {extractionParams[activeParam].desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Vignette Photography: Barista Pouring Latte Art */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="relative rounded-[28px] overflow-hidden shadow-2xl border-2 border-[#D4A373]/30 group">
                <img
                  src={ASSETS.baristaPour}
                  alt="Barista pouring latte art into ceramic mug"
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <button
                  onClick={() =>
                    onViewImageModal(
                      ASSETS.baristaPour,
                      'Artisan Barista Steaming & Latte Art Technique'
                    )
                  }
                  className="absolute top-4 right-4 bg-[#2C1B10]/70 hover:bg-[#2C1B10] text-white p-2.5 rounded-full backdrop-blur-md transition-transform hover:scale-110 flex items-center gap-1.5 text-xs"
                  aria-label="Inspect Barista photo"
                >
                  <Eye className="w-4 h-4 text-[#D4A373]" />
                  <span className="text-xs">Inspect Image</span>
                </button>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4A373] font-sans font-bold">
                    The Morning Pour
                  </span>
                  <p className="font-serif text-lg font-bold text-[#FAF7F2] mt-0.5">
                    Silky 145°F Microfoam into Double Ristretto
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 text-xs text-[#E5D3C0]">
                <span>Photo: Barista Elena at 1420 Vallejo</span>
                <button
                  onClick={onExploreMenu}
                  className="text-[#D4A373] hover:underline font-semibold"
                >
                  Order Cortado &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
