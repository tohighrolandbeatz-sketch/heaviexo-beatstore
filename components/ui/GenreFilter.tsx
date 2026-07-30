'use client';

import React from "react";
import { GENRES } from "@/constants/config";

interface GenreFilterProps {
  selected: string;
  onSelect: (genre: string) => void;
}

export function GenreFilter({ selected, onSelect }: GenreFilterProps) {
  return (
    <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
      {GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelect(genre)}
          className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
            selected === genre 
              ? "bg-[#C66B3D] text-white font-extrabold" 
              : "bg-[#29201C] text-[#C2B9B0]"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}