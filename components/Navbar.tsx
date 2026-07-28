"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, LayoutDashboard, Menu, X, Package } from "lucide-react";

interface NavbarProps {
  lang: "FR" | "EN";
  setLang: (lang: "FR" | "EN") => void;
  t: any;
  viewMode: string;
  navigateTo: (mode: "store" | "kits" | "services" | "admin") => void;
  cartCount: number;
  setCartOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({
  lang,
  setLang,
  t,
  viewMode,
  navigateTo,
  cartCount,
  setCartOpen,
  mobileMenuOpen,
  setMobileMenuOpen
}: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-black/80 border-b border-zinc-800/80 px-4 md:px-8 py-3 flex justify-between items-center shadow-xl">
      <div className="flex items-center cursor-pointer" onClick={() => navigateTo("store")}>
        <img 
          src="/LOGO-BEAT.png" 
          alt="HEAVIEXO BEATS" 
          className="h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity"
        />
      </div>

      <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
        <button 
          onClick={() => navigateTo("store")} 
          className={`${viewMode === "store" ? "text-emerald-400" : "hover:text-white"} transition-colors`}
        >
          {t.beatstore}
        </button>
        <button 
          onClick={() => navigateTo("kits")}
          className={`${viewMode === "kits" ? "text-emerald-400" : "hover:text-white"} transition-colors flex items-center space-x-1.5`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>{t.soundKits}</span>
        </button>
        <button 
          onClick={() => navigateTo("services")}
          className={`${viewMode === "services" ? "text-emerald-400" : "hover:text-white"} transition-colors`}
        >
          {t.services}
        </button>
      </nav>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <div 
          onClick={() => setLang(lang === "FR" ? "EN" : "FR")}
          className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-1 cursor-pointer w-20 h-8 select-none shadow-inner"
        >
          <motion.div
            className="absolute top-1 bottom-1 w-8 bg-emerald-500 rounded-full shadow-md shadow-emerald-500/30"
            animate={{ left: lang === "FR" ? "4px" : "calc(100% - 36px)" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
          <div className="relative z-10 flex w-full justify-between px-2 text-[10px] font-black uppercase tracking-wider">
            <span className={`transition-colors ${lang === "FR" ? "text-black font-extrabold" : "text-zinc-500"}`}>
              FR
            </span>
            <span className={`transition-colors ${lang === "EN" ? "text-black font-extrabold" : "text-zinc-500"}`}>
              EN
            </span>
          </div>
        </div>

        <button 
          onClick={() => navigateTo(viewMode === "admin" ? "store" : "admin")}
          className={`px-3 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center space-x-1.5 border backdrop-blur-md ${
            viewMode === "admin"
              ? "bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20"
              : "bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:text-white"
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{viewMode === "admin" ? t.adminView : t.adminBtn}</span>
        </button>

        <button 
          onClick={() => setCartOpen(true)}
          className="bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 px-3 py-2 rounded-full text-[10px] font-extrabold tracking-widest uppercase transition-all flex items-center space-x-1.5"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
          <span>({cartCount})</span>
        </button>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-300 hover:text-white bg-zinc-900/80 border border-zinc-800 rounded-full"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}