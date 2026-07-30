'use client';

import React from "react";
import { Play } from "lucide-react";
import { Beat } from "@/types";
import { ShoppingCart } from "lucide-react";

interface BeatListProps {
  beats: Beat[];
  currentBeat: Beat | null;
  isPlaying: boolean;
  onTogglePlay: (beat: Beat) => void;
  onBeatClick: (beat: Beat) => void;
  onLicenseClick: (beat: Beat) => void;
  t: any;
}

export function BeatList({ beats, currentBeat, isPlaying, onTogglePlay, onBeatClick, onLicenseClick, t }: BeatListProps) {
  if (beats.length === 0) {
    return (
      <div className="p-10 text-center text-[#9E938B] text-sm">{t.noResultsFound}</div>
    );
  }

  return (
    <div className="divide-y divide-white/10">
      {beats.map((beat) => {
        const isSelected = currentBeat?.id === beat.id;
        const isThisPlaying = isSelected && isPlaying;

        return (
          <div key={beat.id} className={`flex items-center justify-between p-3.5 md:p-4 hover:bg-[#C66B3D]/10 transition-colors ${isSelected ? "bg-[#C66B3D]/20" : ""}`}>
            <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
              <button onClick={() => onTogglePlay(beat)} className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                <img src={beat.cover} alt={beat.title} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${isThisPlaying ? "opacity-100" : "opacity-0"}`}>
                  <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                </div>
              </button>
              <div className="min-w-0 flex-1">
                <h4 onClick={() => onBeatClick(beat)} className={`font-bold text-sm md:text-base truncate cursor-pointer hover:underline ${isSelected ? "text-[#C66B3D]" : "text-[#F4F0EB]"}`}>
                  {beat.title}
                </h4>
                <p className="text-xs text-[#C2B9B0] truncate">{beat.type} • {beat.bpm} BPM</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-3 ml-2 flex-shrink-0">
              <button onClick={() => onLicenseClick(beat)} className="bg-[#C66B3D] text-white p-2.5 rounded-xl shadow-md" title={t.licenceBtn}>
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}