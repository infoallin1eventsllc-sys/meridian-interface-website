import { Coffee, Menu as MenuIcon, BookOpen, MapPin, ShoppingBag, Clock, Sliders } from 'lucide-react';
import { ASSETS } from '../data/coffeeData';

interface HeaderProps {
  activeTab: 'home' | 'menu' | 'story' | 'locations' | 'brew';
  setActiveTab: (tab: 'home' | 'menu' | 'story' | 'locations' | 'brew') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenCupping: () => void;
}

export function Header({ activeTab, setActiveTab, cartCount, onOpenCart }: HeaderProps) {
  return (
    <>
      {/* Top Bar Announcement */}
      <div className="bg-[#2C1B10] text-[#D4A373] text-xs font-medium py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-3">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4A373] animate-pulse" />
        <span>Roasting Daily on Vallejo St. Since 2013 • Free Shipping on 2+ Bags with code <strong className="text-[#FAF7F2] tracking-normal font-bold">FOG2013</strong></span>
        <span className="hidden md:inline text-[#8C7851]">|</span>
        <span className="hidden md:inline-flex items-center gap-1 text-[#E5D3C0]">
          <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
          Café open today until 6:00 PM
        </span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#D4A373]/20 shadow-[0_2px_10px_rgba(44,27,16,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <button
            id="btn-nav-brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
            aria-label="Fog City Roasters Home"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#6F4E37]/5 p-0.5 border border-[#D4A373]/40 transition-transform group-hover:scale-105 flex-shrink-0">
              <img
                src={ASSETS.logo}
                alt="Fog City Roasters circular seal logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2C1B10] leading-tight">
                Fog City Roasters
              </span>
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#8C7851]">
                San Francisco • Est. 2013
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav id="desktop-nav-menu" className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-tab-home"
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-colors ${
                activeTab === 'home'
                  ? 'text-[#2C1B10] bg-[#F2EDE4] font-bold'
                  : 'text-[#5C5043] hover:text-[#D4A373] hover:bg-[#F2EDE4]/60'
              }`}
            >
              Home
            </button>
            <button
              id="nav-tab-menu"
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-colors ${
                activeTab === 'menu'
                  ? 'text-[#2C1B10] bg-[#F2EDE4] font-bold'
                  : 'text-[#5C5043] hover:text-[#D4A373] hover:bg-[#F2EDE4]/60'
              }`}
            >
              Artisan Menu
            </button>
            <button
              id="nav-tab-brew"
              onClick={() => setActiveTab('brew')}
              className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-colors ${
                activeTab === 'brew'
                  ? 'text-[#2C1B10] bg-[#F2EDE4] font-bold'
                  : 'text-[#5C5043] hover:text-[#D4A373] hover:bg-[#F2EDE4]/60'
              }`}
            >
              Brew Lab
            </button>
            <button
              id="nav-tab-story"
              onClick={() => setActiveTab('story')}
              className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-colors ${
                activeTab === 'story'
                  ? 'text-[#2C1B10] bg-[#F2EDE4] font-bold'
                  : 'text-[#5C5043] hover:text-[#D4A373] hover:bg-[#F2EDE4]/60'
              }`}
            >
              Our Story
            </button>
            <button
              id="nav-tab-locations"
              onClick={() => setActiveTab('locations')}
              className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-colors ${
                activeTab === 'locations'
                  ? 'text-[#2C1B10] bg-[#F2EDE4] font-bold'
                  : 'text-[#5C5043] hover:text-[#D4A373] hover:bg-[#F2EDE4]/60'
              }`}
            >
              Locations &amp; Cuppings
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="btn-header-open-cart"
              onClick={onOpenCart}
              className="relative min-h-[42px] px-5 sm:px-6 py-2 rounded-full bg-[#6F4E37] hover:bg-[#8C7851] text-white text-xs font-sans font-bold tracking-widest uppercase transition-all shadow-lg shadow-[#6F4E37]/15 flex items-center gap-2 active:scale-95"
              aria-label="View Order Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
              <span className="hidden sm:inline">Order Ahead</span>
              <span className="sm:hidden">Order</span>
              {cartCount > 0 && (
                <span id="header-cart-badge" className="bg-[#D4A373] text-[#2C1B10] font-bold text-[11px] px-2 py-0.5 rounded-full ml-1 animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Historic Roaster Avatar */}
            <div className="hidden sm:flex items-center">
              <img
                src={ASSETS.profile}
                alt="Roastmaster Marco"
                className="w-9 h-9 rounded-full object-cover border border-[#D4A373]/40"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xl border-t border-[#D4A373]/20 shadow-[0_-4px_16px_rgba(44,27,16,0.06)] pb-safe"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 items-center h-16 px-1">
          <button
            id="mobile-nav-home"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center min-h-[44px] h-full gap-1 transition-colors ${
              activeTab === 'home' ? 'text-[#2C1B10] font-bold' : 'text-[#5C5043]'
            }`}
          >
            <Coffee className={`w-5 h-5 ${activeTab === 'home' ? 'text-[#6F4E37]' : ''}`} />
            <span className="text-[10px] tracking-wide">Home</span>
          </button>
          <button
            id="mobile-nav-menu"
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center justify-center min-h-[44px] h-full gap-1 transition-colors ${
              activeTab === 'menu' ? 'text-[#2C1B10] font-bold' : 'text-[#5C5043]'
            }`}
          >
            <MenuIcon className={`w-5 h-5 ${activeTab === 'menu' ? 'text-[#6F4E37]' : ''}`} />
            <span className="text-[10px] tracking-wide">Menu</span>
          </button>
          <button
            id="mobile-nav-brew"
            onClick={() => setActiveTab('brew')}
            className={`flex flex-col items-center justify-center min-h-[44px] h-full gap-1 transition-colors ${
              activeTab === 'brew' ? 'text-[#2C1B10] font-bold' : 'text-[#5C5043]'
            }`}
          >
            <Sliders className={`w-5 h-5 ${activeTab === 'brew' ? 'text-[#6F4E37]' : ''}`} />
            <span className="text-[10px] tracking-wide">Brew Lab</span>
          </button>
          <button
            id="mobile-nav-story"
            onClick={() => setActiveTab('story')}
            className={`flex flex-col items-center justify-center min-h-[44px] h-full gap-1 transition-colors ${
              activeTab === 'story' ? 'text-[#2C1B10] font-bold' : 'text-[#5C5043]'
            }`}
          >
            <BookOpen className={`w-5 h-5 ${activeTab === 'story' ? 'text-[#6F4E37]' : ''}`} />
            <span className="text-[10px] tracking-wide">Story</span>
          </button>
          <button
            id="mobile-nav-locations"
            onClick={() => setActiveTab('locations')}
            className={`flex flex-col items-center justify-center min-h-[44px] h-full gap-1 transition-colors ${
              activeTab === 'locations' ? 'text-[#2C1B10] font-bold' : 'text-[#5C5043]'
            }`}
          >
            <MapPin className={`w-5 h-5 ${activeTab === 'locations' ? 'text-[#6F4E37]' : ''}`} />
            <span className="text-[10px] tracking-wide">Cafés</span>
          </button>
        </div>
      </nav>
    </>
  );
}
