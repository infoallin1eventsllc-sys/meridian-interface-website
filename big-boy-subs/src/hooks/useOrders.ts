import { useState, useEffect } from 'react';
import { ActiveOrder, PastOrder, OrderStage, CartItem } from '../types';
import { INITIAL_PAST_ORDERS } from '../data/mockData';

const PAST_ORDERS_STORAGE_KEY = 'bigboy_subs_past_orders';
const ACTIVE_ORDER_STORAGE_KEY = 'bigboy_subs_active_order';

export function useOrders() {
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_ORDER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const [pastOrders, setPastOrders] = useState<PastOrder[]>(() => {
    try {
      const saved = localStorage.getItem(PAST_ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return INITIAL_PAST_ORDERS;
  });

  // Sync active order
  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem(ACTIVE_ORDER_STORAGE_KEY, JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem(ACTIVE_ORDER_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }, [activeOrder]);

  // Sync past orders
  useEffect(() => {
    try {
      localStorage.setItem(PAST_ORDERS_STORAGE_KEY, JSON.stringify(pastOrders));
    } catch {
      // Ignore
    }
  }, [pastOrders]);

  const placeOrder = (order: ActiveOrder) => {
    setActiveOrder(order);

    const pastEntry: PastOrder = {
      id: `past-${order.orderNumber}-${Date.now()}`,
      orderNumber: order.orderNumber,
      date: 'Today',
      fulfillment: order.fulfillment,
      locationName: order.location.name,
      items: order.items,
      total: order.totalPaid,
    };
    setPastOrders((prev) => [pastEntry, ...prev]);
  };

  const advanceStage = (newStage: OrderStage) => {
    if (activeOrder) {
      setActiveOrder({
        ...activeOrder,
        stage: newStage,
      });
    }
  };

  const clearActiveOrder = () => {
    setActiveOrder(null);
  };

  return {
    activeOrder,
    pastOrders,
    placeOrder,
    advanceStage,
    clearActiveOrder,
    setActiveOrder,
  };
}
