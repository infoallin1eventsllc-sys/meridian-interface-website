import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { EditorialCampaign } from '../types';

interface CampaignModalProps {
  campaign: EditorialCampaign | null;
  onClose: () => void;
  onShopCampaign: () => void;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({
  campaign,
  onClose,
  onShopCampaign,
}) => {
  if (!campaign) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/75 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-[#FFFFFF] text-[#1A1A1A] w-full max-w-2xl z-10 border border-[#1A1A1A]/20 shadow-2xl p-6 md:p-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A] p-1 cursor-pointer transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 text-[10px] font-sans uppercase font-bold tracking-[0.3em] text-[#1A1A1A]/50 mb-2">
          <Sparkles size={13} />
          <span>{campaign.badge} • {campaign.season}</span>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mb-2">
          {campaign.title}
        </h2>

        <p className="font-serif italic text-lg text-[#1A1A1A]/80 font-normal mb-6">
          {campaign.tagline}
        </p>

        <div className="space-y-3 font-sans text-xs text-[#1A1A1A]/70 leading-relaxed border-t border-[#1A1A1A]/10 pt-6 mb-8">
          <p>{campaign.description}</p>
          <p className="text-[11px] text-[#1A1A1A]/50">
            Reinforced double-needle tailoring and stark architectural proportioning. Each garment is numbered and delivered in flat archival packaging.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              onClose();
              onShopCampaign();
            }}
            className="flex-grow h-12 bg-[#1A1A1A] text-[#F9F7F2] font-sans font-semibold text-xs uppercase tracking-[0.25em] hover:bg-[#333] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Explore Capsule Pieces</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={onClose}
            className="h-12 px-6 border border-[#1A1A1A]/20 text-[#1A1A1A] font-sans font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#ECE8E1] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
