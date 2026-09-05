import { useState, useEffect, type FormEvent } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  ShoppingBag,
  Tag,
  Coffee,
  Copy,
  Check,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { CartItem } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export function OrderModal({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: OrderModalProps) {
  const [promoCode, setPromoCode] = useState('FOG2013');
  const [promoApplied, setPromoApplied] = useState(true);
  const [pickupTime, setPickupTime] = useState('15 mins (Ready at 1420 Vallejo)');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Close on Escape key & lock background body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.15 : 0;
  const tax = (subtotal - discount) * 0.08625; // SF local tax 8.625%
  const total = Math.max(0, subtotal - discount + tax);

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'FOG2013') {
      setPromoApplied(true);
    } else {
      setPromoApplied(false);
    }
  };

  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    setOrderNumber(String(Math.floor(100000 + Math.random() * 900000)));
    setOrderPlaced(true);
  };

  const handleReset = () => {
    setOrderPlaced(false);
    onClearCart();
    onClose();
  };

  const handleCopyOrder = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Fog City Roasters Order #${orderNumber} • ${customerName || 'Guest'} • Pickup at 1420 Vallejo St.`
      );
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    }
  };

  return (
    <div id="order-drawer-backdrop" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C1B10]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="order-drawer-panel"
          className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl border-l border-[#D4A373]/25 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#D4A373]/20 flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#6F4E37]" />
              <h2 className="font-serif text-xl font-bold text-[#2C1B10]">
                Your Roastery Order
              </h2>
            </div>
            <button
              id="btn-order-close"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F2EDE4] hover:bg-[#E9E1D6] flex items-center justify-center text-[#5C5043] transition-colors border border-[#D4A373]/20"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {orderPlaced ? (
              <div id="order-confirmed-summary" className="py-6 text-center flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm border border-emerald-200">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#2C1B10]">
                    Order Confirmed!
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xs uppercase tracking-widest text-[#6F4E37] font-bold font-mono">
                      Order #{orderNumber}
                    </span>
                    <button
                      id="btn-copy-order-confirmation"
                      onClick={handleCopyOrder}
                      className="p-1 rounded text-[#8C7851] hover:text-[#2C1B10] transition-colors"
                      title="Copy order confirmation"
                    >
                      {copiedOrder ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Digital Receipt Pass */}
                <div className="bg-[#FAF7F2] p-5 rounded-[24px] border border-[#D4A373]/30 w-full text-left text-xs font-sans text-[#5C5043] space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-[#D4A373]/20">
                    <span className="uppercase tracking-wider text-[10px] font-bold text-[#8C7851]">
                      Guest Name
                    </span>
                    <strong className="text-[#2C1B10] text-sm font-serif">
                      {customerName || 'Coffee Enthusiast'}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Estimated Ready:</span>
                    <strong className="text-[#2C1B10]">{pickupTime}</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Pickup Counter:</span>
                    <strong className="text-[#2C1B10]">1420 Vallejo St (Hyde &amp; Vallejo)</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>SMS Alert Sent To:</span>
                    <strong className="text-[#2C1B10]">{customerPhone || 'On File'}</strong>
                  </div>

                  <div className="flex justify-between items-center border-t border-[#D4A373]/20 pt-2.5">
                    <span className="font-semibold">Total Charged:</span>
                    <strong className="text-[#6F4E37] font-serif text-lg">
                      ${total.toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F2EDE4] rounded-2xl border border-[#D4A373]/25 w-full text-left flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#6F4E37] flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#5C5043] leading-relaxed">
                    Our baristas on Vallejo St. have your ticket on the espresso ledge. Simply state your name at the marble pick-up register!
                  </p>
                </div>

                <button
                  id="btn-order-finished"
                  onClick={handleReset}
                  className="w-full py-3.5 rounded-full bg-[#6F4E37] hover:bg-[#8C7851] text-white text-xs font-bold uppercase tracking-widest shadow-md active:scale-95 transition-all"
                >
                  Done &amp; Back to Roastery
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div id="order-empty-state" className="py-16 text-center flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#F2EDE4] flex items-center justify-center text-[#8C7851] border border-[#D4A373]/30">
                  <Coffee className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2C1B10]">
                  Your bag is empty
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5043] max-w-xs leading-relaxed">
                  Explore Today's Morning Drum Roasts, artisan drinks, or join the Roaster's Club subscription.
                </p>
              </div>
            ) : (
              <div id="order-items-container" className="space-y-4">
                {/* Item List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#D4A373]/25 shadow-sm flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-[#D4A373]/30"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#F2EDE4] flex items-center justify-center text-[#6F4E37] flex-shrink-0 border border-[#D4A373]/20">
                            <Coffee className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-serif font-bold text-[#2C1B10] text-sm truncate">
                            {item.title}
                          </h4>
                          {item.grind && (
                            <span className="text-[11px] text-[#8C7851] font-medium block">
                              Grind: {item.grind}
                            </span>
                          )}
                          {item.isSubscription && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-[#6F4E37] bg-[#F2EDE4] px-2 py-0.5 rounded-full border border-[#D4A373]/30 mt-0.5">
                              <Sparkles className="w-2.5 h-2.5 text-[#D4A373]" />
                              {item.frequency || 'Recurring'}
                            </span>
                          )}
                          <span className="text-xs font-semibold text-[#5C5043] block mt-0.5">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center border border-[#D4A373]/30 rounded-lg bg-[#F2EDE4]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 text-[#5C5043] hover:text-[#2C1B10]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#2C1B10]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 text-[#5C5043] hover:text-[#2C1B10]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 text-[#8C7851] hover:text-red-700 hover:bg-[#F2EDE4] rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <form id="promo-code-form" onSubmit={handleApplyPromo} className="pt-2">
                  <label
                    htmlFor="promo-code-input"
                    className="text-[11px] font-bold uppercase tracking-wider text-[#5C5043] block mb-1"
                  >
                    Promo / Welcome Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="promo-code-input"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. FOG2013"
                      className="flex-1 bg-white border border-[#D4A373]/30 rounded-xl px-3 py-2 text-xs uppercase font-bold text-[#2C1B10] focus:outline-none focus:border-[#6F4E37]"
                    />
                    <button
                      id="btn-apply-promo"
                      type="submit"
                      className="px-4 py-2 bg-[#F2EDE4] hover:bg-[#E9E1D6] text-[#2C1B10] rounded-xl text-xs font-bold uppercase tracking-wider border border-[#D4A373]/30"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1 mt-1">
                      <Tag className="w-3 h-3 text-emerald-600" /> 15% Heritage Welcome discount applied!
                    </span>
                  )}
                </form>

                {/* Pickup Window */}
                <div className="pt-2">
                  <label
                    htmlFor="pickup-window-select"
                    className="text-[11px] font-bold uppercase tracking-wider text-[#5C5043] block mb-1"
                  >
                    Pickup Window / Delivery
                  </label>
                  <select
                    id="pickup-window-select"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full bg-white border border-[#D4A373]/30 rounded-xl px-3 py-2 text-xs text-[#2C1B10] focus:outline-none focus:border-[#6F4E37]"
                  >
                    <option value="15 mins (Ready at 1420 Vallejo)">15 minutes (Quick Barista Prep)</option>
                    <option value="30 mins (Peak morning walk)">30 minutes (Morning cable car)</option>
                    <option value="45 mins (Fresh roast pack)">45 minutes</option>
                    <option value="Home Postal Delivery (Bay Area 24-hr)">Home Postal Delivery (Bay Area 24-hr)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Footer Subtotals & Checkout Button */}
          {!orderPlaced && cart.length > 0 && (
            <div id="order-checkout-section" className="p-5 bg-[#FAF7F2] border-t border-[#D4A373]/20 space-y-3">
              <div className="space-y-1.5 text-xs font-sans text-[#5C5043]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Discount (15% off)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Sales Tax (SF 8.625%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#2C1B10] border-t border-[#D4A373]/20 pt-2">
                  <span>Estimated Total</span>
                  <span className="text-[#6F4E37]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Customer quick contact */}
              <form id="checkout-customer-form" onSubmit={handleCheckout} className="space-y-2 pt-1">
                <input
                  id="checkout-name-input"
                  type="text"
                  required
                  placeholder="Your Name (for cup / bag label)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border border-[#D4A373]/30 rounded-xl px-3 py-2 text-xs text-[#2C1B10] focus:outline-none focus:border-[#6F4E37]"
                />
                <input
                  id="checkout-phone-input"
                  type="tel"
                  placeholder="Mobile # (for pickup SMS notification)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-[#D4A373]/30 rounded-xl px-3 py-2 text-xs text-[#2C1B10] focus:outline-none focus:border-[#6F4E37]"
                />

                <button
                  id="btn-confirm-checkout"
                  type="submit"
                  className="w-full min-h-[46px] py-3 rounded-full bg-[#6F4E37] hover:bg-[#8C7851] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
                  <span>Confirm Order • ${total.toFixed(2)}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
