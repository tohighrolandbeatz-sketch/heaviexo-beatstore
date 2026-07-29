'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Menu,
  X,
  Check,
  Trash2,
  Smartphone,
  CreditCard,
  ShieldCheck,
  MessageCircle,
  User,
  Mail,
  ExternalLink,
  Package
} from "lucide-react";
import Link from "next/link";

const PHONE_WHATSAPP = "2290156646409";

const translations = {
  FR: {
    beatstore: "Beatstore",
    soundKits: "Sound Kits & Loops",
    services: "Services Studio",
    heroTitle1: "Pick a lane.",
    heroTitle2: "I'll take it from there.",
    heroSub: "You record — I handle everything else. Beats, mixing, mastering, and artwork all in one place. No jumping between producers, engineers, and designers.",
    reserve: "Réserver",
    footerDesc: "Studio de production musicale haute définition. Beats originaux, Sound Kits professionnels & ingénierie sonore sur-mesure.",
    vipClub: "VIP Club Beatmaker",
    vipDesc: "Recevez gratuitement 5 boucles exclusives par mois et l'accès prioritaire aux nouveaux beats.",
    cartTitle: "Mon Panier",
    emptyCart: "Votre panier est vide",
    selectBeatOrKit: "Sélectionnez un beat ou un Sound Kit pour démarrer.",
    paymentMode: "Mode de Règlement :",
    totalToPay: "Total à payer :",
    securedPayment: "Paiement sécurisé • Traitement direct instantané",
    artistInfo: "Informations d'Artiste",
    artistName: "Nom d'Artiste / Groupe",
    emailAddr: "Adresse E-mail (pour livraison)",
    momoRedirect: "Valider via Mobile Money (WhatsApp)",
    paypalRedirect: "Procéder au Paiement PayPal",
    yourEmail: "Votre e-mail...",
    securePayments: "Paiements Sécurisés",
    paypalCard: "PayPal / Carte Bancaire",
    mobileMoney: "Mobile Money",
    catalogueTitle: "Catalogue",
    darkTrapBeats: "Dark Trap Beats",
    melodicDrill: "Melodic Drill",
    afroAmapiano: "Afro & Amapiano",
    soundkitsDrumkits: "Soundkits & Drumkits",
    engineeringServices: "Ingénierie & Services",
    mixingStemsPro: "Mixage Stems Pro",
    masteringAnalog: "Mastering Analogique",
    customProd: "Prod Sur-Mesure",
    licenseContracts: "Contrats de Licences",
    popular: "POPULAR",
    depositInfo: "50% deposit • balance on delivery",
    startEp: "Start your EP →",
    startAlbum: "Start your Album →",
    discussProject: "Discuss the project →",
    levelUpSound: "Level up your sound →"
  },
  EN: {
    beatstore: "Beatstore",
    soundKits: "Sound Kits & Loops",
    services: "Studio Services",
    heroTitle1: "Pick a lane.",
    heroTitle2: "I'll take it from there.",
    heroSub: "You record — I handle everything else. Beats, mixing, mastering, and artwork all in one place. No jumping between producers, engineers, and designers.",
    reserve: "Book Now",
    footerDesc: "High-definition music production studio. Original beats, pro sound kits & custom audio engineering.",
    vipClub: "Beatmaker VIP Club",
    vipDesc: "Get 5 free exclusive loops every month and priority access to new beat drops.",
    cartTitle: "My Cart",
    emptyCart: "Your cart is empty",
    selectBeatOrKit: "Select a beat or a Sound Kit to get started.",
    paymentMode: "Payment Method:",
    totalToPay: "Total to pay:",
    securedPayment: "Secured payment • Instant direct processing",
    artistInfo: "Artist Information",
    artistName: "Artist / Stage Name",
    emailAddr: "Email Address (for delivery)",
    momoRedirect: "Confirm via Mobile Money (WhatsApp)",
    paypalRedirect: "Proceed with PayPal",
    yourEmail: "Your email...",
    securePayments: "Secure Payments",
    paypalCard: "PayPal / Credit Card",
    mobileMoney: "Mobile Money",
    catalogueTitle: "Catalogue",
    darkTrapBeats: "Dark Trap Beats",
    melodicDrill: "Melodic Drill",
    afroAmapiano: "Afro & Amapiano",
    soundkitsDrumkits: "Soundkits & Drumkits",
    engineeringServices: "Engineering & Services",
    mixingStemsPro: "Pro Stems Mixing",
    masteringAnalog: "Analog Mastering",
    customProd: "Custom Production",
    licenseContracts: "License Contracts",
    popular: "POPULAR",
    depositInfo: "50% deposit • balance on delivery",
    startEp: "Start your EP →",
    startAlbum: "Start your Album →",
    discussProject: "Discuss the project →",
    levelUpSound: "Level up your sound →"
  }
};

