'use client';

import React, { useState, useEffect } from "react";
import { DEFAULT_ARTISTS } from "@/constants/config";

export function ArtistMarquee() {
  const [artists, setArtists] = useState<string[]>(DEFAULT_ARTISTS);

  useEffect(() => {
    fetch("/api/design", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.artists && Array.isArray(data.artists) && data.artists.length > 0) {
          setArtists(data.artists);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-[#161311] py-6 border-y border-white/10 overflow-hidden relative my-6">
      <div className="absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-[#161311] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-[#161311] to-transparent z-10 pointer-events-none" />
      <div className="flex w-max animate-marquee space-x-12 items-center">
        {[...artists, ...artists, ...artists].map((artist, idx) => (
          <div key={idx} className="flex items-center space-x-4">
            <span className="text-sm md:text-base font-black uppercase tracking-widest text-[#C2B9B0] hover:text-[#C66B3D] transition-colors cursor-default whitespace-nowrap">
              {artist}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C66B3D]" />
          </div>
        ))}
      </div>
    </div>
  );
}