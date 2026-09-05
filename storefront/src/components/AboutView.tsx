import React from 'react';
import { Shield, Sparkles, Layers, Compass } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <main className="flex-grow pt-[120px] pb-16 md:pb-28 px-5 md:px-16 max-w-[1280px] mx-auto w-full">
      {/* Manifesto Hero */}
      <div className="max-w-3xl mb-16 md:mb-24 border-b border-[#1A1A1A]/10 pb-12">
        <span className="text-[10px] uppercase font-sans font-bold text-[#1A1A1A]/50 tracking-[0.3em] block mb-3">
          The Manifesto • Issue 04
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#1A1A1A] tracking-tight leading-[1.1] mb-8">
          Architectural minimalism for the <span className="italic">contemplative metropolis</span>.
        </h1>
        <p className="font-sans text-base md:text-lg text-[#1A1A1A]/70 leading-relaxed">
          MODERN_STREET operates at the nexus of high-fashion editorial rigor and modern urban function.
          We refuse transient novelty, curating disciplined geometry, heavyweight drape, and understated
          structural permanence.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-[0_4px_20px_rgba(26,26,26,0.03)]">
          <div className="w-12 h-12 bg-[#ECE8E1] text-[#1A1A1A] flex items-center justify-center mb-6">
            <Layers size={22} />
          </div>
          <span className="text-[10px] uppercase font-sans font-bold text-[#1A1A1A]/40 tracking-[0.2em] block mb-1">
            Pillar 01
          </span>
          <h3 className="font-serif text-xl font-normal text-[#1A1A1A] mb-3">
            Heavyweight Textiles
          </h3>
          <p className="font-sans text-xs text-[#1A1A1A]/70 leading-relaxed">
            Heavyweight loopback terry, dense twills and ripstop shells, chosen for drape and for how
            they wear in over years rather than seasons.
          </p>
        </div>

        <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-[0_4px_20px_rgba(26,26,26,0.03)]">
          <div className="w-12 h-12 bg-[#ECE8E1] text-[#1A1A1A] flex items-center justify-center mb-6">
            <Sparkles size={22} />
          </div>
          <span className="text-[10px] uppercase font-sans font-bold text-[#1A1A1A]/40 tracking-[0.2em] block mb-1">
            Pillar 02
          </span>
          <h3 className="font-serif text-xl font-normal text-[#1A1A1A] mb-3">
            Precision Silhouette
          </h3>
          <p className="font-sans text-xs text-[#1A1A1A]/70 leading-relaxed">
            Subtle architectural cuts serve as tactile focal points across bonded seams, drawstring aglets,
            and understated stitch lines — precise work against soft, worn-in tone.
          </p>
        </div>

        <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-[0_4px_20px_rgba(26,26,26,0.03)]">
          <div className="w-12 h-12 bg-[#ECE8E1] text-[#1A1A1A] flex items-center justify-center mb-6">
            <Shield size={22} />
          </div>
          <span className="text-[10px] uppercase font-sans font-bold text-[#1A1A1A]/40 tracking-[0.2em] block mb-1">
            Pillar 03
          </span>
          <h3 className="font-serif text-xl font-normal text-[#1A1A1A] mb-3">
            Modular Construction
          </h3>
          <p className="font-sans text-xs text-[#1A1A1A]/70 leading-relaxed">
            Ergonomic darting, adjustable ankle toggles, and dual-entry 3D pocket architectures allow
            each piece to transform dynamically across changing weather and settings.
          </p>
        </div>
      </div>

      {/* Studio Ethos Block */}
      <div className="bg-[#1A1A1A] text-[#F9F7F2] p-8 md:p-14">
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase font-sans font-bold text-[#F9F7F2]/50 tracking-[0.3em] block mb-3">
            How Releases Work
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mb-4">
            Small-Batch <span className="italic">Releases</span>
          </h2>
          <p className="font-sans text-xs md:text-sm text-[#F9F7F2]/70 leading-relaxed mb-6">
            Numbered micro-runs, so a piece is made in the quantity it is likely to sell in rather than
            warehoused. Each release is dated and closed when it sells through.
          </p>
          <div className="flex items-center gap-3 text-xs text-[#F9F7F2]/60 font-sans">
            <Compass size={16} className="text-[#F9F7F2]" />
            <span>A fictional label, used here to demonstrate the storefront software</span>
          </div>
        </div>
      </div>
    </main>
  );
};