export default function ServicesPage() {
  const [lang, setLang] = useState<"FR" | "EN">("FR");
  const t = translations[lang];

  const [openIndex, setOpenIndex] = useState<number | null>(15);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "momo">("momo");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [branding, setBranding] = useState<any>(null);

  useEffect(() => {
    fetch("/api/design", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.branding) setBranding(data.branding);
      })
      .catch(() => {});
  }, []);

  const footerText = branding?.footerText || t.footerDesc;
  const copyrightText = branding?.copyright || "© 2026 HEAVIEXO BEATS. Tous droits réservés.";
  const socialInstagram = branding?.socials?.instagram || "";
  const socialYoutube = branding?.socials?.youtube || "";
  const socialTelegram = branding?.socials?.telegram || "";

  const faqs = [
    { q: "Do I need a professional studio to record?", a: "No — but your recording needs to be clean. No background noise, no room echo, and no headphone bleed into the mic (record with speakers off or use in-ear monitors while tracking). Mixing and mastering can polish a clean home recording into something release-ready, but it can't fix a noisy or roomy take. A basic condenser mic in a treated space — even a closet full of clothes — is enough. A lot of the artists I've worked with recorded in their bedroom and it came out great." },
    { q: "What if I'm not happy with the result?", a: "If after 2 revision rounds you're not happy with a track, I'll redo it free until you are. If you're still not satisfied — you keep the work and I refund 50%." },
    { q: "Can I release the project on Spotify, Apple Music, and YouTube?", a: "Yes, on every platform worldwide — Spotify, Apple Music, YouTube, Tidal, Amazon Music, anywhere you want to distribute. The unlimited license covers all of them with no geographical restrictions." },
    { q: "Is there a formal contract?", a: "Yes. Before anything starts I send over a license agreement that spells out exactly what's included, the rights you're getting, payment terms, and the delivery timeline. Nothing moves forward without both sides signing. It protects you as much as it protects me." },
    { q: "How does payment work?", a: "50% deposit to lock the project and start the pack. Remaining 50% on delivery. I accept PayPal, Apple Pay, credit/debit card, and crypto — whatever's easiest for you." },
    { q: "How long does a full project take?", a: "First demos arrive within 48 hours. A full EP usually takes 1–3 weeks; a full album 2–4 weeks." },
    { q: "What does 'unlimited license' actually mean?", a: "Every beat comes with unlimited audio streams, unlimited video streams, unlimited music video releases, unlimited live for-profit performances, and unlimited radio broadcasting — no caps, no expiration date on the license." },
    { q: "What if I have a small budget or just want to work on 1–2 tracks?", a: "Yes, absolutely. Not every project needs a full EP or album deal. If you want to start small, the Mix & Master service starts at $145 per track — no package required, just send your stems and I'll handle the rest. If you need beats too, the Custom package can be scoped to any number of tracks." },
    { q: "How does the beat selection work?", a: "First, we hop on a quick dm/call where I learn your sound — references, vibe, what the project needs. I also lock in the direction for your custom beat (1 for EP, 2 for Album) before I produce it. Then I build the custom beat, put together a curated pack tailored to your style, and send everything together. The custom beat with exclusive license is included in the pack — you pick what you love from the rest, and only those get the unlimited license." },
    { q: "Can I get exclusive rights to the beats?", a: "By default every beat comes with an unlimited license — full commercial rights across all platforms, no streaming caps, no expiration. On top of that, every EP includes 1 custom beat made exclusively for you, and every Album includes 2 — built from scratch around your sound, with a full exclusive license included in the package price. If you want additional beats locked exclusively to your project, exclusivity can be added for an extra fee. We'll work out the details on the discovery call." },
    { q: "What if I want changes after delivery?", a: "Each track gets up to 2 revision rounds during production. After final delivery, paid revisions are available if needed." },
    { q: "Is this fully remote? Do I need to be in your city?", a: "Fully remote. I work with artists from the US, Europe, Latin America, and everywhere in between. Everything happens over Telegram, Instagram or iMessage — references, feedback, file delivery. You never need to be in the same room." },
    { q: "Can I get the stems and trackouts?", a: "Yes — final mixes, masters, trackouts, and stems are delivered with the project." },
    { q: "What genres do you produce?", a: "Trap, hip hop, R&B, old school, jazz rap, melodic — essentially anything in the hip-hop culture umbrella." },
    { q: "What if I want a custom beat that wasn't in the pack?", a: "The Custom package includes multiple bespoke beats. For EP and Album tiers, custom beats can be added on top — we'll scope it during the call." },
    { q: "How many artists do you work with at once?", a: "One active project at a time. I don't stack clients. When I'm working on your EP or album, that's where my full attention goes — not split across five other projects. That's also why there's usually only one slot open at a time." }
  ];

  const cartTotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || cartItems.length === 0) return;
    const itemsSummary = cartItems.map((item, idx) => `${idx + 1}. ${item.title} - $${item.price}`).join("%0A");
    const message = `*COMMANDE SERVICES HEAVIEXO*%0A%0A*Artiste:* ${encodeURIComponent(customerName)}%0A*Email:* ${encodeURIComponent(customerEmail)}%0A%0A*Panier:*%0A${itemsSummary}%0A%0A*Total:* $${cartTotal}%0A*Mode de Paiement:* Mobile Money`;
    window.open(`https://wa.me/${PHONE_WHATSAPP}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#161311] text-[#F4F0EB] selection:bg-[#C66B3D] selection:text-white font-sans pt-20 pb-24 relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#221B17_1px,transparent_1px),linear-gradient(to_bottom,#221B17_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] opacity-30 pointer-events-none" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C66B3D]/15 blur-[160px] pointer-events-none rounded-full" />

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-[#161311]/85 px-4 md:px-8 py-3 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <Link href="/" className="flex items-center">
          <img src="/LOGO-BEAT.png" alt="HEAVIEXO BEATS" className="h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity" />
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-[#C2B9B0]">
          <Link href="/" className="hover:text-[#F4F0EB] transition-colors">{t.beatstore}</Link>
          <Link href="/" className="hover:text-[#F4F0EB] transition-colors flex items-center space-x-1.5"><Package className="w-3.5 h-3.5" /><span>{t.soundKits}</span></Link>
          <Link href="/services" className="text-[#C66B3D] transition-colors">{t.services}</Link>
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div onClick={() => setLang(lang === "FR" ? "EN" : "FR")} className="relative flex items-center bg-[#2D231E] rounded-full p-1 cursor-pointer w-20 h-8 select-none shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <motion.div className="absolute top-1 bottom-1 w-8 bg-[#C66B3D] rounded-full shadow-md shadow-[#C66B3D]/40" animate={{ left: lang === "FR" ? "4px" : "calc(100% - 36px)" }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
            <div className="relative z-10 flex w-full justify-between px-2 text-[10px] font-black uppercase tracking-wider">
              <span className={`transition-colors ${lang === "FR" ? "text-white font-extrabold" : "text-[#9E938B]"}`}>FR</span>
              <span className={`transition-colors ${lang === "EN" ? "text-white font-extrabold" : "text-[#9E938B]"}`}>EN</span>
            </div>
          </div>

          <button onClick={() => setCartOpen(true)} className="bg-[#2D231E] hover:bg-[#382B25] px-3.5 py-2 rounded-full text-[10px] font-extrabold tracking-widest uppercase transition-all flex items-center space-x-1.5 text-[#F4F0EB] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <ShoppingCart className="w-3.5 h-3.5 text-[#C66B3D]" />
            <span>({cartItems.length})</span>
          </button>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#F4F0EB] bg-[#2D231E] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#C66B3D]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* CONTENU PACKAGES & SERVICES */}
      <main className="px-4 md:px-8 pt-12 max-w-7xl mx-auto space-y-16 animate-fadeIn">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#F4F0EB] uppercase leading-tight">
            {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97746] via-[#C66B3D] to-[#E3A857]">{t.heroTitle2}</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#C2B9B0] leading-relaxed max-w-2xl mx-auto font-medium">
            {t.heroSub}
          </p>
        </div>

        {/* SECTION 1 : EP & ALBUM PACKAGES (2 colonnes) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* EP PACKAGE */}
          <div className="bg-[#1C1714]/90 border border-[#C66B3D]/50 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between relative shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="absolute top-6 right-6 bg-[#C66B3D] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              {t.popular}
            </div>
            
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">MOST POPULAR • 3–7 tracks</span>
                <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">EP</h3>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-[#F4F0EB]">$900</span>
                  <span className="text-xs text-[#9E938B] uppercase tracking-wider">/ project</span>
                </div>
                <p className="text-[11px] text-[#C66B3D] font-bold mt-1">{t.depositInfo}</p>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-3.5 text-xs text-[#C2B9B0]">
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Pack of 10–20 beats curated to your style</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>You pick your favorites — keep the ones you love</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span><strong>1 custom beat made for you</strong> — exclusive license</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span><strong>Unlimited license</strong> on every chosen beat</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Unlimited video streams & audio streams</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Unlimited music videos & live performances</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Unlimited radio broadcasting rights</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Full mixing & mastering, on every track</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Up to 2 revisions per track</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Custom cover artwork for release</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>One producer handles beats, mix, master & artwork — no vendor juggling</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Sounds competitive next to major releases</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>First demos in 48 hours • Delivery 1–2 weeks</span></div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => setCartItems([...cartItems, { cartId: Date.now().toString(), title: "EP Package (Full Project)", price: "900.00" }])}
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
                <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">FULL PROJECT • 10+ tracks</span>
                <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">Album</h3>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-[#F4F0EB]">$1,750</span>
                  <span className="text-xs text-[#9E938B] uppercase tracking-wider">/ project</span>
                </div>
                <p className="text-[11px] text-[#9E938B] font-bold mt-1">{t.depositInfo}</p>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-3.5 text-xs text-[#C2B9B0]">
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Pack of 20–40 beats curated to your style</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>You pick your favorites — keep the ones you love</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span><strong>2 custom beats made for you</strong> — exclusive license</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span><strong>Unlimited license</strong> on every chosen beat</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Unlimited video streams & audio streams</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Unlimited music videos & live performances</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Unlimited radio broadcasting rights</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Full mixing & mastering, on every track</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Up to 2 revisions per track</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Custom cover artwork for release</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>One producer handles beats, mix, master & artwork — no vendor juggling</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Sounds competitive next to major releases</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Delivery 1–3 weeks</span></div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => setCartItems([...cartItems, { cartId: Date.now().toString(), title: "Album Package (Full Project)", price: "1750.00" }])}
                className="w-full bg-white/10 hover:bg-white/20 text-[#F4F0EB] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.startAlbum}</span>
              </button>
            </div>
          </div>

        </div>

        {/* SECTION 2 : CUSTOM & MIX & MASTER (2 colonnes) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CUSTOM PACKAGE */}
          <div className="bg-[#1C1714]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">TAILORED</span>
                <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">Custom</h3>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-[#C2B9B0]">by scope</span>
                </div>
                <p className="text-xs text-[#9E938B] font-medium mt-1">Built around your release plan</p>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-3.5 text-xs text-[#C2B9B0]">
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Anything outside the standard EP/Album lanes</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Mixtapes, joint projects, deluxe editions</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Built entirely around your references</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Multiple custom beats — fully bespoke</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Exclusive license on everything</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Full mixing & mastering, on every track</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Trackouts & stems delivered</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Custom cover artwork for release</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>One producer handles beats, mix, master & artwork — no vendor juggling</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Sounds competitive next to major releases</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Timeline scoped to your release date</span></div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => setCartItems([...cartItems, { cartId: Date.now().toString(), title: "Custom Project", price: "399.00" }])}
                className="w-full bg-white/10 hover:bg-white/20 text-[#F4F0EB] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.discussProject}</span>
              </button>
            </div>
          </div>

          {/* MIX & MASTER SERVICE */}
          <div className="bg-[#1C1714]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-[#9E938B] uppercase tracking-widest block mb-1">STANDALONE SERVICE</span>
                <h3 className="text-4xl font-black text-[#F4F0EB] uppercase tracking-tight">Mix & Master</h3>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-4xl md:text-5xl font-black text-[#C66B3D]">$145</span>
                  <span className="text-xs text-[#9E938B] uppercase tracking-wider">/ track</span>
                </div>
                <p className="text-[11px] text-[#9E938B] font-bold mt-1">No project lock-in • pay per track</p>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-3.5 text-xs text-[#C2B9B0]">
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Full song mix — punch, clarity, space & balance</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Reference track matching</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Mastering for Spotify, Apple Music, YouTube & beyond</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>WAV & MP3 delivery included</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>2 revisions included</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Turnaround: 24–48 hours</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Works on any beat — not just OUGHY packs</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Stem mixing available on request</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Direct line to the producer — no middlemen</span></div>
                <div className="flex items-start space-x-3"><Check className="w-4 h-4 text-[#C66B3D] flex-shrink-0 mt-0.5" /><span>Sounds competitive next to major releases</span></div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => setCartItems([...cartItems, { cartId: Date.now().toString(), title: "Mix & Master (Standalone)", price: "145.00" }])}
                className="w-full bg-white/10 hover:bg-white/20 text-[#F4F0EB] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.levelUpSound}</span>
              </button>
            </div>
          </div>

        </div>

        {/* SECTION FAQ INTÉGRÉE */}
        <section id="faq" className="pt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <span className="text-[11px] text-[#C66B3D] uppercase tracking-[2px] font-bold block mb-2">08 — Questions</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#F4F0EB]">FAQ.</h2>
            </div>
            <p className="text-[#9E938B] text-xs md:text-sm">Anything not covered here? DM me on Instagram or Telegram — usually reply same day.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="bg-[#171513] border border-[#26221f] rounded-2xl p-5 md:p-6 shadow-md">
                  <div 
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex justify-between items-center cursor-pointer font-bold text-sm md:text-base text-[#F4F0EB]"
                  >
                    <span>{faq.q}</span>
                    <span className={`transform transition-transform duration-200 text-[#C66B3D] ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                      <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"></path></svg>
                    </span>
                  </div>
                  {isOpen && (
                    <div className="text-[#C2B9B0] text-xs md:text-sm leading-relaxed mt-4 border-t border-[#26221f] pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 bg-[#161311]/95 backdrop-blur-xl px-4 md:px-8 py-12 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <img src="/LOGO-BEAT.png" alt="HEAVIEXO BEATS" className="h-10 w-auto object-contain" />
            <p className="text-xs text-[#C2B9B0] leading-relaxed">{footerText}</p>
            <div className="flex items-center space-x-3 text-[#C2B9B0]">
              {socialInstagram && <a href={socialInstagram} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#29201C] hover:text-[#C66B3D] transition-colors shadow-md"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>}
              {socialYoutube && <a href={socialYoutube} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#29201C] hover:text-[#C66B3D] transition-colors shadow-md"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>}
              {socialTelegram && <a href={socialTelegram} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#29201C] hover:text-[#C66B3D] transition-colors shadow-md"><MessageCircle className="w-4 h-4" /></a>}
            </div>
          </div>

          <div>
            <h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">{t.catalogueTitle}</h5>
            <ul className="space-y-2 text-xs text-[#C2B9B0] font-medium">
              <li><Link href="/" className="hover:text-[#C66B3D] transition-colors">{t.darkTrapBeats}</Link></li>
              <li><Link href="/" className="hover:text-[#C66B3D] transition-colors">{t.melodicDrill}</Link></li>
              <li><Link href="/" className="hover:text-[#C66B3D] transition-colors">{t.afroAmapiano}</Link></li>
              <li><Link href="/" className="hover:text-[#C66B3D] transition-colors">{t.soundkitsDrumkits}</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">{t.engineeringServices}</h5>
            <ul className="space-y-2 text-xs text-[#C2B9B0] font-medium">
              <li><Link href="/services" className="hover:text-[#C66B3D] transition-colors">{t.mixingStemsPro}</Link></li>
              <li><Link href="/services" className="hover:text-[#C66B3D] transition-colors">{t.masteringAnalog}</Link></li>
              <li><Link href="/services" className="hover:text-[#C66B3D] transition-colors">{t.customProd}</Link></li>
              <li><Link href="/services" className="hover:text-[#C66B3D] transition-colors">{t.licenseContracts}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB]">{t.vipClub}</h5>
            <p className="text-xs text-[#C2B9B0] leading-relaxed">{t.vipDesc}</p>
            <div className="flex items-center space-x-2">
              <input type="email" placeholder={t.yourEmail} className="bg-[#29201C] rounded-xl px-3 py-2 text-xs text-[#F4F0EB] focus:outline-none focus:ring-1 focus:ring-[#C66B3D] w-full shadow-inner" />
              <button className="bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold px-4 py-2 rounded-xl text-xs uppercase transition-transform active:scale-95 shadow-md shadow-[#C66B3D]/30">OK</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#9E938B] font-medium">
          <p>{copyrightText}</p>
          <div className="flex items-center space-x-4">
            <span>{t.securePayments}</span><span className="text-[#C66B3D]">•</span><span>{t.paypalCard}</span><span className="text-[#C66B3D]">•</span><span>{t.mobileMoney}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}