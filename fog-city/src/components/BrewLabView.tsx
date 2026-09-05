import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Clock,
  Droplet,
  Compass,
  Coffee,
  Wind,
  CheckCircle2,
  Sliders,
  Check,
} from 'lucide-react';
import { BREW_GUIDES, TODAY_ROASTS } from '../data/coffeeData';
import { BrewGuide, CoffeeRoast } from '../types';

interface BrewLabViewProps {
  onAddToCart: (item: {
    title: string;
    price: number;
    grind: string;
    isBean: boolean;
    image?: string;
    isSubscription?: boolean;
    frequency?: string;
  }) => void;
  onViewImageModal: (src: string, title: string) => void;
}

export function BrewLabView({ onAddToCart, onViewImageModal }: BrewLabViewProps) {
  const [selectedMethodId, setSelectedMethodId] = useState<string>('hario-v60');
  const activeGuide: BrewGuide =
    BREW_GUIDES.find((g) => g.id === selectedMethodId) || BREW_GUIDES[0];

  // Calculator State
  const [coffeeGrams, setCoffeeGrams] = useState<number>(activeGuide.defaultCoffeeGrams);
  const [customRatio, setCustomRatio] = useState<number>(activeGuide.defaultRatio);

  // Update calculator when method changes
  useEffect(() => {
    setCoffeeGrams(activeGuide.defaultCoffeeGrams);
    setCustomRatio(activeGuide.defaultRatio);
    setIsTimerRunning(false);
    setTimerSeconds(0);
  }, [selectedMethodId, activeGuide.defaultCoffeeGrams, activeGuide.defaultRatio]);

  // Derived calculations
  const totalWaterGrams = Math.round(coffeeGrams * customRatio);
  const bloomWaterGrams = Math.round(coffeeGrams * 2.5);
  const approximateCups = (totalWaterGrams / 240).toFixed(1);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev >= activeGuide.totalTimeSec) {
            setIsTimerRunning(false);
            return activeGuide.totalTimeSec;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, activeGuide.totalTimeSec]);

  const handleTimerToggle = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleTimerReset = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  // Find matched coffee roast
  const matchedRoast: CoffeeRoast | undefined = TODAY_ROASTS.find(
    (r) => r.id === activeGuide.matchedRoastId
  );

  // Current active step calculation
  const getCurrentStepIndex = () => {
    for (let i = 0; i < activeGuide.steps.length; i++) {
      if (timerSeconds <= activeGuide.steps[i].timeSec) {
        return i;
      }
    }
    return activeGuide.steps.length - 1;
  };

  const currentStepIdx = getCurrentStepIndex();
  const isComplete = timerSeconds >= activeGuide.totalTimeSec;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Subscription Builder State
  const [subFrequency, setSubFrequency] = useState<'1-week' | '2-weeks' | '4-weeks'>('2-weeks');
  const [subBags, setSubBags] = useState<number>(2);
  const [subRoast, setSubRoast] = useState<string>('Roaster’s Choice Micro-Lot');
  const [subAddedNotice, setSubAddedNotice] = useState<boolean>(false);

  const subPricePerBag = 18.70; // 15% off standard $22
  const subTotal = (subPricePerBag * subBags).toFixed(2);

  const handleAddSubscription = () => {
    onAddToCart({
      title: `Roaster's Club Subscription: ${subRoast} (${subBags} ${subBags === 1 ? 'Bag' : 'Bags'})`,
      price: parseFloat(subTotal),
      grind: activeGuide.grindRecommendation.split(' ')[0],
      isBean: true,
      isSubscription: true,
      frequency:
        subFrequency === '1-week'
          ? 'Every Week'
          : subFrequency === '2-weeks'
          ? 'Every 2 Weeks'
          : 'Every 4 Weeks',
    });
    setSubAddedNotice(true);
    setTimeout(() => setSubAddedNotice(false), 2400);
  };

  const [roastAdded, setRoastAdded] = useState(false);
  const handleAddMatchedRoast = () => {
    if (!matchedRoast) return;
    onAddToCart({
      title: `${matchedRoast.name} (12oz)`,
      price: matchedRoast.price,
      grind: activeGuide.grindRecommendation.split(' ')[0],
      isBean: true,
      image: matchedRoast.image,
    });
    setRoastAdded(true);
    setTimeout(() => setRoastAdded(false), 2200);
  };

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplet':
        return <Droplet className="w-5 h-5" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5" />;
      case 'Clock':
        return <Clock className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Wind':
        return <Wind className="w-5 h-5" />;
      default:
        return <Coffee className="w-5 h-5" />;
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[#D4A373] text-xs font-sans font-bold uppercase tracking-[0.3em] mb-2">
            <Sliders className="w-4 h-4 text-[#6F4E37]" />
            <span>San Francisco Extraction Standards</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C1B10] tracking-tight">
            The Fog City Brew Lab
          </h1>
          <p className="text-sm sm:text-base text-[#5C5043] font-sans mt-2 leading-relaxed">
            Dial in perfect extraction at home. Select your brewing apparatus, calculate exact water-to-coffee ratios, and follow our live timed pour steps calibrated on Russian Hill.
          </p>
        </div>

        {/* Method Selection Tabs */}
        <div id="brew-method-tabs" className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 sm:gap-3 no-scrollbar">
          {BREW_GUIDES.map((guide) => {
            const isSelected = guide.id === selectedMethodId;
            return (
              <button
                id={`btn-brew-method-${guide.id}`}
                key={guide.id}
                onClick={() => setSelectedMethodId(guide.id)}
                className={`min-h-[46px] px-5 py-2.5 rounded-full flex items-center gap-2.5 text-xs font-sans uppercase tracking-widest whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#6F4E37] text-white font-bold border-[#6F4E37] shadow-md shadow-[#6F4E37]/15'
                    : 'bg-[#F2EDE4] text-[#5C5043] hover:text-[#2C1B10] border-[#D4A373]/30 hover:border-[#D4A373]'
                }`}
              >
                {getMethodIcon(guide.iconName)}
                <span>{guide.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Apparatus Spotlight & Ratio Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Dynamic Ratio & Dose Calculator (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAF7F2] rounded-[32px] p-6 sm:p-8 border border-[#D4A373]/25 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#D4A373] font-bold block mb-1">
                Precision Calibration
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1B10]">
                {activeGuide.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5043] font-sans mt-1 leading-relaxed">
                {activeGuide.description}
              </p>
            </div>

            {/* Dose Slider */}
            <div className="space-y-2 bg-[#F2EDE4] p-4 sm:p-5 rounded-[24px] border border-[#D4A373]/20">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="font-bold uppercase tracking-wider text-[#5C5043]">
                  Dry Coffee Dose:
                </span>
                <span className="font-serif font-bold text-lg text-[#2C1B10]">
                  {coffeeGrams} grams
                </span>
              </div>
              <input
                id="brew-dose-slider"
                type="range"
                min="12"
                max="60"
                step="1"
                value={coffeeGrams}
                onChange={(e) => setCoffeeGrams(Number(e.target.value))}
                className="w-full accent-[#6F4E37] cursor-pointer h-2 bg-[#E9E1D6] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-sans text-[#8C7851]">
                <span>12g (Single Cup)</span>
                <span>30g (Chemex Server)</span>
                <span>60g (Batch Toddy)</span>
              </div>
            </div>

            {/* Ratio Slider */}
            <div className="space-y-2 bg-[#F2EDE4] p-4 sm:p-5 rounded-[24px] border border-[#D4A373]/20">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="font-bold uppercase tracking-wider text-[#5C5043]">
                  Brew Ratio:
                </span>
                <span className="font-serif font-bold text-lg text-[#2C1B10]">
                  1 : {customRatio}
                </span>
              </div>
              <input
                id="brew-ratio-slider"
                type="range"
                min="6"
                max="18"
                step="1"
                value={customRatio}
                onChange={(e) => setCustomRatio(Number(e.target.value))}
                className="w-full accent-[#6F4E37] cursor-pointer h-2 bg-[#E9E1D6] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-sans text-[#8C7851]">
                <span>1:8 (Cold Brew)</span>
                <span>1:14 (Rich Bodied)</span>
                <span>1:16 (Golden Cup)</span>
              </div>
            </div>

            {/* Real-time Calculated Recipe Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#F2EDE4] rounded-2xl border border-[#D4A373]/20 flex flex-col">
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7851] font-bold">
                  Total Water
                </span>
                <span className="font-serif text-lg font-bold text-[#2C1B10]">
                  {totalWaterGrams}g
                </span>
                <span className="text-[10px] text-[#5C5043]">~{approximateCups} cups</span>
              </div>

              <div className="p-3.5 bg-[#F2EDE4] rounded-2xl border border-[#D4A373]/20 flex flex-col">
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7851] font-bold">
                  Bloom Stage
                </span>
                <span className="font-serif text-lg font-bold text-[#6F4E37]">
                  {bloomWaterGrams}g
                </span>
                <span className="text-[10px] text-[#5C5043]">45 sec soak</span>
              </div>

              <div className="p-3.5 bg-[#F2EDE4] rounded-2xl border border-[#D4A373]/20 flex flex-col col-span-2 sm:col-span-1">
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7851] font-bold">
                  Water Temp
                </span>
                <span className="font-serif text-base font-bold text-[#2C1B10] truncate">
                  {activeGuide.waterTemp.split(' ')[0]}
                </span>
                <span className="text-[10px] text-[#5C5043]">Filtered 93°C</span>
              </div>
            </div>

            {/* Grind Specification */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D4A373]/30 text-xs font-sans text-[#5C5043] flex items-start gap-3">
              <Droplet className="w-4 h-4 text-[#6F4E37] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2C1B10] block font-semibold uppercase tracking-wider text-[11px]">
                  Recommended Particle Size:
                </strong>
                <span>{activeGuide.grindRecommendation}</span>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Timed Stage Conductor (7 cols) */}
          <div className="lg:col-span-7 bg-[#FAF7F2] rounded-[32px] p-6 sm:p-8 border border-[#D4A373]/25 shadow-sm flex flex-col justify-between space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4A373]/20 pb-6">
              <div>
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#D4A373] font-bold block mb-1">
                  Live Pour Conductor
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1B10]">
                  Timed Extraction Guide
                </h3>
              </div>

              {/* Timer Display & Controls */}
              <div className="flex items-center gap-3">
                <div id="brew-timer-display" className="bg-[#2C1B10] text-[#FAF7F2] px-5 py-2.5 rounded-full font-mono text-2xl sm:text-3xl font-bold tracking-wider shadow-inner border border-[#D4A373]/30 min-w-[130px] text-center">
                  {formatTime(timerSeconds)}
                </div>

                <button
                  id="btn-timer-toggle"
                  onClick={handleTimerToggle}
                  className={`min-h-[46px] w-[46px] rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 ${
                    isTimerRunning
                      ? 'bg-[#8C7851] text-white hover:bg-[#6F4E37]'
                      : 'bg-[#6F4E37] text-white hover:bg-[#8C7851]'
                  }`}
                  aria-label={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
                >
                  {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <button
                  id="btn-timer-reset"
                  onClick={handleTimerReset}
                  className="min-h-[46px] w-[46px] rounded-full bg-[#F2EDE4] hover:bg-[#E9E1D6] text-[#5C5043] flex items-center justify-center transition-all border border-[#D4A373]/30"
                  aria-label="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-sans text-[#8C7851] font-semibold">
                <span>00:00 Target Start</span>
                <span>Target: {formatTime(activeGuide.totalTimeSec)}</span>
              </div>
              <div className="w-full h-3 bg-[#E9E1D6] rounded-full overflow-hidden p-0.5 border border-[#D4A373]/20">
                <div
                  className="h-full bg-gradient-to-r from-[#D4A373] to-[#6F4E37] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (timerSeconds / activeGuide.totalTimeSec) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Step-by-Step Stages List */}
            <div className="space-y-3">
              {activeGuide.steps.map((step, idx) => {
                const isActive = !isComplete && currentStepIdx === idx;
                const isPassed = !isComplete && timerSeconds > step.timeSec;

                // Scale target water proportional to current coffee grams
                const stepWaterProportion = step.waterTarget / 320;
                const scaledWater = Math.round(totalWaterGrams * Math.min(1, stepWaterProportion));

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-[20px] transition-all border ${
                      isActive
                        ? 'bg-[#F2EDE4] border-[#6F4E37] shadow-md shadow-[#6F4E37]/10'
                        : isPassed
                        ? 'bg-[#FAF7F2] border-[#D4A373]/20 opacity-70'
                        : 'bg-[#FAF7F2] border-[#D4A373]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-sans ${
                            isActive
                              ? 'bg-[#6F4E37] text-white'
                              : isPassed
                              ? 'bg-[#D4A373] text-[#2C1B10]'
                              : 'bg-[#E9E1D6] text-[#5C5043]'
                          }`}
                        >
                          {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#2C1B10]">
                          {step.label}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#6F4E37] bg-[#F2EDE4] px-2.5 py-1 rounded-full border border-[#D4A373]/30">
                          {formatTime(step.timeSec)}
                        </span>
                        <span className="text-xs font-sans font-bold text-[#8C7851]">
                          Target: ~{scaledWater}g
                        </span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C5043] font-sans pl-8 leading-relaxed">
                      {step.instruction}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Completed Alert Banner */}
            {isComplete && (
              <div className="p-4 bg-emerald-50 rounded-[20px] border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div className="text-xs font-sans">
                  <strong className="block font-bold uppercase tracking-wider text-emerald-800">
                    Extraction Complete!
                  </strong>
                  <span>
                    Your cup has reached peak extraction balance. Let it cool for two minutes to let the floral and stone fruit notes unfold.
                  </span>
                </div>
              </div>
            )}

            {/* Matched Roast Recommendation Footer */}
            {matchedRoast && (
              <div className="p-4 bg-[#F2EDE4] rounded-[24px] border border-[#D4A373]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={matchedRoast.image}
                    alt={matchedRoast.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#D4A373]/40 cursor-pointer"
                    onClick={() => onViewImageModal(matchedRoast.image, matchedRoast.name)}
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7851] font-bold block">
                      Recommended Roast Match
                    </span>
                    <strong className="font-serif text-base text-[#2C1B10] block">
                      {matchedRoast.name}
                    </strong>
                    <span className="text-xs text-[#5C5043] font-sans">
                      {matchedRoast.roastLevel} Roast • ${matchedRoast.price.toFixed(2)} (12oz)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddMatchedRoast}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-full bg-[#6F4E37] hover:bg-[#8C7851] text-white text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-md shadow-[#6F4E37]/15 flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
                >
                  {roastAdded ? (
                    <>
                      <Check className="w-4 h-4 text-[#D4A373]" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
                      <span>Order This Roast</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* The Roaster's Club Coffee Subscription Configurator */}
        <div className="bg-[#FAF7F2] rounded-[36px] p-6 sm:p-10 border border-[#D4A373]/30 shadow-lg shadow-[#6F4E37]/5 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4A373]/20 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[#D4A373] text-xs font-sans font-bold uppercase tracking-[0.3em] mb-1">
                <Sparkles className="w-4 h-4 text-[#6F4E37]" />
                <span>The Roaster's Club</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C1B10]">
                Fresh Drum Roasts Delivered on Your Schedule
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5043] font-sans mt-1 max-w-2xl leading-relaxed">
                Enjoy 15% off every shipment, complimentary Bay Area shipping on 2+ bags, and exclusive first-taste access to private micro-lot imports from Oaxaca and Yirgacheffe.
              </p>
            </div>

            <div className="bg-[#F2EDE4] px-4 py-2 rounded-2xl border border-[#D4A373]/30 self-start md:self-auto text-xs font-sans">
              <span className="text-[#8C7851] uppercase font-bold tracking-wider block text-[10px]">
                Subscriber Guarantee
              </span>
              <span className="font-serif font-bold text-[#2C1B10]">Roasted &amp; Dispatched within 24h</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Select Roast Profile */}
            <div className="bg-[#F2EDE4] p-5 rounded-[24px] border border-[#D4A373]/20 space-y-3">
              <span className="text-xs font-sans uppercase tracking-widest text-[#8C7851] font-bold block">
                1. Select Roast Profile
              </span>
              {[
                { name: 'Roaster’s Choice Micro-Lot', sub: 'Rotating single origins' },
                { name: 'Sutro Fog Light Roast', sub: 'Floral jasmine & peach' },
                { name: 'Twin Peaks Dark Roast', sub: 'Cacao, vanilla & toasted walnut' },
              ].map((r) => (
                <button
                  key={r.name}
                  onClick={() => setSubRoast(r.name)}
                  className={`w-full text-left p-3 rounded-2xl text-xs font-sans transition-all border ${
                    subRoast === r.name
                      ? 'bg-white border-[#6F4E37] shadow-sm font-bold text-[#2C1B10]'
                      : 'bg-[#FAF7F2] border-[#D4A373]/20 text-[#5C5043] hover:text-[#2C1B10]'
                  }`}
                >
                  <span className="block font-bold">{r.name}</span>
                  <span className="text-[11px] text-[#8C7851]">{r.sub}</span>
                </button>
              ))}
            </div>

            {/* Step 2: Bag Quantity */}
            <div className="bg-[#F2EDE4] p-5 rounded-[24px] border border-[#D4A373]/20 space-y-3">
              <span className="text-xs font-sans uppercase tracking-widest text-[#8C7851] font-bold block">
                2. Select Quantity
              </span>
              {[
                { count: 1, label: '1 Bag (12oz)', desc: '$18.70 / shipment' },
                { count: 2, label: '2 Bags (24oz)', desc: '$37.40 • Free SF Shipping', highlight: true },
                { count: 3, label: '3 Bags (36oz)', desc: '$56.10 • Free Shipping + Micro Sample' },
              ].map((q) => (
                <button
                  key={q.count}
                  onClick={() => setSubBags(q.count)}
                  className={`w-full text-left p-3 rounded-2xl text-xs font-sans transition-all border ${
                    subBags === q.count
                      ? 'bg-white border-[#6F4E37] shadow-sm font-bold text-[#2C1B10]'
                      : 'bg-[#FAF7F2] border-[#D4A373]/20 text-[#5C5043] hover:text-[#2C1B10]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{q.label}</span>
                    {q.highlight && (
                      <span className="text-[10px] font-sans font-bold bg-[#D4A373]/25 text-[#6F4E37] px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#8C7851]">{q.desc}</span>
                </button>
              ))}
            </div>

            {/* Step 3: Delivery Rhythm */}
            <div className="bg-[#F2EDE4] p-5 rounded-[24px] border border-[#D4A373]/20 space-y-3">
              <span className="text-xs font-sans uppercase tracking-widest text-[#8C7851] font-bold block">
                3. Delivery Frequency
              </span>
              {[
                { id: '1-week', label: 'Every Week', desc: 'Ideal for daily multi-cup households' },
                { id: '2-weeks', label: 'Every 2 Weeks', desc: 'Our most popular morning rhythm' },
                { id: '4-weeks', label: 'Every Month', desc: 'Perfect for weekend pour-over rituals' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSubFrequency(f.id as any)}
                  className={`w-full text-left p-3 rounded-2xl text-xs font-sans transition-all border ${
                    subFrequency === f.id
                      ? 'bg-white border-[#6F4E37] shadow-sm font-bold text-[#2C1B10]'
                      : 'bg-[#FAF7F2] border-[#D4A373]/20 text-[#5C5043] hover:text-[#2C1B10]'
                  }`}
                >
                  <span className="block font-bold">{f.label}</span>
                  <span className="text-[11px] text-[#8C7851]">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subscription Summary & CTA */}
          <div className="bg-[#F2EDE4] p-6 rounded-[28px] border border-[#D4A373]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-sans uppercase tracking-wider text-[#8C7851] font-bold">
                Configured Membership:
              </span>
              <div className="font-serif text-lg font-bold text-[#2C1B10]">
                {subBags} {subBags === 1 ? 'Bag' : 'Bags'} • {subRoast} •{' '}
                {subFrequency === '1-week'
                  ? 'Weekly'
                  : subFrequency === '2-weeks'
                  ? 'Bi-Weekly'
                  : 'Monthly'}
              </div>
              <span className="text-xs text-emerald-800 font-semibold">
                ✓ 15% Member Discount Applied {subBags >= 2 ? '• Free Shipping Included' : ''} • Cancel Anytime
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-[#8C7851] block font-bold">
                  Per Shipment
                </span>
                <span className="font-serif text-2xl font-bold text-[#6F4E37]">
                  ${subTotal}
                </span>
              </div>

              <button
                id="btn-join-roasters-club"
                onClick={handleAddSubscription}
                className="min-h-[48px] px-6 py-3 rounded-full bg-[#6F4E37] hover:bg-[#8C7851] text-white text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 active:scale-95 whitespace-nowrap"
              >
                {subAddedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-[#D4A373]" />
                    <span>Added to Order!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
                    <span>Join Roaster's Club</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
