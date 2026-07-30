'use client';

import React from "react";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { Beat } from "@/types";

interface HeroSectionProps {
  t: any;
  currentBeat: Beat | null;
  isPlaying: boolean;
  onTogglePlay: (beat: Beat) => void;
  onBeatClick: (beat: Beat) => void;
}

export function HeroSection({ t, currentBeat, isPlaying, onTogglePlay, onBeatClick }: HeroSectionProps) {
  return (
    <section className="relative px-4 md:px-6 pt-12 md:pt-20 pb-12 md:pb-16 max-w-7xl mx-auto text-center space-y-12">
      <div className="space-y-4 max-w-4xl mx-auto">
        <span className="inline-block px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D] shadow-md">
          {t.heroBadge}
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#F4F0EB] uppercase leading-tight">
          {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97746] via-[#C66B3D] to-[#E3A857]">{t.heroTitle2}</span>
        </h1>
        <p className="text-[#C2B9B0] max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">
          {t.heroSub}
        </p>
        <div className="pt-4">
          <Link href="/services" className="inline-flex items-center space-x-2 bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold px-8 py-4 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-[#C66B3D]/30 transition-transform active:scale-95">
            <span>{t.letsBuild}</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-2xl md:text-4xl font-black text-[#F4F0EB]">300+</div>
          <div className="text-[10px] md:text-xs text-[#9E938B] font-bold uppercase tracking-wider mt-1">{t.statArtists}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-4xl font-black text-[#F4F0EB]">18+</div>
          <div className="text-[10px] md:text-xs text-[#9E938B] font-bold uppercase tracking-wider mt-1">{t.statExp}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-4xl font-black text-[#F4F0EB]">72 hr</div>
          <div className="text-[10px] md:text-xs text-[#9E938B] font-bold uppercase tracking-wider mt-1">{t.statDemos}</div>
        </div>
      </div>

      {currentBeat && (
        <div className="bg-[#29201C]/70 rounded-2xl p-4 md:p-6 backdrop-blur-2xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-left shadow-2xl">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-md flex-shrink-0">
            <img src={currentBeat.cover} alt={currentBeat.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <span className="text-[10px] md:text-xs uppercase tracking-wider text-[#C66B3D] font-extrabold">{currentBeat.type}</span>
            <h3 onClick={() => onBeatClick(currentBeat)} className="text-xl md:text-2xl font-bold text-[#F4F0EB] truncate cursor-pointer hover:text-[#C66B3D]">
              {currentBeat.title}
            </h3>
          </div>
          <button onClick={() => onTogglePlay(currentBeat)} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#C66B3D] text-white flex items-center justify-center shadow-lg">
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>
        </div>
      )}
    </section>
  );
}