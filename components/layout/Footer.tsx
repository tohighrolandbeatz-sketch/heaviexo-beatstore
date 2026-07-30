'use client';

import React from "react";
import Link from "next/link";

interface FooterProps {
  t: any;
  setViewMode: (mode: "store" | "kits") => void;
  footerText: string;
  copyrightText: string;
}

export function Footer({ t, setViewMode, footerText, copyrightText }: FooterProps) {
  return (
    <footer className="mt-20 bg-[#161311]/95 backdrop-blur-xl px-4 md:px-8 py-12 shadow-2xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          <img src="/LOGO-BEAT.png" alt="HEAVIEXO BEATS" className="h-10 w-auto object-contain" />
          <p className="text-xs text-[#C2B9B0] leading-relaxed">{footerText}</p>
        </div>
        <div>
          <h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">{t.catalogueTitle}</h5>
          <ul className="space-y-2 text-xs text-[#C2B9B0] font-medium">
            <li onClick={() => setViewMode("store")} className="hover:text-[#C66B3D] cursor-pointer">{t.darkTrapBeats}</li>
            <li onClick={() => setViewMode("kits")} className="hover:text-[#C66B3D] cursor-pointer">{t.soundkitsDrumkits}</li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">{t.engineeringServices}</h5>
          <ul className="space-y-2 text-xs text-[#C2B9B0] font-medium">
            <li><Link href="/services" className="hover:text-[#C66B3D] transition-colors">{t.mixingStemsPro}</Link></li>
          </ul>
        </div>
        <div className="space-y-3">
          <h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">{t.vipClub}</h5>
          <p className="text-xs text-[#C2B9B0] leading-relaxed">{t.vipDesc}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 text-[11px] text-[#9E938B] font-medium text-center">
        <p>{copyrightText}</p>
      </div>
    </footer>
  );
}