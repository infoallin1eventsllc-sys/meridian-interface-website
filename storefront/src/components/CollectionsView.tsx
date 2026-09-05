import React, { useState } from 'react';
import { Filter, Eye, Plus, ArrowRight } from 'lucide-react';
import { Product, EditorialCampaign } from '../types';

interface CollectionsViewProps {
  products: Product[];
  campaigns: EditorialCampaign[];
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onExploreCampaign: (campaign: EditorialCampaign) => void;
  initialCategory?: string;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  products,
  campaigns,
  onSelectProduct,
  onQuickAddToCart,
  onExploreCampaign,
  initialCategory = 'All',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Footwear'];

  let filtered = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <main className="flex-grow pt-[120px] pb-16 md:pb-28 px-5 md:px-16 max-w-[1280px] mx-auto w-full">
      {/* Header */}
      <div className="mb-10 border-b border-[#1A1A1A]/10 pb-6">
        <span className="text-[10px] uppercase font-sans font-bold text-[#1A1A1A]/50 tracking-[0.3em] block mb-2">
          Curated Archive • Volume IV
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-normal text-[#1A1A1A] tracking-tight">
          Collections & <span className="italic">Curations</span>
        </h1>
        <p className="font-sans text-xs md:text-sm text-[#1A1A1A]/70 mt-2 max-w-2xl leading-relaxed">
          Architectural silhouettes, raw textural contrasts, and high-density tailoring formulated for discerning metropolitan life.
        </p>
      </div>

      {/* Filter and Sorting Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-6 mb-10">
        {/* Category Chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-category-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`h-8 px-4 text-[10px] font-sans uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] text-[#F9F7F2]'
                  : 'bg-[#ECE8E1] text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#DED9D0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#1A1A1A]/60" />
          <span className="text-[10px] font-sans text-[#1A1A1A]/60 uppercase tracking-[0.2em] font-semibold">
            Order:
          </span>
          <select
            id="sort-products-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 px-3 bg-[#ECE8E1] border border-[#1A1A1A]/15 text-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          >
            <option value="featured">Editorial Priority</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-20">
        {filtered.map((product) => (
          <div
            key={product.id}
            id={`collection-item-${product.id}`}
            className="group cursor-pointer flex flex-col bg-[#FFFFFF] p-3.5 border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/40 hover:shadow-[0_12px_32px_rgba(26,26,26,0.06)] transition-all duration-300"
            onClick={() => onSelectProduct(product)}
          >
            <div className="relative w-full aspect-[3/4] bg-[#ECE8E1] mb-4 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                loading="lazy"
              />

              {product.isNewArrival && (
                <span className="absolute top-2.5 left-2.5 bg-[#1A1A1A] text-[#F9F7F2] text-[9px] uppercase font-sans tracking-[0.2em] px-2.5 py-1 font-semibold">
                  New
                </span>
              )}

              {/* Quick-action overlay */}
              <div className="absolute inset-0 bg-[#1A1A1A]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5 p-3">
                <button
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

            <div className="flex flex-col pt-1">
              <span className="text-[10px] uppercase font-sans text-[#1A1A1A]/40 tracking-[0.2em] mb-1">
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

      {/* Campaigns Lookbook Showcase */}
      <section className="border-t border-[#1A1A1A]/10 pt-16">
        <div className="mb-10">
          <span className="text-[10px] uppercase font-sans font-bold text-[#1A1A1A]/50 tracking-[0.3em] block mb-1">
            Narrative Archives
          </span>
          <h2 className="font-serif text-2xl md:text-4xl font-normal text-[#1A1A1A] tracking-tight">
            Campaign <span className="italic">Lookbooks</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              onClick={() => onExploreCampaign(camp)}
              className="bg-[#ECE8E1] border border-[#1A1A1A]/15 text-[#1A1A1A] p-8 hover:border-[#1A1A1A] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] bg-[#FFFFFF] px-2.5 py-1 font-bold">
                    {camp.badge}
                  </span>
                  <span className="text-[11px] font-sans tracking-widest text-[#1A1A1A]/50">{camp.season}</span>
                </div>
                <h3 className="font-serif text-2xl font-normal group-hover:italic transition-all mb-2">
                  {camp.title}
                </h3>
                <p className="font-sans text-xs text-[#1A1A1A]/70 mb-6 leading-relaxed">
                  {camp.description}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] pt-4 border-t border-[#1A1A1A]/10">
                <span>View Full Lookbook Narrative</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
