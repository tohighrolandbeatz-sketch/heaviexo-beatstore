'use client';

import React, { useState, useEffect } from "react";
import { toSpotifyEmbedUrl } from "@/utils/spotify";

interface SpotifySectionProps {
  t: any;
}

export function SpotifySection({ t }: SpotifySectionProps) {
  const [spotify, setSpotify] = useState<{ mainEmbedUrl: string; projects: { title: string; url: string }[] } | null>(null);

  useEffect(() => {
    fetch("/api/design", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.spotify) setSpotify(data.spotify);
      })
      .catch(() => {});
  }, []);

  const hasMain = spotify?.mainEmbedUrl && spotify.mainEmbedUrl.trim() !== "";
  const hasProjects = spotify?.projects && spotify.projects.length > 0;

  if (!hasMain && !hasProjects) return null;

  return (
    <section className="px-4 md:px-6 max-w-7xl mx-auto mt-16 mb-4 space-y-6">
      <h2 className="text-xl md:text-2xl font-black text-[#F4F0EB] uppercase tracking-tight text-center">
        {t.collaborations}
      </h2>
      {hasMain && (
        <div className="rounded-2xl overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.6)]">
          <iframe 
            src={toSpotifyEmbedUrl(spotify!.mainEmbedUrl)} 
            width="100%" 
            height="352" 
            style={{ border: 0 }} 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy" 
          />
        </div>
      )}
      {hasProjects && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {spotify!.projects.map((proj, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.5)]">
              <p className="text-xs font-bold text-[#C2B9B0] px-2 pb-2 pt-1">{proj.title}</p>
              <iframe 
                src={toSpotifyEmbedUrl(proj.url)} 
                width="100%" 
                height="152" 
                style={{ border: 0 }} 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy" 
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}