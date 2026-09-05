import React, { useState } from 'react';
import { Minus, Plus, Trash2, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount) : 0;
  const finalTotal = subtotal - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'MODERN10' || cleanCode === 'URBAN10') {
      setAppliedDiscount(0.10);
      setPromoMessage({ text: '10% promotional discount applied!', isError: false });
    } else if (cleanCode === 'STREET20') {
      setAppliedDiscount(0.20);
      setPromoMessage({ text: '20% VIP street drop discount applied!', isError: false });
    } else {
      setPromoMessage({ text: 'Invalid promo code. Try "MODERN10"', isError: true });
    }
  };

  return (
    <main className="flex-grow pt-[120px] pb-16 md:pb-28 px-5 md:px-16 max-w-[1280px] mx-auto w-full min-h-[75vh]">
      {/* Page Title & Item Count */}
      <div className="mb-10 md:mb-12 border-b border-[#1A1A1A]/10 pb-6">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#1A1A1A]/50 block mb-1">
          Editorial Requisition
        </span>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-[#1A1A1A] tracking-tight">
            Your <span className="italic">Curated Bag</span>
          </h1>
        </div>
        <p className="font-sans text-xs uppercase tracking-widest text-[#1A1A1A]/60 mt-2 font-medium">
          {totalItemsCount} {totalItemsCount === 1 ? 'edition' : 'editions'} selected
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-white border border-[#1A1A1A]/10 p-10 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#ECE8E1] flex items-center justify-center text-[#1A1A1A] mb-6">
            <ShoppingBag size={24} />
          </div>
          <h2 className="font-serif text-2xl font-normal text-[#1A1A1A] mb-2">
            Your bag is empty
          </h2>
          <p className="font-sans text-[#1A1A1A]/70 text-xs max-w-sm mb-8 leading-relaxed">
            Explore the latest seasonal capsules, architectural silhouettes, and curated streetwear essentials.
          </p>
          <button
            id="empty-cart-continue-shopping-btn"
            onClick={onContinueShopping}
            className="h-13 px-8 bg-[#1A1A1A] text-[#F9F7F2] font-sans font-semibold text-xs uppercase tracking-[0.25em] hover:bg-[#333] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="md:col-span-8 flex flex-col">
            {items.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="flex flex-col sm:flex-row gap-6 border-b border-[#1A1A1A]/10 pb-8 mb-8 transition-all bg-[#FFFFFF] p-5 border border-[#1A1A1A]/5"
              >
                {/* Item Thumbnail */}
                <div className="w-full sm:w-40 sm:min-w-[160px] aspect-[3/4] bg-[#ECE8E1] overflow-hidden relative flex items-center justify-center border border-[#1A1A1A]/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Details & Controls */}
                <div className="flex-grow flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#1A1A1A]/40 block mb-1">
                          Drop Edition
                        </span>
                        <h3 className="font-serif text-lg font-medium text-[#1A1A1A] leading-snug">
                          {item.name}
                        </h3>
                        <p className="font-sans text-xs text-[#1A1A1A]/60 mt-1 uppercase tracking-wider">
                          Color: {item.color}
                        </p>
                        <p className="font-sans text-xs text-[#1A1A1A]/60 uppercase tracking-wider">
                          Size: {item.size}
                        </p>
                      </div>
                      <p className="font-sans font-semibold text-sm text-[#1A1A1A] tracking-wider whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)} USD
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove Action */}
                  <div className="flex items-center justify-between mt-6 pt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#1A1A1A]/20 h-10 w-28 bg-[#FFFFFF]">
                      <button
                        id={`decrease-qty-${item.id}`}
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="w-9 h-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#ECE8E1] disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        id={`input-qty-${item.id}`}
                        aria-label={`Quantity for ${item.name}`}
                        className="w-full h-full border-0 text-center font-sans font-semibold text-xs text-[#1A1A1A] p-0 bg-transparent focus:ring-0 focus:outline-none"
                        min="1"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val >= 1) {
                            onUpdateQuantity(item.id, val);
                          }
                        }}
                      />
                      <button
                        id={`increase-qty-${item.id}`}
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#ECE8E1] transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      id={`remove-item-${item.id}`}
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors flex items-center gap-1.5 font-sans font-medium text-[10px] uppercase tracking-[0.2em] cursor-pointer"
                    >
                      <Trash2 size={15} strokeWidth={1.75} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Back to Shopping Quick Link */}
            <div className="pt-2">
              <button
                id="cart-back-to-shop-link"
                onClick={onContinueShopping}
                className="inline-flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-[0.2em] text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                Continue exploring catalog
              </button>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="md:col-span-4 mt-6 md:mt-0">
            <div className="bg-[#FFFFFF] p-6 md:p-8 border border-[#1A1A1A]/10 sticky top-[120px] shadow-[0_4px_24px_rgba(26,26,26,0.04)]">
              <h2 className="font-serif text-2xl font-normal text-[#1A1A1A] mb-6 tracking-tight">
                Order <span className="italic">Summary</span>
              </h2>

              <div className="space-y-4 font-sans text-xs text-[#1A1A1A]">
                <div className="flex justify-between items-center">
                  <span className="text-[#1A1A1A]/60 uppercase tracking-wider">Subtotal</span>
                  <span className="font-semibold text-[#1A1A1A] tracking-wider">${subtotal.toFixed(2)} USD</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between items-center text-[#1A1A1A]">
                    <span className="uppercase tracking-wider">Editorial Privilege ({(appliedDiscount * 100)}%)</span>
                    <span className="font-semibold">-${discountAmount.toFixed(2)} USD</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-[#1A1A1A]/60 uppercase tracking-wider">Shipping</span>
                  <span className="font-medium text-[#1A1A1A]/80">Calculated at checkout</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#1A1A1A]/60 uppercase tracking-wider">Taxes & Duties</span>
                  <span className="font-medium text-[#1A1A1A]/80">Included / Flat</span>
                </div>

                <div className="border-t border-[#1A1A1A]/10 pt-4 mt-6 flex justify-between items-baseline">
                  <span className="font-serif text-lg font-normal text-[#1A1A1A]">Total</span>
                  <span className="font-sans text-xl font-bold text-[#1A1A1A] tracking-wider">
                    ${finalTotal.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="mt-6 pt-5 border-t border-[#1A1A1A]/10">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      id="promo-code-input"
                      type="text"
                      placeholder="PROMO CODE"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full h-11 px-3 bg-[#F9F7F2] border border-[#1A1A1A]/20 text-xs uppercase font-sans font-medium tracking-widest text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                  <button
                    id="apply-promo-btn"
                    type="submit"
                    className="h-11 px-4 bg-[#1A1A1A] text-[#F9F7F2] text-[10px] font-sans font-bold uppercase tracking-[0.2em] hover:bg-[#333] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-xs mt-2 font-medium ${promoMessage.isError ? 'text-[#ba1a1a]' : 'text-[#1A1A1A]'}`}>
                    {promoMessage.text}
                  </p>
                )}
                {!appliedDiscount && (
                  <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 mt-2 flex items-center gap-1">
                    <Tag size={11} />
                    <span>Editorial Code: <strong>MODERN10</strong></span>
                  </p>
                )}
              </form>

              {/* Checkout Button */}
              <button
                id="proceed-to-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full h-13 mt-6 bg-[#1A1A1A] text-[#F9F7F2] font-sans font-semibold text-xs uppercase tracking-[0.25em] hover:bg-[#333] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-[#1A1A1A]/50">
                <ShieldCheck size={14} />
                <p className="font-sans text-[11px] uppercase tracking-wider text-center">
                  Demonstration checkout — no payment is taken
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
