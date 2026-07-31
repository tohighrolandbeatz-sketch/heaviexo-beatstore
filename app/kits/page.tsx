'use client';

import React, { useState } from "react";
import { translations } from "@/constants/translations";
import { useBeatData } from "@/hooks/useBeatData";
import { useCart } from "@/hooks/useCart";
import { useTracking } from "@/hooks/useTracking";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { CartModal } from "@/components/cart/CartModal";
import { ShoppingCart, Package, Download, HardDrive } from "lucide-react";

export default function KitsPage() {
  const [lang, setLang] = useState<"FR" | "EN">("FR");
  const t = translations[lang];

  const { kitsList, licensesList, branding } = useBeatData();
  const { cartItems, cartOpen, setCartOpen, cartTotal, handleAddKitToCart, handleRemoveFromCart, handleCheckout } = useCart(licensesList);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useTracking();

  const footerText = branding?.footerText || t.footerDesc;

  return (
    <div className="min-h-screen bg-black text-[#F4F0EB] font-sans pt-24 pb-16 relative overflow-x-hidden">
      <Header viewMode="kits" setViewMode={() => {}} lang={lang} setLang={setLang} cartItemsCount={cartItems.length} onCartOpen={() => setCartOpen(true)} onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} t={t} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} setViewMode={() => {}} t={t} />

      <main className="px-4 md:px-10 pt-6 max-w-7xl mx-auto pb-20">
        <section className="text-center mb-16 space-y-4">
          <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D]">
            {t.soundKits}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            Sound Kits & Drumkits
          </h1>
          <p className="text-[#C2B9B0] max-w-xl mx-auto text-sm">
            Des kits de production professionnels pour élever votre son. Chaque kit contient des samples, des drums, des loops et des presets de haute qualité.
          </p>
        </section>

        {kitsList.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-[#333] mx-auto mb-4" />
            <p className="text-[#888]">Aucun Sound Kit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kitsList.map((kit: any) => (
              <div key={kit.id} className="bg-[#111]/90 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all group">
                <div className="relative aspect-square overflow-hidden">
                  <img src={kit.cover || '/placeholder.jpg'} alt={kit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] text-[#C66B3D] font-bold uppercase tracking-wider bg-black/50 px-2 py-1 rounded-full">
                      {kit.category || 'Kit'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{kit.title}</h3>
                    <p className="text-xs text-[#888] mt-1 line-clamp-2">{kit.description || 'Kit de production professionnel'}</p>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-[#888]">
                    {kit.itemCount && (
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" /> {kit.itemCount}
                      </span>
                    )}
                    {kit.fileSize && (
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" /> {kit.fileSize}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xl font-black text-white">${kit.price || '24.99'}</span>
                    <button
                      onClick={() => handleAddKitToCart(kit)}
                      className="bg-[#C66B3D] hover:bg-[#FF8C5A] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#C66B3D]/20"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {t.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer t={t} setViewMode={() => {}} footerText={footerText} copyrightText="© 2026 HEAVIEXO BEATS" />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} cartTotal={cartTotal} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} t={t} lang={lang} />
    </div>
  );
}