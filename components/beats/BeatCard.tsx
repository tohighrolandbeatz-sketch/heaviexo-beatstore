'use client';

import React from "react";
import { Play, Pause } from "lucide-react";
import { Beat } from "@/types";

interface BeatCardProps {
  beat: Beat;
  isCurrent: boolean;
  isPlaying: boolean;
  onTogglePlay: (beat: Beat) => void;
  onClick: (beat: Beat) => void;
}

export function BeatCard({ beat, isCurrent, isPlaying, onTogglePlay, onClick }: BeatCardProps) {
  return (
    <div className="bg-[#29201C]/70 rounded-3xl overflow-hidden backdrop-blur-2xl flex flex-col justify-between shadow-xl">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl m-4 shadow-md cursor-pointer" onClick={() => onClick(beat)}>
          <img src={beat.cover} alt={beat.title} className="w-full h-full object-cover" />
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePlay(beat); }}
            className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-[#C66B3D] text-white flex items-center justify-center shadow-lg hover:bg-[#D97746] transition-colors"
          >
            {isCurrent && isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
        </div>
        <div className="p-6 pt-2 space-y-3">
          <h3 className="font-bold text-lg text-[#F4F0EB]">{beat.title}</h3>
          <span className="text-xs font-black text-[#C66B3D] uppercase tracking-widest">{beat.type}</span>
          <p className="text-xs text-[#C2B9B0]">{beat.bpm} BPM</p>
        </div>
      </div>
    </div>
  );
}