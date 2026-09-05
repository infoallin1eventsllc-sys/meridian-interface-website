import React from 'react';
import { ArrowRight, Sparkles, Eye, Plus } from 'lucide-react';
import { Product, EditorialCampaign } from '../types';

interface HomeViewProps {
  products: Product[];
  campaigns: EditorialCampaign[];
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onViewAllProducts: () => void;
  onExploreCampaign: (campaign: EditorialCampaign) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  campaigns,
  onSelectProduct,
  onQuickAddToCart,
  onViewAllProducts,
  onExploreCampaign,
}) => {
  // 4 curated products as shown in Image 3
  const curatedProducts = products.filter((p) => p.isCurated).slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Section with Editorial Aesthetic */}
      <section className="relative w-full h-[85vh] md:h-[92vh] bg-[#ECE8E1] mb-16 md:mb-28 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={`${import.meta.env.BASE_URL}images/products/hero.jpg`}
            alt="Urban Core 2026 editorial campaign"
            className="w-full h-full object-cover object-top scale-100 transition-transform duration-1000 ease-out brightness-[0.92]"
          />
        </div>

        {/* Hero Overlay & Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/30 flex flex-col items-center justify-end md:justify-center text-center px-5 pb-16 md:pb-0">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 border border-white/30 backdrop-blur-md bg-black/30 text-[#F9F7F2] text-[11px] font-sans uppercase tracking-[0.3em] font-medium">
              <Sparkles size={11} className="text-[#F9F7F2]" />
              Volume IV • Autumn / Winter 2026
            </span>
            <h1 className="font-serif italic text-4xl sm:text-6xl md:text-8xl text-white tracking-tight mb-2 drop-shadow-md">
              Urban Core
            </h1>
            <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.35em] text-white/90 mb-8 font-light">
              Modern Streetwear & Architectural Tailoring
            </p>
            <button
              id="hero-shop-now-btn"
              onClick={onViewAllProducts}
              className="bg-[#F9F7F2] text-[#1A1A1A] font-sans font-semibold text-xs uppercase tracking-[0.25em] h-13 px-9 hover:bg-[#1A1A1A] hover:text-[#F9F7F2] border border-[#1A1A1A]/20 transition-all duration-300 cursor-pointer shadow-lg flex items-center gap-3 group"
            >
              <span>Explore Collection</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Curated Essentials Section */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-16 mb-20 md:mb-32">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-14 border-b border-[#1A1A1A]/10 pb-6 gap-4">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#1A1A1A]/50 block mb-1">
              Curated Selection • 01
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] tracking-tight">
              Curated <span className="italic">Essentials</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#1A1A1A]/70 mt-1.5 max-w-lg">
              Precision tailored fundamentals engineered with industrial-grade resilience and understated luxury.
            </p>
          </div>
          <button
            id="curated-view-all-btn"
            onClick={onViewAllProducts}
            className="font-sans font-semibold text-xs text-[#1A1A1A] uppercase tracking-[0.2em] hover:opacity-60 transition-opacity cursor-pointer flex items-center gap-2 group whitespace-nowrap pb-1 border-b border-[#1A1A1A]"
          >
            <span>View All Products</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {curatedProducts.map((product) => (
            <div
              key={product.id}
              id={`product-card-${product.id}`}
              className="group cursor-pointer flex flex-col bg-[#FFFFFF] p-3.5 border border-[#1A1A1A]/10 transition-all duration-300 hover:border-[#1A1A1A]/40 hover:shadow-[0_12px_32px_rgba(26,26,26,0.06)]"
              onClick={() => onSelectProduct(product)}
            >
              {/* Image Frame */}
              <div className="relative w-full aspect-[3/4] bg-[#ECE8E1] mb-4 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Badge if available */}
                {product.isNewArrival && (
                  <span className="absolute top-2.5 left-2.5 bg-[#1A1A1A] text-[#F9F7F2] text-[9px] uppercase font-sans tracking-[0.2em] px-2.5 py-1 font-semibold">
                    New Entry
                  </span>
                )}

                {/* Hover Quick-Action Overlay */}
                <div className="absolute inset-0 bg-[#1A1A1A]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5 p-3">
                  <button
                    id={`quick-view-${product.id}`}
                    aria-label={`Quick view ${product.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="h-9 px-3.5 bg-[#F9F7F2] text-[#1A1A1A] text-[11px] font-semibold uppercase tracking-wider hover:bg-white flex items-center gap-1.5 shadow-sm"
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>
                  <button
                    id={`quick-add-${product.id}`}
                    aria-label={`Quick add ${product.name} to cart`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAddToCart(product);
                    }}
                    className="h-9 px-3.5 bg-[#1A1A1A] text-[#F9F7F2] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#333] flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={13} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col pt-1">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-1">
                  {product.category}
                </span>
                <h3 className="font-serif text-base font-normal text-[#1A1A1A] group-hover:italic transition-all mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <span className="font-sans font-semibold text-xs tracking-wider text-[#1A1A1A]/80">
                  ${product.price}.00 USD
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lookbook / Editorial Drop Feature Section */}
      <section className="bg-[#ECE8E1] border-y border-[#1A1A1A]/10 text-[#1A1A1A] py-18 md:py-26 mb-20 md:mb-32">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#1A1A1A]/15 pb-6">
            <div>
              <span className="text-[#1A1A1A]/60 font-sans text-xs uppercase font-bold tracking-[0.3em] block mb-2">
                Editorial Lookbook Series • Volume 12
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight">
                The 2026 <span className="italic">Campaigns</span>
              </h2>
            </div>
            <p className="font-sans text-xs md:text-sm text-[#1A1A1A]/70 max-w-md mt-4 md:mt-0 leading-relaxed">
              Each capsule represents an exploration of subcultural tension, futuristic silhouettes, and architectural form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                id={`campaign-card-${camp.id}`}
                onClick={() => onExploreCampaign(camp)}
                className="bg-[#FFFFFF] border border-[#1A1A1A]/10 p-6 hover:border-[#1A1A1A] hover:shadow-[0_8px_24px_rgba(26,26,26,0.06)] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#1A1A1A] bg-[#ECE8E1] px-2.5 py-1">
                      {camp.badge}
                    </span>
                    <span className="text-[11px] font-sans tracking-widest text-[#1A1A1A]/50">{camp.season}</span>
                  </div>
                  <h3 className="font-serif text-xl font-normal group-hover:italic transition-all mb-2 text-[#1A1A1A]">
                    {camp.title}
                  </h3>
                  <p className="font-sans text-xs text-[#1A1A1A]/70 leading-relaxed mb-6">
                    {camp.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#1A1A1A] uppercase tracking-[0.2em] pt-4 border-t border-[#1A1A1A]/10">
                  <span>Explore Capsule</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
