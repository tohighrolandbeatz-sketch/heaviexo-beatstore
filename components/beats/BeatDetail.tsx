'use client';

import React from "react";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { Beat } from "@/types";

interface BeatDetailProps {
  beat: Beat;
  onBack: () => void;
  onGetLicense: (beat: Beat) => void;
  t: any;
}

export function BeatDetail({ beat, onBack, onGetLicense, t }: BeatDetailProps) {
  return (
    <main className="px-4 md:px-8 pt-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <button onClick={onBack} className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-[#C2B9B0] bg-[#29201C]/70 px-4 py-2 rounded-full">
        <ChevronLeft className="w-4 h-4" /><span>{t.backToCatalog}</span>
      </button>
      <div className="bg-[#29201C]/70 rounded-3xl p-6 md:p-8 backdrop-blur-2xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="relative group w-full aspect-square rounded-2xl overflow-hidden shadow-xl">
          <img src={beat.cover} alt={beat.title} className="w-full h-full object-cover" />
        </div>
        <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-black text-[#C66B3D] uppercase tracking-widest block mb-1">{beat.type}</span>
            <h1 className="text-3xl md:text-5xl font-black text-[#F4F0EB] uppercase">{beat.title}</h1>
            <p className="text-sm text-[#C2B9B0] mt-4">{beat.description}</p>
          </div>
          <div className="flex items-center justify-end pt-2">
            <button onClick={() => onGetLicense(beat)} className="bg-[#C66B3D]/30 text-[#F4F0EB] font-extrabold px-8 py-4 rounded-2xl text-sm uppercase flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-[#C66B3D]" /><span>{t.getLicense}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}