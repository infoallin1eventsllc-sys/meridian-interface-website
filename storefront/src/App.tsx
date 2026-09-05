import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CartView } from './components/CartView';
import { CollectionsView } from './components/CollectionsView';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchDialog } from './components/SearchDialog';
import { ProfileModal } from './components/ProfileModal';
import { CampaignModal } from './components/CampaignModal';
import { PolicyModal } from './components/PolicyModal';
import { CartToast } from './components/CartToast';
import { BuiltByMeridian } from './components/BuiltByMeridian';

import { PRODUCTS, INITIAL_CART_ITEMS, EDITORIAL_CAMPAIGNS } from './data/products';
import { Product, CartItem, EditorialCampaign, ActiveScreen } from './types';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<EditorialCampaign | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [policyModalName, setPolicyModalName] = useState<string | null>(null);
  const [lastAddedToast, setLastAddedToast] = useState<CartItem | null>(null);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Cart Handlers
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (
    product: Product,
    size: string,
    color: string,
    quantity: number = 1
  ) => {
    const lineId = `${product.id}-${color}-${size}`;
    const newItem: CartItem = {
      id: lineId,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color,
      size,
      quantity,
    };

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === lineId);
      if (existing) {
        return prev.map((item) =>
          item.id === lineId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [newItem, ...prev];
    });

    setLastAddedToast(newItem);
    setTimeout(() => {
      setLastAddedToast((curr) => (curr?.id === lineId ? null : curr));
    }, 4000);
  };

  const handleQuickAddToCart = (product: Product) => {
    handleAddToCart(product, product.size || product.availableSizes[0], product.color || product.availableColors[0], 1);
  };

  const handleOrderCompleted = () => {
    setCartItems([]);
    setActiveScreen('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#F9F7F2]">
      {/* Top Header */}
      <Header
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        cartCount={totalCartCount}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Screen Router */}
      <div className="flex-grow flex flex-col">
        {activeScreen === 'home' && (
          <HomeView
            products={PRODUCTS}
            campaigns={EDITORIAL_CAMPAIGNS}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onQuickAddToCart={handleQuickAddToCart}
            onViewAllProducts={() => {
              setActiveScreen('collections');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreCampaign={(camp) => setSelectedCampaign(camp)}
          />
        )}

        {activeScreen === 'cart' && (
          <CartView
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProceedToCheckout={() => setIsCheckoutOpen(true)}
            onContinueShopping={() => {
              setActiveScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeScreen === 'new-arrivals' && (
          <CollectionsView
            products={PRODUCTS.filter((p) => p.isNewArrival)}
            campaigns={EDITORIAL_CAMPAIGNS}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onQuickAddToCart={handleQuickAddToCart}
            onExploreCampaign={(camp) => setSelectedCampaign(camp)}
            initialCategory="All"
          />
        )}

        {activeScreen === 'collections' && (
          <CollectionsView
            products={PRODUCTS}
            campaigns={EDITORIAL_CAMPAIGNS}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onQuickAddToCart={handleQuickAddToCart}
            onExploreCampaign={(camp) => setSelectedCampaign(camp)}
            initialCategory="All"
          />
        )}

        {activeScreen === 'about' && <AboutView />}
      </div>

      {/* Footer matching specifications */}
      <Footer onNavigatePolicy={(name) => setPolicyModalName(name)} />

      <BuiltByMeridian
        tone="dark"
        note="MODERN_STREET is a fictional label. The storefront around it is real software — catalogue, filtering, search, product detail, cart, promo codes and checkout all work. Nothing is charged and no order is placed."
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setIsSearchOpen(false);
        }}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Campaign Lookbook Modal */}
      <CampaignModal
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        onShopCampaign={() => {
          setSelectedCampaign(null);
          setActiveScreen('collections');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Legal & Policy Modal */}
      <PolicyModal
        policyName={policyModalName}
        onClose={() => setPolicyModalName(null)}
      />

      {/* Cart Toast Notification */}
      <CartToast
        item={lastAddedToast}
        onViewCart={() => {
          setLastAddedToast(null);
          setActiveScreen('cart');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onClose={() => setLastAddedToast(null)}
      />
    </div>
  );
}
