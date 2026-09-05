import React from 'react';
import { X, User, Package, MapPin, ShieldCheck, LogOut } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-[#FFFFFF] w-full max-w-lg z-10 border border-[#1A1A1A]/20 shadow-2xl p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A] p-1 cursor-pointer transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-4 border-b border-[#1A1A1A]/10 pb-6 mb-6">
          <div className="w-14 h-14 bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center font-serif italic text-lg">
            OM
          </div>
          <div>
            <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#1A1A1A]/40 block mb-0.5">
              Patron Record
            </span>
            <h3 className="font-serif text-2xl font-normal text-[#1A1A1A]">
              Otis Meridian
            </h3>
            <p className="font-sans text-[11px] text-[#1A1A1A]/60">
              otis@meridianinterface.com • Archive Patron Tier
            </p>
          </div>
        </div>

        <div className="space-y-3 font-sans text-xs">
          <div className="border border-[#1A1A1A]/10 p-4 bg-[#F9F7F2] flex items-start gap-3">
            <Package size={18} className="text-[#1A1A1A] mt-0.5" />
            <div className="flex-grow">
              <span className="font-semibold text-[#1A1A1A] block">Archived Requisition #MS-2026-8849</span>
              <span className="text-[11px] text-[#1A1A1A]/60 block">2 editions • In transit</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-[#1A1A1A] bg-[#ECE8E1] px-2 py-0.5 border border-[#1A1A1A]/15">
              In Transit
            </span>
          </div>

          <div className="border border-[#1A1A1A]/10 p-4 bg-[#F9F7F2] flex items-start gap-3">
            <MapPin size={18} className="text-[#1A1A1A] mt-0.5" />
            <div>
              <span className="font-semibold text-[#1A1A1A] block">Archival Dispatch Address</span>
              <span className="text-[11px] text-[#1A1A1A]/60">450 Mission Street, Suite 800, San Francisco, CA 94105</span>
            </div>
          </div>

          <div className="border border-[#1A1A1A]/10 p-4 bg-[#F9F7F2] flex items-start gap-3">
            <ShieldCheck size={18} className="text-[#1A1A1A] mt-0.5" />
            <div>
              <span className="font-semibold text-[#1A1A1A] block">Patron Privilege: Syndicate Archive</span>
              <span className="text-[11px] text-[#1A1A1A]/60">Exclusive priority reservations & private lookbook previews</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#1A1A1A]/10 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-[11px] font-sans uppercase tracking-wider font-semibold text-[#ba1a1a] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={13} />
            Sign Out
          </button>

          <button
            onClick={onClose}
            className="h-9 px-6 bg-[#1A1A1A] text-[#F9F7F2] text-[10px] font-sans font-semibold uppercase tracking-[0.2em] hover:bg-[#333] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
