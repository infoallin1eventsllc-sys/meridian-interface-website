import { useState, useEffect } from 'react';
import {
  TabType,
  SubMenuItem,
  StoreLocation,
  CartItem,
} from './types';
import {
  SUB_MENU_ITEMS,
  MERCH_ITEMS,
  STORE_LOCATIONS,
} from './data/mockData';
import { useCart } from './hooks/useCart';
import { useLoyalty } from './hooks/useLoyalty';
import { useFavorites } from './hooks/useFavorites';
import { useOrders } from './hooks/useOrders';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { MenuScreen } from './components/MenuScreen';
import { LocationsScreen } from './components/LocationsScreen';
import { MerchScreen } from './components/MerchScreen';
import { MyBagDrawer } from './components/MyBagDrawer';
import { SubCustomizerModal } from './components/SubCustomizerModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationModal } from './components/NotificationModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { CateringModal } from './components/CateringModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation>(
    STORE_LOCATIONS[0]
  );
  const [customizingSub, setCustomizingSub] = useState<SubMenuItem | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCateringOpen, setIsCateringOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  // Domain Hooks Layer
  const {
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
  } = useCart();

  const { punches, punchSub, resetPunches } = useLoyalty();
  const { favorites, toggleFavorite } = useFavorites();
  const { activeOrder, pastOrders, placeOrder, advanceStage } = useOrders();

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Order Placement
  const handleOrderPlaced = (order: typeof activeOrder) => {
    if (!order) return;
    placeOrder(order);
    punchSub();
    clearCart();
    setIsOrderTrackerOpen(true);
  };

  const handleReorder = (items: CartItem[]) => {
    const freshItems = items.map((it) => ({
      ...it,
      id: `${it.productId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    }));
    setCart((prev) => [...freshItems, ...prev]);
    setIsProfileOpen(false);
    setCurrentTab('my-bag');
  };

  const handleCateringAdded = (item: CartItem) => {
    addCateringToBag(item);
    setIsCateringOpen(false);
    setCurrentTab('my-bag');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col selection:bg-slate-900 selection:text-white text-slate-900 font-sans antialiased">
      {/* Fixed Top Brand Header */}
      <Header
        currentTab={currentTab}
        selectedLocation={selectedLocation}
        allLocations={STORE_LOCATIONS}
        onSelectLocation={setSelectedLocation}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
      />

      {/* Floating Active Order Status Bar (when an active order exists) */}
      {activeOrder && (
        <aside className="fixed top-16 inset-x-0 z-30 px-margin-mobile pt-1 pointer-events-none max-w-2xl mx-auto">
          <div
            onClick={() => setIsOrderTrackerOpen(true)}
            className="pointer-events-auto cursor-pointer bg-slate-900 text-white rounded-xl px-3.5 py-2 shadow-md flex items-center justify-between border border-slate-800 transition-all hover:bg-slate-800"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">
                  Order #{activeOrder.orderNumber} •{' '}
                  {activeOrder.stage === 'ready'
                    ? 'Ready for Pickup!'
                    : activeOrder.stage === 'wrapped'
                    ? 'Butcher Paper Wrapped'
                    : activeOrder.stage === 'slicing'
                    ? 'Slicing Fresh on Berkel'
                    : 'Order Received'}
                </span>
                <span className="text-[10px] text-slate-400">
                  Tap to view live kitchen progress & counter scan code
                </span>
              </div>
            </div>

            <span className="material-symbols-outlined text-[16px] text-slate-400">
              arrow_forward
            </span>
          </div>
        </aside>
      )}

      {/* Main Content Area (padded for top bar and bottom nav) */}
      <main className={`flex-1 ${activeOrder ? 'pt-28' : 'pt-20'}`}>
        {currentTab === 'home' && (
          <HomeScreen
            subs={SUB_MENU_ITEMS}
            onOpenMenu={() => setCurrentTab('menu')}
            onOpenLocations={() => setCurrentTab('locations')}
            onCustomizeSub={(sub) => setCustomizingSub(sub)}
            onQuickAddSub={(sub) => quickAddSub(sub)}
            onOpenProfile={() => setIsProfileOpen(true)}
            punches={punches}
          />
        )}

        {currentTab === 'menu' && (
          <MenuScreen
            subs={SUB_MENU_ITEMS}
            onCustomizeSub={(sub) => setCustomizingSub(sub)}
            onQuickAddSub={(sub, size) => quickAddSub(sub, size)}
            cartCount={cartCount}
            cartTotal={cartTotal}
            onGoToBag={() => setCurrentTab('my-bag')}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOpenCatering={() => setIsCateringOpen(true)}
          />
        )}

        {currentTab === 'locations' && (
          <LocationsScreen
            locations={STORE_LOCATIONS}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            onStartOrder={() => setCurrentTab('menu')}
            onOpenCatering={() => setIsCateringOpen(true)}
          />
        )}

        {currentTab === 'merch' && (
          <MerchScreen
            items={MERCH_ITEMS}
            onAddMerchToBag={addMerchToBag}
          />
        )}

        {currentTab === 'my-bag' && (
          <MyBagDrawer
            cart={cart}
            selectedLocation={selectedLocation}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onClearCart={clearCart}
            onBrowseMenu={() => setCurrentTab('menu')}
            onOrderPlaced={handleOrderPlaced}
            onAddComboSide={addComboSide}
          />
        )}
      </main>

      {/* Sub Customizer Modal Sheet */}
      {customizingSub && (
        <SubCustomizerModal
          sub={customizingSub}
          onClose={() => setCustomizingSub(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Profile & Loyalty Shore Points Modal with Order History */}
      {isProfileOpen && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          punches={punches}
          onPunchSub={punchSub}
          onResetPunches={resetPunches}
          pastOrders={pastOrders}
          onReorder={handleReorder}
        />
      )}

      {/* Counter Notifications Modal */}
      {isNotificationOpen && (
        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      )}

      {/* Live Order Tracker Modal */}
      {isOrderTrackerOpen && activeOrder && (
        <OrderTrackerModal
          isOpen={isOrderTrackerOpen}
          order={activeOrder}
          onClose={() => setIsOrderTrackerOpen(false)}
          onAdvanceStage={advanceStage}
        />
      )}

      {/* Group & Beach Picnic Catering Builder Modal */}
      {isCateringOpen && (
        <CateringModal
          isOpen={isCateringOpen}
          onClose={() => setIsCateringOpen(false)}
          onAddCateringToBag={handleCateringAdded}
        />
      )}

      {/* Bottom Fixed Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        cartItemCount={cartCount}
      />
    </div>
  );
}
