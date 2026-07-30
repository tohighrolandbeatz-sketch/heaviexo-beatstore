'use client';

import React, { useState } from "react";
import { translations } from "@/constants/translations";
import { useCart } from "@/hooks/useCart";
import { useBeatData } from "@/hooks/useBeatData";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { CartModal } from "@/components/cart/CartModal";
import { ServiceBookingModal } from "@/components/cart/ServiceBookingModal";
import { Check, ChevronDown } from "lucide-react";

export default function ServicesPage() {
  const [lang, setLang] = useState<"FR" | "EN">("FR");
  const t = translations[lang];

  const { licensesList, branding } = useBeatData();
  const { cartItems, cartOpen, setCartOpen, cartTotal, handleRemoveFromCart, handleCheckout } = useCart(licensesList);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [bookingModal, setBookingModal] = useState<{
    open: boolean;
    type: string;
    title: string;
    price: string;
    features: string[];
  }>({ open: false, type: "", title: "", price: "", features: [] });

  const footerText = branding?.footerText || t.footerDesc;
  const copyrightText = branding?.copyright || "© 2026 HEAVIEXO BEATS. All Rights reserved.";

  return (
    <div className="min-h-screen bg-[#161311] text-[#F4F0EB] selection:bg-[#C66B3D] selection:text-white font-sans pt-20 pb-16 relative overflow-x-hidden">
      
      <Header viewMode="store" setViewMode={() => {}} lang={lang} setLang={setLang} cartItemsCount={cartItems.length} onCartOpen={() => setCartOpen(true)} onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} t={t} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} setViewMode={() => {}} t={t} />

      <main className="px-4 md:px-10 pt-12 max-w-7xl mx-auto space-y-16 pb-12">

        {/* HERO SERVICES */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D] shadow-md">
            {t.studioBadge}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#F4F0EB] uppercase tracking-tight leading-tight">
            {t.heroTitle1}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97746] via-[#C66B3D] to-[#E3A857]">{t.heroTitle2}</span>
          </h1>
          <p className="text-[#C2B9B0] max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">
            {t.heroSub}
          </p>
        </section>

        {/* SECTION 1 : EP & ALBUM PACKAGES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* EP PACKAGE */}
          <div className="bg-[#1C1714]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">{t.fullProject}</span>
                <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">EP</h3>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-[#F4F0EB]">$900</span>
                  <span className="text-xs text-[#9E938B] uppercase tracking-wider">/ project</span>
                </div>
                <p className="text-[11px] text-[#9E938B] font-bold mt-1">{t.depositInfo}</p>
              </div>
              <div className="border-t border-white/10 pt-6 space-y-3.5 text-xs text-[#C2B9B0]">
                {t.epFeatures.map((feat: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => setBookingModal({ open: true, type: "EP", title: "EP", price: "$900", features: t.epFeatures })}
                className="w-full bg-gradient-to-r from-[#D97746] to-[#C66B3D] hover:opacity-95 text-white font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#C66B3D]/30 flex items-center justify-center space-x-2"
              >
                <span>{t.startEp}</span>
              </button>
            </div>
          </div>

          {/* ALBUM PACKAGE */}
          <div className="bg-[#1C1714]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">{t.albumProject}</span>
                <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">Album</h3>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-[#F4F0EB]">$1,750</span>
                  <span className="text-xs text-[#9E938B] uppercase tracking-wider">/ project</span>
                </div>
                <p className="text-[11px] text-[#9E938B] font-bold mt-1">{t.depositInfo}</p>
              </div>
              <div className="border-t border-white/10 pt-6 space-y-3.5 text-xs text-[#C2B9B0]">
                {t.albumFeatures.map((feat: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => setBookingModal({ open: true, type: "Album", title: "Album", price: "$1,750", features: t.albumFeatures })}
                className="w-full bg-white/10 hover:bg-white/20 text-[#F4F0EB] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.startAlbum}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2 : CUSTOM & MIX & MASTER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CUSTOM PACKAGE */}
          <div className="bg-[#1C1714]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">{t.tailored}</span>
                <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">Custom</h3>
                <div className="mt-4"><span className="text-2xl font-bold text-[#C2B9B0]">by scope</span></div>
                <p className="text-xs text-[#C2B9B0] mt-2">Multiple bespoke beats built around your sound</p>
              </div>
              <div className="border-t border-white/10 pt-6 space-y-3 text-xs text-[#C2B9B0]">
                {t.customFeatures.map((feat: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>{feat}</span></div>
                ))}
              </div>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => setBookingModal({ open: true, type: "Custom", title: "Custom", price: "Sur Devis", features: t.customFeatures })}
                className="w-full bg-white/10 hover:bg-white/20 text-[#F4F0EB] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.discussProject}</span>
              </button>
            </div>
          </div>

          {/* MIX & MASTER */}
          <div className="bg-[#1C1714]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">{t.perTrack}</span>
                <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">Mix & Master</h3>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-[#F4F0EB]">$145</span>
                  <span className="text-xs text-[#9E938B] uppercase tracking-wider">/ track</span>
                </div>
                <p className="text-xs text-[#C2B9B0] mt-2">For artists who already have their beats</p>
              </div>
              <div className="border-t border-white/10 pt-6 space-y-3 text-xs text-[#C2B9B0]">
                {t.mixMasterFeatures.map((feat: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>{feat}</span></div>
                ))}
              </div>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => setBookingModal({ open: true, type: "MixMaster", title: "Mix & Master", price: "$145", features: t.mixMasterFeatures })}
                className="w-full bg-white/10 hover:bg-white/20 text-[#F4F0EB] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.levelUpSound}</span>
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="pt-12 border-t border-white/10 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{t.faqTitle}</h2>
            <p className="text-xs text-[#888]">{t.faqSubtitle}</p>
          </div>
          <div className="space-y-4">
            {t.faq.map((item: any, index: number) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} onClick={() => setOpenFaqIndex(isOpen ? null : index)} className="bg-[#111] border border-white/5 rounded-2xl p-6 cursor-pointer transition-all hover:border-white/10">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm md:text-base text-white pr-4">{item.q}</h4>
                    <span className={`text-[#888] transition-transform duration-300 flex-shrink-0 text-lg ${isOpen ? 'rotate-180 text-[#C66B3D]' : ''}`}>▼</span>
                  </div>
                  {isOpen && <p className="mt-4 text-xs md:text-sm text-[#999] leading-relaxed pt-3 border-t border-white/5 animate-fadeIn">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer t={t} setViewMode={() => {}} footerText={footerText} copyrightText={copyrightText} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} cartTotal={cartTotal} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} t={t} lang={lang} />
      
      <ServiceBookingModal 
        isOpen={bookingModal.open} 
        onClose={() => setBookingModal({ open: false, type: "", title: "", price: "", features: [] })} 
        packageTitle={bookingModal.title} 
        packagePrice={bookingModal.price} 
        packageFeatures={bookingModal.features} 
        packageType={bookingModal.type as any} 
      />
    </div>
  );
}