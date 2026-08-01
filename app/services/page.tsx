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
import { Check } from "lucide-react";
import { useBranding } from "@/components/ThemeProvider";

export default function ServicesPage() {
  const [lang, setLang] = useState<"FR" | "EN">("FR");
  const t = translations[lang];
  const { licensesList, branding } = useBeatData();
  const { branding: designBranding } = useBranding();
  const { cartItems, cartOpen, setCartOpen, cartTotal, handleRemoveFromCart, handleCheckout } = useCart(licensesList);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [bookingModal, setBookingModal] = useState<any>({ open: false, type: "", title: "", price: "", features: [] });

  const servicesConfig = designBranding?.servicesConfig || {};
  const footerText = branding?.footerText || t.footerDesc;
  const copyrightText = branding?.copyright || "© 2026 HEAVIEXO BEATS";

  const packages = [
    { key: 'ep', type: 'EP' },
    { key: 'album', type: 'Album' },
    { key: 'custom', type: 'Custom' },
    { key: 'mixmaster', type: 'MixMaster' },
  ];

  const faq = servicesConfig?.faq || [];

  return (
    <div className="min-h-screen bg-[#161311] text-[#F4F0EB] selection:bg-[#C66B3D] selection:text-white font-sans pt-20 pb-16 relative overflow-x-hidden">
      <Header viewMode="store" setViewMode={() => {}} lang={lang} setLang={setLang} cartItemsCount={cartItems.length} onCartOpen={() => setCartOpen(true)} onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} t={t} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} setViewMode={() => {}} t={t} />

      <main className="px-4 md:px-10 pt-12 max-w-7xl mx-auto space-y-16 pb-12">
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D] shadow-md">{t.studioBadge}</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#F4F0EB] uppercase tracking-tight leading-tight">{t.heroTitle1}<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97746] via-[#C66B3D] to-[#E3A857]">{t.heroTitle2}</span></h1>
          <p className="text-[#C2B9B0] max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">{t.heroSub}</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {packages.filter(p => p.key === 'ep' || p.key === 'album').map(({ key, type }) => {
            const cfg = servicesConfig[key] || {};
            const features = cfg.features || [];
            return (
              <div key={key} className="bg-[#1C1714]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">{cfg.subtitle || key.toUpperCase()}</span>
                    <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">{cfg.title || type}</h3>
                    <div className="flex items-baseline space-x-2 mt-4">
                      <span className="text-4xl md:text-5xl font-black text-[#F4F0EB]">{cfg.price || '$900'}</span>
                      <span className="text-xs text-[#9E938B] uppercase tracking-wider">/ project</span>
                    </div>
                    <p className="text-[11px] text-[#9E938B] font-bold mt-1">{t.depositInfo}</p>
                  </div>
                  <div className="border-t border-white/10 pt-6 space-y-3.5 text-xs text-[#C2B9B0]">
                    {features.map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>{feat}</span></div>
                    ))}
                  </div>
                </div>
                <div className="pt-8">
                  <button onClick={() => setBookingModal({ open: true, type, title: cfg.title || type, price: cfg.price || '$900', features })}
                    className="w-full bg-gradient-to-r from-[#D97746] to-[#C66B3D] hover:opacity-95 text-white font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center">
                    <span>{key === 'ep' ? t.startEp : t.startAlbum}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {packages.filter(p => p.key === 'custom' || p.key === 'mixmaster').map(({ key, type }) => {
            const cfg = servicesConfig[key] || {};
            const features = cfg.features || [];
            return (
              <div key={key} className="bg-[#1C1714]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">{cfg.subtitle || key.toUpperCase()}</span>
                    <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">{cfg.title || type}</h3>
                    <div className="flex items-baseline space-x-2 mt-4">
                      <span className="text-4xl md:text-5xl font-black text-[#F4F0EB]">{cfg.price || '$145'}</span>
                      {key === 'mixmaster' && <span className="text-xs text-[#9E938B] uppercase tracking-wider">/ track</span>}
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-6 space-y-3.5 text-xs text-[#C2B9B0]">
                    {features.map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>{feat}</span></div>
                    ))}
                  </div>
                </div>
                <div className="pt-8">
                  <button onClick={() => setBookingModal({ open: true, type, title: cfg.title || type, price: cfg.price || '$145', features })}
                    className="w-full bg-white/10 hover:bg-white/20 text-[#F4F0EB] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center">
                    <span>{key === 'custom' ? t.discussProject : t.levelUpSound}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {faq.length > 0 && (
          <section className="pt-12 border-t border-white/10 max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{t.faqTitle}</h2>
              <p className="text-xs text-[#888]">{t.faqSubtitle}</p>
            </div>
            <div className="space-y-4">
              {faq.map((item: any, index: number) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} onClick={() => setOpenFaqIndex(isOpen ? null : index)} className="bg-[#111] border border-white/5 rounded-2xl p-6 cursor-pointer transition-all hover:border-white/10">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm md:text-base text-white pr-4">{item.q}</h4>
                      <span className={`text-[#888] transition-transform duration-300 flex-shrink-0 text-lg ${isOpen ? 'rotate-180 text-[#C66B3D]' : ''}`}>▼</span>
                    </div>
                    {isOpen && <p className="mt-4 text-xs md:text-sm text-[#999] leading-relaxed pt-3 border-t border-white/5">{item.a}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer t={t} setViewMode={() => {}} footerText={footerText} copyrightText={copyrightText} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} cartTotal={cartTotal} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} t={t} lang={lang} />
      <ServiceBookingModal isOpen={bookingModal.open} onClose={() => setBookingModal({ open: false, type: "", title: "", price: "", features: [] })} packageTitle={bookingModal.title} packagePrice={bookingModal.price} packageFeatures={bookingModal.features} packageType={bookingModal.type as any} />
    </div>
  );
}