/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RoastShowcase } from './components/RoastShowcase';
import { SfRitual } from './components/SfRitual';
import { PromoGallery } from './components/PromoGallery';
import { MenuView } from './components/MenuView';
import { BrewLabView } from './components/BrewLabView';
import { StoryView } from './components/StoryView';
import { LocationsView } from './components/LocationsView';
import { OrderModal } from './components/OrderModal';
import { CuppingModal } from './components/CuppingModal';
import { ImageModal } from './components/ImageModal';
import { Footer } from './components/Footer';
import { CartItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'story' | 'locations' | 'brew'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCuppingOpen, setIsCuppingOpen] = useState(false);
  const [inspectImage, setInspectImage] = useState<{
    isOpen: boolean;
    src: string;
    title: string;
  }>({
    isOpen: false,
    src: '',
    title: '',
  });

  // Scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Cart operations
  const handleAddToCart = (item: {
    title: string;
    price: number;
    grind?: string;
    quantity?: number;
    image?: string;
    isBean?: boolean;
    isSubscription?: boolean;
    frequency?: string;
  }) => {
    const qty = item.quantity || 1;
    const existingIndex = cart.findIndex(
      (c) =>
        c.title === item.title &&
        c.grind === item.grind &&
        c.isSubscription === item.isSubscription
    );

    if (existingIndex > -1) {
      setCart((prev) => {
        const next = [...prev];
        next[existingIndex].quantity += qty;
        return next;
      });
    } else {
      const newItem: CartItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: item.title,
        price: item.price,
        grind: item.grind,
        quantity: qty,
        image: item.image,
        isBean: item.isBean ?? false,
        isSubscription: item.isSubscription ?? false,
        frequency: item.frequency,
      };
      setCart((prev) => [...prev, newItem]);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleViewImageModal = (src: string, title: string) => {
    setInspectImage({
      isOpen: true,
      src,
      title,
    });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4A3728] flex flex-col selection:bg-[#D4A373] selection:text-[#2C1B10]">
      {/* Sticky Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCupping={() => setIsCuppingOpen(true)}
      />

      {/* Main Content Sections Based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Hero Section with clear, vibrant photography and narrative */}
            <HeroSection
              onExploreMenu={() => setActiveTab('menu')}
              onFindCafe={() => setActiveTab('locations')}
              onOrderAhead={() => setIsCartOpen(true)}
              onViewImageModal={handleViewImageModal}
            />

            {/* Today's Drum Roast Showcase (Batch #849) */}
            <RoastShowcase
              onAddToCart={handleAddToCart}
              onViewImageModal={handleViewImageModal}
            />

            {/* The SF Ritual Section */}
            <SfRitual
              onViewImageModal={handleViewImageModal}
              onExploreMenu={() => setActiveTab('menu')}
            />

            {/* Dedicated Promotional Coffee Gallery (Promoting the brand with clear, vibrant images) */}
            <PromoGallery onViewImageModal={handleViewImageModal} />
          </>
        )}

        {activeTab === 'menu' && (
          <MenuView
            onAddToCart={handleAddToCart}
            onViewImageModal={handleViewImageModal}
          />
        )}

        {activeTab === 'brew' && (
          <BrewLabView
            onAddToCart={handleAddToCart}
            onViewImageModal={handleViewImageModal}
          />
        )}

        {activeTab === 'story' && (
          <StoryView
            onOpenCupping={() => setIsCuppingOpen(true)}
            onViewImageModal={handleViewImageModal}
          />
        )}

        {activeTab === 'locations' && (
          <LocationsView
            onOpenCupping={() => setIsCuppingOpen(true)}
            onViewImageModal={handleViewImageModal}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenCupping={() => setIsCuppingOpen(true)}
      />

      {/* Order Ahead Cart Drawer Modal */}
      <OrderModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Thursday Cupping Reservation Modal */}
      <CuppingModal
        isOpen={isCuppingOpen}
        onClose={() => setIsCuppingOpen(false)}
      />

      {/* High-Resolution Image Lightbox / Zoom Inspector */}
      <ImageModal
        isOpen={inspectImage.isOpen}
        onClose={() => setInspectImage({ isOpen: false, src: '', title: '' })}
        imageSrc={inspectImage.src}
        title={inspectImage.title}
      />
    </div>
  );
}
