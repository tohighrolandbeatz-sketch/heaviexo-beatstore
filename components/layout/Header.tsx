'use client';

import React from "react";
import { ShoppingCart, Menu, X, Music2, Package, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

interface HeaderProps {
  viewMode: "store" | "kits";
  setViewMode: (mode: "store" | "kits") => void;
  lang: "FR" | "EN";
  setLang: (lang: "FR" | "EN") => void;
  cartItemsCount: number;
  onCartOpen: () => void;
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
  t: any;
}

export function Header({ 
  viewMode, setViewMode, lang, setLang, cartItemsCount, 
  onCartOpen, onMobileMenuToggle, mobileMenuOpen, t 
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-[#161311]/85 px-4 md:px-8 py-3 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <Link href="/beatstore" className="flex items-center cursor-pointer">
        <img src="/LOGO-BEAT.png" alt="HEAVIEXO BEATS" className="h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity" />
      </Link>

      <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-[#C2B9B0]">
        <Link 
          href="/beatstore" 
          className={`${viewMode === "store" ? "text-[#C66B3D]" : "hover:text-[#F4F0EB]"} transition-colors`}
        >
          {t.beatstore}
        </Link>
        <Link 
          href="/kits" 
          className={`${viewMode === "kits" ? "text-[#C66B3D]" : "hover:text-[#F4F0EB]"} transition-colors flex items-center space-x-1.5`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>{t.soundKits}</span>
        </Link>
        <Link href="/services" className="hover:text-[#F4F0EB] transition-colors">
          {t.services}
        </Link>
      </nav>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <LanguageToggle lang={lang} setLang={setLang} />

        <button 
          onClick={onCartOpen} 
          className="bg-[#2D231E] hover:bg-[#382B25] px-3.5 py-2 rounded-full text-[10px] font-extrabold tracking-widest uppercase transition-all flex items-center space-x-1.5 text-[#F4F0EB] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-[#C66B3D]" />
          <span>({cartItemsCount})</span>
        </button>

        <button 
          onClick={onMobileMenuToggle} 
          className="md:hidden p-2 text-[#F4F0EB] bg-[#2D231E] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-[#C66B3D]" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}