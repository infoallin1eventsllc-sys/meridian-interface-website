import React, { useState, useEffect } from 'react';
import { ActiveOrder, OrderStage } from '../types';

interface OrderTrackerModalProps {
  order: ActiveOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onAdvanceStage?: (newStage: OrderStage) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  isOpen,
  onClose,
  onAdvanceStage,
}) => {
  const stages: { stage: OrderStage; label: string; sublabel: string; icon: string }[] = [
    {
      stage: 'received',
      label: 'Order Received',
      sublabel: 'Ticket printed at deli counter',
      icon: 'receipt',
    },
    {
      stage: 'slicing',
      label: 'Slicing Fresh',
      sublabel: 'Berkel slicer running fresh cuts',
      icon: 'restaurant',
    },
    {
      stage: 'wrapped',
      label: 'Butcher Wrapped',
      sublabel: 'Sealed with Monterey coastal wax stamp',
      icon: 'inventory_2',
    },
    {
      stage: 'ready',
      label: order?.fulfillment === 'pickup' ? 'Ready for Pickup' : 'Out for Beach Delivery',
      sublabel:
        order?.fulfillment === 'pickup'
          ? 'Ready at 482 Alvarado St window'
          : `En route to ${order?.deliveryBeach || 'beach point'}`,
      icon: order?.fulfillment === 'pickup' ? 'storefront' : 'moped',
    },
  ];

  const stageIndex = order ? stages.findIndex((s) => s.stage === order.stage) : 0;

  // Simulated countdown minutes
  const [remainingMinutes, setRemainingMinutes] = useState(
    order ? Math.max(1, order.estimatedMinutes - (stageIndex >= 0 ? stageIndex * 4 : 0)) : 15
  );

  useEffect(() => {
    if (!order) return;
    const calc = Math.max(1, order.estimatedMinutes - (stageIndex >= 0 ? stageIndex * 4 : 0));
    setRemainingMinutes(order.stage === 'ready' ? 0 : calc);
  }, [order?.stage, order?.estimatedMinutes, stageIndex]);

  if (!isOpen || !order) return null;

  const handleManualAdvance = () => {
    if (!onAdvanceStage) return;
    if (order.stage === 'received') onAdvanceStage('slicing');
    else if (order.stage === 'slicing') onAdvanceStage('wrapped');
    else if (order.stage === 'wrapped') onAdvanceStage('ready');
    else onAdvanceStage('received');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[90vh]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span className="text-xs font-semibold text-slate-900">
              Live Order #{order.orderNumber}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Scrollable Tracker Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Status Hero Card */}
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-xs border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                {order.fulfillment === 'pickup' ? 'Counter Pickup' : 'Beach Delivery'}
              </span>
              <span className="text-xs font-medium text-slate-300">
                {order.scheduledTime || 'ASAP'}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-white">
                  {order.stage === 'ready'
                    ? order.fulfillment === 'pickup'
                      ? 'Ready at Pickup Window!'
                      : 'Arriving at Your Beach Spot!'
                    : `Estimated: ~${order.estimatedPickupTime}`}
                </h2>
                <p className="text-xs text-slate-400">
                  {order.stage === 'ready'
                    ? 'Show your pickup code below at counter'
                    : `Approximately ${remainingMinutes} minutes remaining`}
                </p>
              </div>

              {order.stage !== 'ready' && (
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white shrink-0 border border-slate-700">
                  <span className="text-sm font-bold">{remainingMinutes}m</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="space-y-1">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold text-slate-900">
                Kitchen Progress
              </span>
              <button
                type="button"
                onClick={handleManualAdvance}
                className="text-[10px] text-slate-500 hover:text-slate-900 font-medium underline"
              >
                Advance Stage (Demo)
              </button>
            </div>

            <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {stages.map((st, idx) => {
                const isCompleted = idx < stageIndex;
                const isCurrent = idx === stageIndex;

                return (
                  <div key={st.stage} className="relative flex items-start gap-3 pl-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-slate-900 text-white ring-4 ring-slate-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      ) : (
                        <span className="material-symbols-outlined text-[14px]">{st.icon}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold ${
                            isCurrent
                              ? 'text-slate-900 font-bold'
                              : isCompleted
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {st.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{st.sublabel}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Digital Pickup Barcode Ticket */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col items-center gap-2 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Monterey Counter Scan Code
            </span>
            <div className="font-mono text-base tracking-widest font-semibold text-slate-900">
              *BB-{order.orderNumber}-CA*
            </div>
            {/* Minimalist barcode lines */}
            <div className="flex items-center gap-0.5 h-8 py-1 opacity-80">
              {Array.from({ length: 34 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full ${
                    i % 3 === 0
                      ? 'w-1 bg-slate-900'
                      : i % 2 === 0
                      ? 'w-0.5 bg-slate-700'
                      : 'w-1.5 bg-slate-900'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-500">
              Present to counter staff at 482 Alvarado St window
            </span>
          </div>

          {/* Location & Delivery Notes Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-semibold text-slate-900">{order.location.name}</span>
                <p className="text-slate-500 mt-0.5">
                  {order.location.address}, {order.location.cityStateZip}
                </p>
              </div>
              <a
                href={`tel:${order.location.phone.replace(/[^0-9]/g, '')}`}
                className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-[14px]">call</span>
                <span>Call Shop</span>
              </a>
            </div>

            {order.deliveryBeach && (
              <div className="p-2 rounded bg-slate-50 border border-slate-100 flex flex-col gap-0.5">
                <span className="font-medium text-slate-700">Beach Delivery Location:</span>
                <span className="text-slate-600">{order.deliveryBeach}</span>
                {order.deliveryNotes && (
                  <span className="text-slate-500 text-[11px] italic mt-0.5">
                    "{order.deliveryNotes}"
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Order Items Breakdown */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-slate-900">Items Ordered</span>
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-xs">
              {order.items.map((it) => (
                <div key={it.id} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-slate-900">{it.quantity}x</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-slate-900 truncate">{it.name}</span>
                      {it.customization && (
                        <span className="text-[10px] text-slate-500 capitalize">
                          {it.customization.size} • {it.customization.bread}
                        </span>
                      )}
                      {it.merchSize && (
                        <span className="text-[10px] text-slate-500">Size: {it.merchSize}</span>
                      )}
                    </div>
                  </div>
                  <span className="font-medium text-slate-900 shrink-0">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="p-3 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-900">
                <span>Total Paid ({order.paymentMethod.replace('_', ' ').toUpperCase()})</span>
                <span>${order.totalPaid.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs px-4 py-3 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors text-center shadow-xs"
          >
            Keep Order Tracking Active
          </button>
        </div>
      </div>
    </div>
  );
};
