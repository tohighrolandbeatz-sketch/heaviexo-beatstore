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

  const faqList = [
    { q: "Comment se déroule la livraison des beats après l'achat ?", a: "La livraison est instantanée. Dès que votre paiement est validé par carte ou PayPal, un lien de téléchargement sécurisé contenant vos fichiers (MP3, WAV ou Stems selon la licence choisie) s'affiche et vous est envoyé par e-mail." },
    { q: "Puis-je upgrader (mettre à niveau) ma licence plus tard ?", a: "Oui, tout à fait. Si vous achetez une licence de base (MP3 ou WAV) et que votre morceau commence à tourner ou génère des streams, vous pouvez acquérir une licence supérieure en payant simplement la différence." },
    { q: "Qu'est-ce que les fichiers Stems (pistes séparées) ?", a: "Les Stems correspondent à l'export piste par piste de l'instrumentale (piste de drums, de basse, de mélodies, etc.). Ils sont indispensables pour l'ingénieur du son afin de réaliser un mixage vocal et instrumental de qualité professionnelle." },
    { q: "Quels sont les délais pour les services de Mix & Mastering ?", a: "Pour le Mix & Mastering, les fichiers finaux vous sont envoyés sous 3 à 5 jours ouvrés après réception de vos pistes vocales et instrumentales propres." },
    { q: "Quels modes de paiement acceptez-vous ?", a: "Nous acceptons les paiements par PayPal, carte bancaire (Visa, Mastercard) et Mobile Money (MTN, Moov, Celtiis)." },
    { q: "Est-ce que je perds mes droits si je n'achète qu'une licence MP3 ?", a: "Non, vous conservez tous les droits d'exploitation liés à votre licence." },
    { q: "Puis-je utiliser les beats pour des projets commerciaux (clips, pubs) ?", a: "Oui, l'usage commercial est autorisé avec toutes nos licences." },
    { q: "Que se passe-t-il si quelqu'un achète les droits exclusifs d'un beat que j'avais déjà ?", a: "Une fois les droits exclusifs vendus, le beat est retiré du store. Les licences non-exclusives achetées avant restent valables. Premier arrivé, premier servi !" },
    { q: "Proposez-vous des réductions pour les achats groupés ?", a: "Oui, nous proposons des réductions pour l'achat de plusieurs beats ou licences. Contactez-nous pour un devis personnalisé." },
    { q: "Les fichiers sont-ils marqués (tagged) ?", a: "Les previews sont watermarkées. Les fichiers achetés sont livrés propres, sans watermark." },
    { q: "Puis-je avoir un remboursement après achat ?", a: "En raison de la nature numérique des produits, les ventes sont généralement finales. Nous étudions chaque demande au cas par cas." },
    { q: "Comment fonctionne le service de Custom Beat ?", a: "Vous décrivez votre projet, vos références. Nous échangeons en direct. Vous recevez un beat exclusif avec droits complets et fichiers Stems." },
    { q: "Proposez-vous des services pour les labels et maisons de disques ?", a: "Absolument. Nous travaillons avec des labels pour des placements, synchronisations TV/Film et productions sur-mesure." },
    { q: "Est-ce que HeavieXo conserve des droits sur les beats vendus ?", a: "Pour les licences non-exclusives, HeavieXo conserve les droits de revente. Pour l'Exclusive, vous devenez propriétaire exclusif." },
    { q: "Comment puis-je vous contacter pour une collaboration ?", a: "Par email à contact@heaviexobeats.com, par WhatsApp, ou via le formulaire de contact. Nous répondons sous 24h maximum." }
  ];

  const epFeatures = [
    "Pack of 10–20 beats curated to your style",
    "You pick your favorites — keep the ones you love",
    "1 custom beat made for you — exclusive license",
    "Unlimited license on every chosen beat",
    "Unlimited video streams & audio streams",
    "Full mixing & mastering, on every track",
    "Custom cover artwork for release",
    "One producer handles beats, mix, master & artwork",
    "First demos in 48 hours • Delivery 1–2 weeks"
  ];

  const albumFeatures = [
    "Pack of 20–40 beats curated to your style",
    "You pick your favorites — keep the ones you love",
    "2 custom beats made for you — exclusive license",
    "Unlimited license on every chosen beat",
    "Unlimited video streams & audio streams",
    "Unlimited music videos & live performances",
    "Unlimited radio broadcasting rights",
    "Full mixing & mastering, on every track",
    "Custom cover artwork for release",
    "One producer handles beats, mix, master & artwork",
    "Delivery 1–3 weeks"
  ];

  return (
    <div className="min-h-screen bg-[#161311] text-[#F4F0EB] selection:bg-[#C66B3D] selection:text-white font-sans pt-20 pb-16 relative overflow-x-hidden">
      
      <Header viewMode="store" setViewMode={() => {}} lang={lang} setLang={setLang} cartItemsCount={cartItems.length} onCartOpen={() => setCartOpen(true)} onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} t={t} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} setViewMode={() => {}} t={t} />

      {/* CONTENU PRINCIPAL */}
      <main className="px-4 md:px-10 pt-12 max-w-7xl mx-auto space-y-16 pb-12">

        {/* HERO SERVICES */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D] shadow-md">
            Studio & Post-Production
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#F4F0EB] uppercase tracking-tight leading-tight">
            {t.heroTitle1 || "Pick a lane."}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97746] via-[#C66B3D] to-[#E3A857]">{t.heroTitle2 || "I'll take it from there."}</span>
          </h1>
          <p className="text-[#C2B9B0] max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">
            {t.heroSub || "You record — I handle everything else. Beats, mixing, mastering, and artwork all in one place."}
          </p>
        </section>

        {/* SECTION 1 : EP & ALBUM PACKAGES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* EP PACKAGE */}
          <div className="bg-[#1C1714]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">FULL PROJECT • 4–6 tracks</span>
                <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">EP</h3>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-[#F4F0EB]">$900</span>
                  <span className="text-xs text-[#9E938B] uppercase tracking-wider">/ project</span>
                </div>
                <p className="text-[11px] text-[#9E938B] font-bold mt-1">{t.depositInfo || "50% deposit • balance on delivery"}</p>
              </div>
              <div className="border-t border-white/10 pt-6 space-y-3.5 text-xs text-[#C2B9B0]">
                {epFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => setBookingModal({ open: true, type: "EP", title: "EP", price: "$900", features: epFeatures })}
                className="w-full bg-gradient-to-r from-[#D97746] to-[#C66B3D] hover:opacity-95 text-white font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#C66B3D]/30 flex items-center justify-center space-x-2"
              >
                <span>{t.startEp || "Start your EP →"}</span>
              </button>
            </div>
          </div>

          {/* ALBUM PACKAGE */}
          <div className="bg-[#1C1714]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">FULL PROJECT • 10+ tracks</span>
                <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">Album</h3>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-[#F4F0EB]">$1,750</span>
                  <span className="text-xs text-[#9E938B] uppercase tracking-wider">/ project</span>
                </div>
                <p className="text-[11px] text-[#9E938B] font-bold mt-1">{t.depositInfo || "50% deposit • balance on delivery"}</p>
              </div>
              <div className="border-t border-white/10 pt-6 space-y-3.5 text-xs text-[#C2B9B0]">
                {albumFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => setBookingModal({ open: true, type: "Album", title: "Album", price: "$1,750", features: albumFeatures })}
                className="w-full bg-white/10 hover:bg-white/20 text-[#F4F0EB] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.startAlbum || "Start your Album →"}</span>
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
                <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">TAILORED</span>
                <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">Custom</h3>
                <div className="mt-4"><span className="text-2xl font-bold text-[#C2B9B0]">by scope</span></div>
                <p className="text-xs text-[#C2B9B0] mt-2">Multiple bespoke beats built around your sound</p>
              </div>
              <div className="border-t border-white/10 pt-6 space-y-3 text-xs text-[#C2B9B0]">
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Fully tailored beats — no pre-made packs</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Unlimited revisions during production</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Stems + exclusive license included</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Scoped to any number of tracks</span></div>
              </div>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => setBookingModal({ open: true, type: "Custom", title: "Custom", price: "Sur Devis", features: ["Fully tailored beats", "Unlimited revisions", "Stems + exclusive license", "Scoped to any number of tracks"] })}
                className="w-full bg-white/10 hover:bg-white/20 text-[#F4F0EB] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.discussProject || "Discuss the project →"}</span>
              </button>
            </div>
          </div>

          {/* MIX & MASTER */}
          <div className="bg-[#1C1714]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">PER TRACK</span>
                <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">Mix & Master</h3>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-[#F4F0EB]">$145</span>
                  <span className="text-xs text-[#9E938B] uppercase tracking-wider">/ track</span>
                </div>
                <p className="text-xs text-[#C2B9B0] mt-2">For artists who already have their beats</p>
              </div>
              <div className="border-t border-white/10 pt-6 space-y-3 text-xs text-[#C2B9B0]">
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Professional vocal mixing & mastering</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Up to 2 revisions included</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Stem mixing available on request</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Direct line to the producer — no middlemen</span></div>
              </div>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => setBookingModal({ open: true, type: "MixMaster", title: "Mix & Master", price: "$145", features: ["Professional vocal mixing & mastering", "Up to 2 revisions", "Stem mixing available", "Direct line to the producer"] })}
                className="w-full bg-white/10 hover:bg-white/20 text-[#F4F0EB] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.levelUpSound || "Level up your sound →"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="pt-12 border-t border-white/10 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Foire Aux Questions (FAQ)</h2>
            <p className="text-xs text-[#888]">Tout ce que vous devez savoir sur nos licences, livraisons et services.</p>
          </div>
          <div className="space-y-4">
            {faqList.map((item, index) => {
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