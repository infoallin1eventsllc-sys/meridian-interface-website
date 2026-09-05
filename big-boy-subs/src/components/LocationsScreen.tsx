import React, { useState } from 'react';
import { StoreLocation } from '../types';
import { MAP_PREVIEW_IMAGE } from '../data/mockData';

interface LocationsScreenProps {
  locations: StoreLocation[];
  selectedLocation: StoreLocation;
  onSelectLocation: (location: StoreLocation) => void;
  onStartOrder: () => void;
  onOpenCatering?: () => void;
}

export const LocationsScreen: React.FC<LocationsScreenProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onStartOrder,
  onOpenCatering,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePinId, setActivePinId] = useState(selectedLocation.id);

  const filtered = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.cityStateZip.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStore = (loc: StoreLocation) => {
    onSelectLocation(loc);
    setActivePinId(loc.id);
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-2xl mx-auto px-margin-mobile pt-3 gap-4">
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Monterey Peninsula
        </p>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Peninsula Shops
        </h1>
        <p className="text-xs text-slate-500">
          Fresh sliced subs by the bay from Monterey to Carmel Beach
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by street or city..."
            className="w-full h-10 pl-9 pr-4 bg-slate-50 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200/80 focus:bg-white focus:border-slate-900 outline-none transition-all"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            // Friendly simulated location update
          }}
          className="h-10 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-slate-500 text-[16px]">my_location</span>
          <span className="hidden sm:inline">Near Me</span>
        </button>
      </div>

      {/* Coastal Map Banner */}
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200/80 bg-slate-100">
        <div className="relative w-full h-44 sm:h-52">
          <img
            src={MAP_PREVIEW_IMAGE}
            alt="Monterey Bay Coastal Map"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/20" />

          {/* Map Pins */}
          <div className="absolute top-[35%] left-[28%]">
            <button
              type="button"
              onClick={() => handleSelectStore(locations[0])}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-sm transition-all ${
                activePinId === locations[0]?.id
                  ? 'bg-slate-900 text-white ring-2 ring-white scale-105'
                  : 'bg-white/95 text-slate-900 border border-slate-200 hover:bg-white'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">store</span>
              <span>Alvarado St Flagship</span>
            </button>
          </div>

          <div className="absolute top-[22%] left-[10%]">
            <button
              type="button"
              onClick={() => handleSelectStore(locations[1])}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-sm transition-all ${
                activePinId === locations[1]?.id
                  ? 'bg-slate-900 text-white ring-2 ring-white scale-105'
                  : 'bg-white/95 text-slate-900 border border-slate-200 hover:bg-white'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">store</span>
              <span>Pacific Grove</span>
            </button>
          </div>

          <div className="absolute top-[65%] left-[22%]">
            <button
              type="button"
              onClick={() => handleSelectStore(locations[2])}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-sm transition-all ${
                activePinId === locations[2]?.id
                  ? 'bg-slate-900 text-white ring-2 ring-white scale-105'
                  : 'bg-white/95 text-slate-900 border border-slate-200 hover:bg-white'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">store</span>
              <span>Carmel Beach</span>
            </button>
          </div>

          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200 text-slate-700 text-[10px] font-medium">
            Monterey Bay • 3 Locations
          </div>
        </div>
      </div>

      {/* List of Store Cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((loc) => {
          const isSelected = selectedLocation.id === loc.id;
          return (
            <article
              key={loc.id}
              className={`bg-white rounded-xl p-4 border transition-all flex flex-col gap-2.5 ${
                isSelected
                  ? 'border-slate-900 ring-1 ring-slate-900/10 shadow-xs'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-slate-900">
                      {loc.name}
                    </h2>
                    {loc.isFlagship && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        Flagship
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {loc.address}, {loc.cityStateZip}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-900">{loc.distance}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      {loc.statusText}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-medium shrink-0">
                    Selected
                  </span>
                )}
              </div>

              {/* Outdoor Patio Note */}
              <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-start gap-2 border border-slate-100">
                <span className="material-symbols-outlined text-slate-400 text-[16px] shrink-0 mt-0.5">
                  deck
                </span>
                <p className="text-[11px] leading-relaxed">{loc.patioNote}</p>
              </div>

              {/* Amenity Tags */}
              <div className="flex flex-wrap gap-1.5">
                {loc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${loc.phone.replace(/[^0-9]/g, '')}`}
                  className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px] text-slate-400">call</span>
                  <span>{loc.phone}</span>
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      `${loc.address} ${loc.cityStateZip}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px] text-slate-400">directions</span>
                    <span className="hidden sm:inline">Directions</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectLocation(loc);
                      onStartOrder();
                    }}
                    className="px-3.5 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition-all shadow-xs"
                  >
                    Order Here
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Catering Box: Clean Minimalist Accent */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-300 text-[20px]">
            celebration
          </span>
          <h3 className="text-sm font-semibold text-white">
            Aquarium Events & Beach Box Catering
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Hosting a group on the beach or visiting Cannery Row? We pack giant sub platters, chips, and sodas in our custom nautical picnic crates with 2-hour notice.
        </p>
        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenCatering}
            className="px-3.5 py-1.5 rounded-md bg-white text-slate-900 hover:bg-slate-100 text-xs font-medium transition-colors"
          >
            Inquire for Catering
          </button>
        </div>
      </div>
    </div>
  );
};
