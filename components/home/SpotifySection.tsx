'use client';

import React from "react";

interface SpotifySectionProps {
  t: any;
  playlistUrl?: string;
}

export function SpotifySection({ t, playlistUrl = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M" }: SpotifySectionProps) {
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    return url.replace("open.spotify.com/", "open.spotify.com/embed/");
  };

  const embedSrc = getEmbedUrl(playlistUrl || "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M");

  return (
    <section className="px-4 md:px-6 max-w-7xl mx-auto my-16">
      <div className="bg-[#111] border border-white/5 backdrop-blur-2xl rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D] border border-[#C66B3D]/30">Streaming & Exclusivités</span>
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">Écouter sur Spotify</h2>
          </div>
        </div>
        {embedSrc ? (
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-black/40 border border-white/5">
            <iframe src={`${embedSrc}?utm_source=generator&theme=0`} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify Embed Player" style={{ borderRadius: '16px' }}></iframe>
          </div>
        ) : (
          <div className="text-center py-12 text-[#666] text-xs uppercase tracking-widest">Aucun lien Spotify configuré</div>
        )}
      </div>
    </section>
  );
}
