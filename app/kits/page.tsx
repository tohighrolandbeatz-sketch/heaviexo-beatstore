'use client';

import React, { useState } from "react";
import { translations } from "@/constants/translations";
import { useBeatData } from "@/hooks/useBeatData";
import { useCart } from "@/hooks/useCart";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { CartModal } from "@/components/cart/CartModal";
import { ShoppingCart, Package } from "lucide-react";

export default function KitsPage() {
  const [lang, setLang] = useState<"FR" | "EN">("FR");
  const t = translations[lang];

  const { kitsList, licensesList, branding } = useBeatData();
  const { cartItems, cartOpen, setCartOpen, cartTotal, handleAddKitToCart, handleRemoveFromCart, handleCheckout } = useCart(licensesList);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const footerText = branding?.footerText || t.footerDesc;
  const copyrightText = branding?.copyright || "© 2026 HEAVIEXO BEATS. All Rights reserved.";

  return (
    <div className="min-h-screen bg-black text-[#F4F0EB] selection:bg-[#C66B3D] selection:text-white font-sans pt-24 pb-16">
      {/* HEADER */}
      <Header viewMode="kits" setViewMode={() => {}} lang={lang} setLang={setLang} cartItemsCount={cartItems.length} onCartOpen={() => setCartOpen(true)} onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} t={t} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} setViewMode={() => {}} t={t} />

      <main className="px-4 md:px-10 pt-12 max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D]">Pro Sound Libraries</span>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Bibliothèques Pro</h1>
          <p className="text-[#888] text-sm max-w-xl mx-auto">{t.vipDesc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(kitsList) && kitsList.map((kit) => (
            <div key={kit.id} className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#C66B3D]/50 flex flex-col justify-between">
              <div>
                <div className="relative aspect-square overflow-hidden m-3 rounded-xl">
                  <img src={kit.cover} alt={kit.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4 pt-0 space-y-1">
                  <h3 className="font-bold text-base text-white truncate">{kit.title}</h3>
                  <p className="text-xs text-[#888] line-clamp-2">{kit.description}</p>
                </div>
              </div>
              <div className="p-4 pt-2 flex items-center justify-between border-t border-white/5">
                <span className="text-lg font-black text-white">${kit.price}</span>
                <button onClick={() => handleAddKitToCart(kit)} className="bg-[#C66B3D] hover:bg-[#d87847] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all">
                  <ShoppingCart className="w-3.5 h-3.5" /> Ajouter
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer t={t} setViewMode={() => {}} footerText={footerText} copyrightText={copyrightText} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} cartTotal={cartTotal} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} t={t} lang={lang} />
    </div>
  );
}