import { useState, useEffect } from 'react';
import { CartItem, SubMenuItem, CartCustomization, SubSize, MerchItem } from '../types';

const CART_STORAGE_KEY = 'bigboy_subs_cart';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore parse failure
    }
    return [];
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Local storage full or unavailable
    }
  }, [cart]);

  const addToCart = (
    sub: SubMenuItem,
    customization: CartCustomization,
    finalPrice: number
  ) => {
    const newItem: CartItem = {
      id: `${sub.id}-${Date.now()}`,
      type: 'sub',
      productId: sub.id,
      name: sub.name,
      image: sub.image,
      price: finalPrice,
      quantity: 1,
      sizeLabel: customization.size,
      customization,
    };
    setCart((prev) => [newItem, ...prev]);
  };

  const quickAddSub = (sub: SubMenuItem, size: SubSize = 'regular') => {
    const price =
      size === 'giant'
        ? sub.giantPrice
        : size === 'mini'
        ? sub.miniPrice
        : sub.regularPrice;

    const newItem: CartItem = {
      id: `${sub.id}-${Date.now()}`,
      type: sub.category === 'sides' ? 'side' : 'sub',
      productId: sub.id,
      name: sub.name,
      image: sub.image,
      price,
      quantity: 1,
      sizeLabel: size,
      customization:
        sub.category !== 'sides'
          ? {
              size,
              bread: 'Italian Crusty Baguette',
              cheese: 'Aged Provolone',
              isTheWorks: true,
              selectedToppings: [
                'Shaved Sweet Onions',
                'Crisp Iceberg Lettuce',
                'Ripe Roma Tomatoes',
                'Red Wine Vinegar & Olive Oil ("The Juice")',
                'Oregano & Deli Spices',
              ],
              extraCondiments: [],
              cutPreference: 'Cut in Half',
            }
          : undefined,
    };
    setCart((prev) => [newItem, ...prev]);
  };

  const addComboSide = () => {
    const comboItem: CartItem = {
      id: `combo-${Date.now()}`,
      type: 'side',
      productId: 'combo-pair',
      name: 'Monterey Beach Combo (Chips + 24oz Soda + Pickle)',
      image: '',
      price: 3.99,
      quantity: 1,
    };
    setCart((prev) => [...prev, comboItem]);
  };

  const addMerchToBag = (item: MerchItem, size: string) => {
    const newItem: CartItem = {
      id: `${item.id}-${size}-${Date.now()}`,
      type: 'merch',
      productId: item.id,
      name: item.title,
      image: item.image,
      price: item.price,
      quantity: 1,
      merchSize: size,
    };
    setCart((prev) => [newItem, ...prev]);
  };

  const addCateringToBag = (item: CartItem) => {
    setCart((prev) => [item, ...prev]);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const updatedQty = item.quantity + delta;
            return updatedQty > 0 ? { ...item, quantity: updatedQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cart,
    setCart,
    addToCart,
    quickAddSub,
    addComboSide,
    addMerchToBag,
    addCateringToBag,
    updateQuantity,
    removeItem,
    clearCart,
    cartCount,
    cartTotal,
  };
}
