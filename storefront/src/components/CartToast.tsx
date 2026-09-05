import React from 'react';
import { Check, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { CartItem } from '../types';

interface CartToastProps {
  item: CartItem | null;
  onViewCart: () => void;
  onClose: () => void;
}

export const CartToast: React.FC<CartToastProps> = ({ item, onViewCart, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#1A1A1A] text-[#F9F7F2] p-4 shadow-2xl border border-[#1A1A1A]/80 flex items-center gap-3 animate-slideUp">
      <div className="w-12 h-14 bg-[#2A2A2A] overflow-hidden flex-shrink-0 border border-[#F9F7F2]/10">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-1 text-[9px] font-bold text-[#F9F7F2]/60 uppercase tracking-[0.25em] font-sans mb-0.5">
          <Check size={11} />
          <span>Piece Reserved</span>
        </div>
        <p className="text-xs font-serif font-normal truncate text-[#F9F7F2]">{item.name}</p>
        <p className="text-[10px] font-sans text-[#F9F7F2]/50">
          {item.color} • Sz {item.size} • ${item.price}.00 USD
        </p>
      </div>

      <div className="flex flex-col gap-1.5 items-end">
        <button
          onClick={onClose}
          className="text-[#F9F7F2]/40 hover:text-[#F9F7F2] transition-colors p-0.5 cursor-pointer"
        >
          <X size={14} />
        </button>
        <button
          onClick={onViewCart}
          className="bg-[#F9F7F2] hover:bg-[#ECE8E1] text-[#1A1A1A] text-[9px] font-sans font-semibold uppercase tracking-[0.2em] px-2.5 py-1 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Bag</span>
          <ArrowRight size={10} />
        </button>
      </div>
    </div>
  );
};
