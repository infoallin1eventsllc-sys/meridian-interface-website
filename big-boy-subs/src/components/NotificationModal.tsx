import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      icon: 'bakery_dining',
      title: 'Fresh Bread Oven Alert',
      time: '6m ago',
      message: 'Oven #2 at Alvarado St just pulled a piping hot batch of Rosemary Parmesan Baguettes.',
      badge: 'Bakery Live',
    },
    {
      id: '2',
      icon: 'stars',
      title: 'Double Shore Points This Weekend',
      time: '2h ago',
      message: 'Earn 2 stamps on every Giant Sub ordered for beach picnic pickup in Pacific Grove or Monterey.',
      badge: 'Loyalty Perk',
    },
    {
      id: '3',
      icon: 'wb_sunny',
      title: 'Beach Breeze & Picnic Boxes',
      time: 'Yesterday',
      message: 'Sunny 68°F at Lovers Point today! Order our beach combo packs with complimentary pickle spears.',
      badge: 'Weather & Deli',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/80 p-5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-500 text-[18px]">
              notifications
            </span>
            <h2 className="text-sm font-semibold text-slate-900">
              Counter Notifications
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/60">
                <span className="material-symbols-outlined text-[16px]">{n.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {n.message}
                </p>
                <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                  {n.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors text-center"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
