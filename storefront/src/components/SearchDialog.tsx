import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const results = searchTerm.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.color.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-[#FFFFFF] w-full max-w-2xl z-10 border border-[#1A1A1A]/20 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-[#1A1A1A]/10 bg-[#ECE8E1]">
          <Search size={18} className="text-[#1A1A1A] mr-3" />
          <input
            id="site-search-input"
            type="text"
            autoFocus
            placeholder="Search archival editions, outerwear, tailoring..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-[#1A1A1A] font-serif text-base placeholder:text-[#1A1A1A]/40 placeholder:font-sans focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] p-1 ml-2 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Results */}
        <div className="p-4 max-h-[60vh] overflow-y-auto bg-[#FFFFFF]">
          <div className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-[#1A1A1A]/40 px-2 py-1 mb-2">
            {searchTerm.trim() ? `Catalog Inquiries (${results.length})` : 'Curated Key Pieces'}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-[#1A1A1A]/60 text-xs font-sans">
              No archival editions matching "{searchTerm}". Try "hoodie", "cargo", or "jacket".
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-2.5 hover:bg-[#F9F7F2] border border-transparent hover:border-[#1A1A1A]/10 transition-colors cursor-pointer group"
                >
                  <div className="w-14 h-16 bg-[#ECE8E1] overflow-hidden flex-shrink-0 border border-[#1A1A1A]/10">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-base font-serif font-normal text-[#1A1A1A] group-hover:italic transition-all">
                      {product.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-sans">
                      {product.category} • {product.color}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-sans font-semibold text-[#1A1A1A] block">
                      ${product.price}.00 USD
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A] font-medium flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Inspect <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
