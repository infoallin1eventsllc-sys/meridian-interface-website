import { useState, useEffect, type FormEvent } from 'react';
import { X, CheckCircle, Calendar, Sparkles, Coffee } from 'lucide-react';

interface CuppingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CuppingModal({ isOpen, onClose }: CuppingModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState('1');
  const [date, setDate] = useState('Next Thursday, 10:00 AM');
  const [isReserved, setIsReserved] = useState(false);

  // Close on Escape key & lock body scroll
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsReserved(true);
  };

  const handleDone = () => {
    setIsReserved(false);
    onClose();
  };

  return (
    <div
      id="cupping-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C1B10]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        id="cupping-modal-container"
        className="relative bg-[#FAF7F2] rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#D4A373]/30 z-10"
      >
        <button
          id="btn-cupping-close"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F2EDE4] hover:bg-[#E9E1D6] flex items-center justify-center text-[#5C5043] transition-colors border border-[#D4A373]/20"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {isReserved ? (
          <div id="cupping-confirmation-panel" className="text-center py-4 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm border border-emerald-200">
              <CheckCircle className="w-8 h-8 text-emerald-700" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2C1B10]">
              Cupping Seat Reserved!
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5043] leading-relaxed">
              We have saved <strong>{guests} {Number(guests) > 1 ? 'seats' : 'seat'}</strong> for <strong>{name}</strong> on <strong>{date}</strong> at our Russian Hill historic cupping room (1420 Vallejo St).
            </p>
            <div className="bg-[#F2EDE4] p-4 rounded-2xl border border-[#D4A373]/25 w-full text-left text-xs text-[#5C5043] space-y-1.5 mt-2">
              <strong className="text-[#2C1B10] block mb-1 font-serif text-sm">
                Cupping Etiquette &amp; Tips:
              </strong>
              <p>• Please arrive 5 minutes early to cleanse your palate with sparkling water.</p>
              <p>• Avoid strong colognes or heavy spices immediately before the flight.</p>
              <p>• Custom silver cupping spoons and SCA aroma evaluation sheets provided.</p>
            </div>
            <button
              id="btn-cupping-finish"
              onClick={handleDone}
              className="mt-4 w-full min-h-[44px] py-3 rounded-full bg-[#6F4E37] text-white text-xs font-sans font-bold uppercase tracking-widest shadow-md hover:bg-[#8C7851] transition-all active:scale-[0.98]"
            >
              Done &amp; Return to Roastery
            </button>
          </div>
        ) : (
          <div id="cupping-form-panel">
            <div className="flex items-center gap-2 text-[#6F4E37] text-xs font-sans font-bold uppercase tracking-[0.25em] mb-1.5">
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
              <span>Small-Group Sensory Tasting</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2C1B10]">
              Reserve Thursday Cupping
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5043] font-sans mt-1 mb-6 leading-relaxed">
              Sample four single-origin micro-lot coffees alongside Roastmaster Marco. Evaluate floral acidity, caramel sweetness, and mouthfeel using the official SCA protocol.
            </p>

            <form id="cupping-reservation-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="cupping-name-input"
                  className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#5C5043] block mb-1"
                >
                  Your Full Name
                </label>
                <input
                  id="cupping-name-input"
                  type="text"
                  required
                  placeholder="Elena Rossi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#D4A373]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2C1B10] focus:outline-none focus:border-[#6F4E37]"
                />
              </div>

              <div>
                <label
                  htmlFor="cupping-email-input"
                  className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#5C5043] block mb-1"
                >
                  Email Address (for confirmation)
                </label>
                <input
                  id="cupping-email-input"
                  type="email"
                  required
                  placeholder="elena@fogcity.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#D4A373]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2C1B10] focus:outline-none focus:border-[#6F4E37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="cupping-date-select"
                    className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#5C5043] block mb-1"
                  >
                    Date &amp; Time
                  </label>
                  <select
                    id="cupping-date-select"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-[#D4A373]/30 rounded-xl px-3 py-2 text-xs text-[#2C1B10] focus:outline-none focus:border-[#6F4E37]"
                  >
                    <option value="Next Thursday, 10:00 AM">Next Thursday, 10:00 AM</option>
                    <option value="Following Thursday, 10:00 AM">Following Thursday, 10:00 AM</option>
                    <option value="Third Thursday, 10:00 AM">Third Thursday, 10:00 AM</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="cupping-guests-select"
                    className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#5C5043] block mb-1"
                  >
                    Guests
                  </label>
                  <select
                    id="cupping-guests-select"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-white border border-[#D4A373]/30 rounded-xl px-3 py-2 text-xs text-[#2C1B10] focus:outline-none focus:border-[#6F4E37]"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-cupping-submit"
                  type="submit"
                  className="w-full min-h-[46px] py-3 rounded-full bg-[#6F4E37] hover:bg-[#8C7851] text-white text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-md shadow-[#6F4E37]/15 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#D4A373]" />
                  <span>Confirm Free Reservation</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
