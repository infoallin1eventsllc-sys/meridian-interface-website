import React, { useState } from 'react';
import { CartItem, StoreLocation, ActiveOrder } from '../types';

interface MyBagDrawerProps {
  cart: CartItem[];
  selectedLocation: StoreLocation;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onBrowseMenu: () => void;
  onOrderPlaced: (order: ActiveOrder) => void;
  onAddComboSide: () => void;
}

export const MyBagDrawer: React.FC<MyBagDrawerProps> = ({
  cart,
  selectedLocation,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBrowseMenu,
  onOrderPlaced,
  onAddComboSide,
}) => {
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryBeach, setDeliveryBeach] = useState('Lovers Point Park & Beach');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [scheduleType, setScheduleType] = useState<'asap' | 'later'>('asap');
  const [scheduledTime, setScheduledTime] = useState('12:30 PM');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'google_pay' | 'card' | 'counter'>('apple_pay');

  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoFeedback, setPromoFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [tipPercentage, setTipPercentage] = useState<number>(18);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Totals calculation
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = fulfillment === 'delivery' ? 3.5 : 0;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const salesTax = taxableSubtotal * 0.0875;
  const tipAmount = (subtotal * tipPercentage) / 100;
  const finalTotal = taxableSubtotal + salesTax + deliveryFee + tipAmount;

  // Check if cart has a sub
  const hasSubInCart = cart.some((item) => item.type === 'sub');
  const hasChipsOrDrink = cart.some((item) => item.productId === 'side-1' || item.productId === 'side-3');

  const timeSlots = [
    '11:45 AM',
    '12:15 PM',
    '12:45 PM',
    '1:15 PM',
    '1:45 PM',
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
  ];

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoFeedback({ type: 'error', text: 'Please enter a promo code.' });
      return;
    }
    if (code === 'MONTEREY10') {
      const discount = subtotal * 0.1;
      setDiscountAmount(discount);
      setAppliedPromo('MONTEREY10 (10% Off)');
      setPromoFeedback({ type: 'success', text: `Success! 10% ($${discount.toFixed(2)}) applied to your subtotal.` });
      setPromoCode('');
    } else if (code === 'LOVERSPOINT' || code === 'SHORE') {
      setDiscountAmount(5.0);
      setAppliedPromo(`${code} ($5.00 Off)`);
      setPromoFeedback({ type: 'success', text: `Success! $5.00 discount applied to your bag.` });
      setPromoCode('');
    } else {
      setPromoFeedback({
        type: 'error',
        text: 'Code not recognized. Try MONTEREY10 for 10% off or SHORE for $5 off.',
      });
    }
  };

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsPlacingOrder(false);
      const now = new Date();
      now.setMinutes(now.getMinutes() + 15);
      const timeStr =
        scheduleType === 'asap'
          ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : scheduledTime;

      const orderNumber = Math.floor(100 + Math.random() * 900);

      const newOrder: ActiveOrder = {
        orderNumber,
        createdAt: new Date().toLocaleDateString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        estimatedPickupTime: timeStr,
        estimatedMinutes: scheduleType === 'asap' ? 15 : 30,
        stage: 'received',
        fulfillment,
        location: selectedLocation,
        deliveryBeach: fulfillment === 'delivery' ? deliveryBeach : undefined,
        deliveryNotes: fulfillment === 'delivery' && deliveryNotes ? deliveryNotes : undefined,
        items: [...cart],
        subtotal,
        discountAmount,
        tax: salesTax,
        tip: tipAmount,
        totalPaid: finalTotal,
        paymentMethod,
        scheduledTime: scheduleType === 'asap' ? 'ASAP (~15 mins)' : `Scheduled for ${scheduledTime}`,
      };

      onOrderPlaced(newOrder);
      onClearCart();
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-margin-mobile pt-3 pb-32 gap-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Review & Order
          </p>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Your Deli Bag
          </h1>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-slate-400 hover:text-slate-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Empty State */}
      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-xs border border-slate-200/80 flex flex-col items-center text-center gap-4 my-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined text-[24px]">shopping_basket</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-slate-900">
              Your bag is currently empty
            </h3>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Craving our Monterey deli subs or official coastal merchandise? Explore our fresh menu.
            </p>
          </div>
          <button
            type="button"
            onClick={onBrowseMenu}
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-medium flex items-center gap-2 shadow-xs hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
            <span>Explore The Menu</span>
          </button>
        </div>
      ) : (
        <>
          {/* Fulfillment & Scheduling Switcher */}
          <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/80 flex flex-col gap-3">
            {/* Pickup / Beach Delivery Switcher */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
              <button
                type="button"
                onClick={() => setFulfillment('pickup')}
                className={`py-2 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  fulfillment === 'pickup'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                <span>Pickup Counter</span>
              </button>
              <button
                type="button"
                onClick={() => setFulfillment('delivery')}
                className={`py-2 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  fulfillment === 'delivery'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">moped</span>
                <span>Beach Delivery</span>
              </button>
            </div>

            {/* Time Scheduling: ASAP vs Scheduled Time Picker */}
            <div className="pt-1 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-800">
                  Fulfillment Timing
                </span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md text-xs">
                  <button
                    type="button"
                    onClick={() => setScheduleType('asap')}
                    className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                      scheduleType === 'asap'
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    ASAP (~15m)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleType('later')}
                    className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                      scheduleType === 'later'
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Schedule Later
                  </button>
                </div>
              </div>

              {scheduleType === 'later' && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setScheduledTime(slot)}
                      className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] transition-all border ${
                        scheduledTime === slot
                          ? 'bg-slate-900 text-white font-medium border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location or Beach Drop Details */}
            {fulfillment === 'pickup' ? (
              <div className="flex items-center justify-between text-xs px-1 text-slate-500 border-t border-slate-100 pt-2">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-slate-400 text-[14px]">pin_drop</span>
                  {selectedLocation.address} ({selectedLocation.shortName})
                </span>
                <span className="font-medium text-slate-900">
                  {scheduleType === 'asap' ? '~15 mins' : scheduledTime}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-1 border-t border-slate-100 pt-2 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Select Beach Picnic Drop Point
                  </label>
                  <select
                    value={deliveryBeach}
                    onChange={(e) => setDeliveryBeach(e.target.value)}
                    className="w-full h-9 px-2.5 bg-slate-50 rounded-lg text-xs text-slate-900 font-medium border border-slate-200/80 outline-none"
                  >
                    <option value="Lovers Point Park & Beach">Lovers Point Park & Beach (Pacific Grove)</option>
                    <option value="San Carlos Beach (Near Breakwater)">San Carlos Beach (Near Breakwater)</option>
                    <option value="Carmel Beach (Ocean Ave Staircase)">Carmel Beach (Ocean Ave Staircase)</option>
                    <option value="Monterey Municipal Wharf #2 Beach">Monterey Municipal Wharf #2 Beach</option>
                  </select>
                </div>

                {/* Driver / Beach Drop-Off Notes */}
                <div className="flex flex-col gap-1 pt-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Courier Drop-off Notes (Umbrella color, bench, etc.)
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Under green umbrella near Lover's Point gazebo"
                    className="w-full h-8 px-2.5 bg-slate-50 rounded-lg text-xs text-slate-900 border border-slate-200/80 outline-none focus:bg-white"
                  />
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
                    {[
                      'Near green umbrella',
                      'At surf benches',
                      'Text when arriving',
                      'Picnic table #4',
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setDeliveryNotes(chip)}
                        className="shrink-0 text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/60"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Monterey Beach Combo Upgrade Banner */}
          {hasSubInCart && !hasChipsOrDrink && (
            <div className="bg-slate-900 text-white rounded-xl p-3.5 shadow-xs border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-amber-400 text-[20px] shrink-0">
                  lunch_dining
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate">
                    Monterey Beach Combo Upgrade
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    Add Dirty Chips + 24oz Craft Soda for +$3.99
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onAddComboSide}
                className="px-3 py-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 text-xs font-medium shrink-0"
              >
                + Combo ($3.99)
              </button>
            </div>
          )}

          {/* Cart Item Cards */}
          <div className="flex flex-col gap-2.5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-200/80 flex flex-col gap-2.5"
              >
                <div className="flex items-start gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-100"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>

                    {/* Customization Details */}
                    {item.customization ? (
                      <div className="text-[11px] text-slate-500 flex flex-col gap-0.5 mt-0.5">
                        <div className="flex items-center gap-1 font-medium text-slate-700">
                          <span className="capitalize">{item.customization.size} Sub</span>
                          <span>•</span>
                          <span>{item.customization.bread}</span>
                        </div>
                        {item.customization.isTheWorks ? (
                          <span className="text-slate-700 font-medium flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px] text-emerald-600">check</span>
                            Done The Big Boy Way (The Works)
                          </span>
                        ) : (
                          <span>Toppings: {item.customization.selectedToppings.join(', ') || 'Plain'}</span>
                        )}
                        {item.customization.extraCondiments.length > 0 && (
                          <span className="text-slate-500">
                            Extras: {item.customization.extraCondiments.join(', ')}
                          </span>
                        )}
                      </div>
                    ) : item.cateringDetails ? (
                      <div className="text-[11px] text-slate-500 mt-0.5 flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-700">
                          {item.cateringDetails.packageType} ({item.cateringDetails.headcount} Guests)
                        </span>
                        <span className="text-slate-500">
                          Subs: {item.cateringDetails.subChoices.join(', ')}
                        </span>
                      </div>
                    ) : item.merchSize ? (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-900">Size: {item.merchSize}</span>
                        <span className="ml-2">Limited Batch</span>
                      </div>
                    ) : null}

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 bg-slate-100 rounded-md p-0.5 border border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-xs"
                          aria-label="Decrease quantity"
                        >
                          <span className="material-symbols-outlined text-[14px]">remove</span>
                        </button>
                        <span className="text-xs font-semibold text-slate-900 px-1.5">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-xs"
                          aria-label="Increase quantity"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-200/80 flex flex-col gap-2 text-xs">
            <span className="font-semibold text-slate-900">Payment Method</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-slate-900 bg-slate-50 shadow-xs text-slate-900 font-semibold'
                    : 'border-slate-200/80 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
                <span>Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('google_pay')}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  paymentMethod === 'google_pay'
                    ? 'border-slate-900 bg-slate-50 shadow-xs text-slate-900 font-semibold'
                    : 'border-slate-200/80 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                <span>Google Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-slate-900 bg-slate-50 shadow-xs text-slate-900 font-semibold'
                    : 'border-slate-200/80 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">credit_card</span>
                <span>Visa •••• 4242</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('counter')}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  paymentMethod === 'counter'
                    ? 'border-slate-900 bg-slate-50 shadow-xs text-slate-900 font-semibold'
                    : 'border-slate-200/80 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                <span>Pay at Counter</span>
              </button>
            </div>
          </div>

          {/* Promo Code Strip */}
          <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/80 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code (e.g. MONTEREY10)"
                className="flex-1 h-9 px-3 bg-slate-50 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200/80 outline-none uppercase font-medium focus:bg-white"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="h-9 px-3.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
            {promoFeedback && (
              <div
                className={`text-xs font-medium flex items-center gap-1.5 px-2 py-1.5 rounded-md ${
                  promoFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                    : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {promoFeedback.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <span>{promoFeedback.text}</span>
              </div>
            )}
          </div>

          {/* Deli Tip Selection */}
          <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/80 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-900">
                Support The Monterey Deli Crew
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ${tipAmount.toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[15, 18, 20, 0].map((tip) => (
                <button
                  key={tip}
                  type="button"
                  onClick={() => setTipPercentage(tip)}
                  className={`py-1.5 rounded-md text-xs font-medium transition-all ${
                    tipPercentage === tip
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 border border-slate-200/60 hover:bg-slate-100'
                  }`}
                >
                  {tip === 0 ? 'None' : `${tip}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Receipt Breakdown Card */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200/80 flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center text-slate-500">
              <span>Subtotal</span>
              <span className="text-slate-900 font-medium">${subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-emerald-700">
                <span>Promotional Discount</span>
                <span className="font-medium">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            {fulfillment === 'delivery' && (
              <div className="flex justify-between items-center text-slate-500">
                <span>Coastal Delivery Fee</span>
                <span className="text-slate-900 font-medium">${deliveryFee.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-slate-500">
              <span>Estimated CA Sales Tax (8.75%)</span>
              <span className="text-slate-900 font-medium">${salesTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-500">
              <span>Crew Gratuity</span>
              <span className="text-slate-900 font-medium">${tipAmount.toFixed(2)}</span>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-semibold text-slate-900">Total</span>
              <span className="text-base font-semibold text-slate-900">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="w-full h-12 rounded-lg bg-slate-900 text-white text-xs font-medium flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all hover:bg-slate-800"
          >
            {isPlacingOrder ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                <span>Transmitting Order to Slicer...</span>
              </>
            ) : (
              <>
                <span>Place Order • ${finalTotal.toFixed(2)}</span>
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
};
