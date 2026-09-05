import React, { useState } from 'react';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { ActiveScreen } from '../types';

interface HeaderProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  cartCount: number;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  setActiveScreen,
  cartCount,
  onOpenSearch,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 md:px-16 h-22 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-[#1A1A1A]/10 transition-colors">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          id="mobile-menu-btn"
          aria-label="Toggle Navigation Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#1A1A1A] p-2 hover:opacity-70 transition-opacity"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Brand Logo & Editorial Issue Tag */}
      <div className="flex items-center space-x-12">
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-[#1A1A1A]/60">
            Issue No. 04 • Curated Drops
          </span>
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="text-2xl md:text-3xl lg:text-4xl font-black italic tracking-tighter font-serif text-[#1A1A1A] hover:opacity-90 transition-opacity text-left cursor-pointer"
          >
            Modern Street<span className="not-italic text-[#1A1A1A]/40">.</span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-8 font-sans text-xs uppercase tracking-widest font-medium pt-3">
          <button
            id="nav-new-arrivals"
            onClick={() => handleNavClick('new-arrivals')}
            className={`transition-all duration-200 cursor-pointer pb-1 ${
              activeScreen === 'new-arrivals'
                ? 'border-b border-[#1A1A1A] text-[#1A1A1A] font-bold'
                : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A] border-b border-transparent'
            }`}
          >
            New Arrivals
          </button>
          <button
            id="nav-collections"
            onClick={() => handleNavClick('collections')}
            className={`transition-all duration-200 cursor-pointer pb-1 ${
              activeScreen === 'collections'
                ? 'border-b border-[#1A1A1A] text-[#1A1A1A] font-bold'
                : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A] border-b border-transparent'
            }`}
          >
            Collections
          </button>
          <button
            id="nav-about"
            onClick={() => handleNavClick('about')}
            className={`transition-all duration-200 cursor-pointer pb-1 ${
              activeScreen === 'about'
                ? 'border-b border-[#1A1A1A] text-[#1A1A1A] font-bold'
                : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A] border-b border-transparent'
            }`}
          >
            About
          </button>
        </nav>
      </div>

      {/* Action Icons */}
      <div className="flex items-center space-x-4 md:space-x-6 pt-2">
        <button
          id="header-search-btn"
          aria-label="Search Products"
          onClick={onOpenSearch}
          className="text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors duration-200 cursor-pointer p-1.5"
        >
          <Search size={20} strokeWidth={1.75} />
        </button>

        <button
          id="header-profile-btn"
          aria-label="User Account"
          onClick={onOpenProfile}
          className="text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors duration-200 cursor-pointer p-1.5"
        >
          <User size={20} strokeWidth={1.75} />
        </button>

        <button
          id="header-cart-btn"
          aria-label="Shopping Cart"
          onClick={() => handleNavClick('cart')}
          className={`relative p-1.5 cursor-pointer transition-colors duration-200 ${
            activeScreen === 'cart' ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
          }`}
        >
          <ShoppingBag size={20} strokeWidth={activeScreen === 'cart' ? 2.2 : 1.75} />
          {cartCount > 0 && (
            <span
              id="header-cart-badge"
              className="absolute -top-1 -right-1.5 bg-[#1A1A1A] text-[#F9F7F2] text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow-sm"
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-22 left-0 w-full bg-[#F9F7F2] border-b border-[#1A1A1A]/10 px-6 py-6 md:hidden flex flex-col space-y-4 shadow-xl z-50">
          <button
            onClick={() => handleNavClick('home')}
            className="text-left font-sans uppercase tracking-widest text-xs font-semibold text-[#1A1A1A] py-2"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('new-arrivals')}
            className="text-left font-sans uppercase tracking-widest text-xs font-semibold text-[#1A1A1A] py-2"
          >
            New Arrivals
          </button>
          <button
            onClick={() => handleNavClick('collections')}
            className="text-left font-sans uppercase tracking-widest text-xs font-semibold text-[#1A1A1A] py-2"
          >
            Collections
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="text-left font-sans uppercase tracking-widest text-xs font-semibold text-[#1A1A1A] py-2"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('cart')}
            className="text-left font-sans uppercase tracking-widest text-xs font-semibold text-[#1A1A1A] py-2 flex items-center justify-between border-t border-[#1A1A1A]/10 pt-4"
          >
            <span>View Cart</span>
            <span className="bg-[#1A1A1A] text-[#F9F7F2] text-xs px-2 py-0.5 rounded-full font-bold">
              {cartCount}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
