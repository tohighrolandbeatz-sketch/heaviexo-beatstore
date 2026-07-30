'use client';

import React from "react";
import { motion } from "framer-motion";

interface LanguageToggleProps {
  lang: "FR" | "EN";
  setLang: (lang: "FR" | "EN") => void;
}

export function LanguageToggle({ lang, setLang }: LanguageToggleProps) {
  return (
    <div 
      onClick={() => setLang(lang === "FR" ? "EN" : "FR")} 
      className="relative flex items-center bg-[#2D231E] rounded-full p-1 cursor-pointer w-20 h-8 select-none shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
    >
      <motion.div 
        className="absolute top-1 bottom-1 w-8 bg-[#C66B3D] rounded-full shadow-md shadow-[#C66B3D]/40" 
        animate={{ left: lang === "FR" ? "4px" : "calc(100% - 36px)" }} 
        transition={{ type: "spring", stiffness: 500, damping: 30 }} 
      />
      <div className="relative z-10 flex w-full justify-between px-2 text-[10px] font-black uppercase tracking-wider">
        <span className={`transition-colors ${lang === "FR" ? "text-white font-extrabold" : "text-[#9E938B]"}`}>FR</span>
        <span className={`transition-colors ${lang === "EN" ? "text-white font-extrabold" : "text-[#9E938B]"}`}>EN</span>
      </div>
    </div>
  );
}