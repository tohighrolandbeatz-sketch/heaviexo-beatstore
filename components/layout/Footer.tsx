'use client';

import React from "react";
import Link from "next/link";
import { useBranding } from "@/components/ThemeProvider";

interface FooterProps {
  t: any;
  setViewMode: (mode: "store" | "kits") => void;
  footerText: string;
  copyrightText: string;
}

export function Footer({ t, setViewMode, footerText, copyrightText }: FooterProps) {
  const { branding } = useBranding();
  const social = branding?.social || {};
  const showLogo = branding?.showFooterLogo !== false;
  const hasSocials = Object.values(social).some((url: any) => url);

  return (
    <footer className="mt-20 backdrop-blur-xl px-4 md:px-8 py-12 shadow-2xl" style={{ background: 'color-mix(in srgb, var(--color-secondary, #161311) 95%, transparent)' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          {showLogo && <img loading="lazy" width="200" height="40" src={branding?.logo || "/LOGO-BEAT.png"} alt={branding?.siteName || "Logo"} className="h-10 w-auto object-contain" />}
          <p className="text-xs text-[#C2B9B0] leading-relaxed">{branding?.footerText || footerText}</p>
          {hasSocials && (
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-[#C2B9B0] hover:text-[#C66B3D] transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>}
              {social.youtube && <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="text-[#C2B9B0] hover:text-[#C66B3D] transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>}
              {social.tiktok && <a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="text-[#C2B9B0] hover:text-[#C66B3D] transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>}
              {social.spotify && <a href={social.spotify} target="_blank" rel="noopener noreferrer" className="text-[#C2B9B0] hover:text-[#C66B3D] transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg></a>}
              {social.discord && <a href={social.discord} target="_blank" rel="noopener noreferrer" className="text-[#C2B9B0] hover:text-[#C66B3D] transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg></a>}
              {social.telegram && <a href={social.telegram} target="_blank" rel="noopener noreferrer" className="text-[#C2B9B0] hover:text-[#C66B3D] transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>}
              {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-[#C2B9B0] hover:text-[#C66B3D] transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>}
            </div>
          )}
        </div>
        <div><h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">{t.catalogueTitle}</h5><ul className="space-y-2 text-xs text-[#C2B9B0] font-medium"><li onClick={() => setViewMode("store")} className="hover:text-[#C66B3D] cursor-pointer">{t.darkTrapBeats}</li><li onClick={() => setViewMode("kits")} className="hover:text-[#C66B3D] cursor-pointer">{t.soundkitsDrumkits}</li></ul></div>
        <div><h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">{t.engineeringServices}</h5><ul className="space-y-2 text-xs text-[#C2B9B0] font-medium"><li><Link href="/services" className="hover:text-[#C66B3D] transition-colors">{t.mixingStemsPro}</Link></li><li><Link href="/services" className="hover:text-[#C66B3D] transition-colors">{t.masteringAnalog}</Link></li><li><Link href="/services" className="hover:text-[#C66B3D] transition-colors">{t.customProd}</Link></li></ul></div>
        <div className="space-y-3"><h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">{t.vipClub}</h5><p className="text-xs text-[#C2B9B0] leading-relaxed">{t.vipDesc}</p></div>
      </div>
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 text-[11px] text-[#9E938B] font-medium text-center"><p>{branding?.copyright || copyrightText}</p></div>
    </footer>
  );
}