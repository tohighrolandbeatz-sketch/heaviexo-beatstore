'use client';

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, Package, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setViewMode: (mode: "store" | "kits") => void;
  t: any;
}

export function MobileMenu({ isOpen, onClose, setViewMode, t }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }} 
          className="fixed inset-x-0 top-[65px] z-30 bg-[#161311]/95 backdrop-blur-2xl p-6 md:hidden space-y-4 shadow-2xl"
        >
          <div className="flex flex-col space-y-3 font-bold text-sm uppercase tracking-wider">
            <Link 
              href="/beatstore" 
              onClick={onClose} 
              className="p-3 rounded-xl text-left bg-white/5 text-[#F4F0EB] flex items-center space-x-3"
            >
              <Music2 className="w-4 h-4 text-[#C66B3D]" />
              <span>{t.beatstore}</span>
            </Link>
            <Link 
              href="/kits" 
              onClick={onClose} 
              className="p-3 rounded-xl text-left bg-white/5 text-[#F4F0EB] flex items-center space-x-3"
            >
              <Package className="w-4 h-4 text-[#C66B3D]" />
              <span>{t.soundKits}</span>
            </Link>
            <Link 
              href="/services" 
              onClick={onClose} 
              className="p-3 rounded-xl text-left bg-white/5 text-[#F4F0EB] flex items-center space-x-3"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C66B3D]" />
              <span>{t.services}</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}