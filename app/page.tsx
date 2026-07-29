'use client';

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Search, 
  ShoppingCart, 
  Volume2, 
  VolumeX,
  SkipBack, 
  SkipForward,
  Menu,
  X,
  SlidersHorizontal,
  ChevronLeft,
  Package,
  Music2
} from "lucide-react";
import Link from "next/link";

const PHONE_WHATSAPP = "2290156646409";

const translations = {
  FR: {
    beatstore: "Beatstore",
    soundKits: "Sound Kits & Loops",
    services: "Services Studio",
    heroBadge: "Architecture Sonore d'Exception",
    heroTitle1: "Your next project,",
    heroTitle2: "fully produced.",
    heroSub: "End-to-end production for hip-hop artists releasing their next EP, mixtape, or album. Beats, mix, master, cover art — handled by one producer. You write and record. I deliver release-ready.",
    letsBuild: "Let's Build Your Project →",
    statArtists: "ARTISTES SERVIS",
    statExp: "ANS D'EXPÉRIENCE",
    statDemos: "PREMIERS DEMOS",
    searchPlaceholder: "Rechercher titre, genre, mood...",
    addToCart: "Ajouter au Panier",
    getLicense: "Obtenir la Licence",
    securedPreview: "Aperçu Sécurisé (Watermark HEAVIEXO Actif)",
    cartTitle: "Mon Panier",
    emptyCart: "Votre panier est vide",
    selectBeatOrKit: "Sélectionnez un beat ou un Sound Kit pour démarrer.",
    paymentMode: "Mode de Règlement :",
    totalToPay: "Total à payer :",
    securedPayment: "Paiement sécurisé • Traitement direct instantané",
    footerDesc: "Studio de production musicale haute définition. Beats originaux, Sound Kits professionnels & ingénierie sonore sur-mesure.",
    vipClub: "VIP Club Beatmaker",
    vipDesc: "Recevez gratuitement 5 boucles exclusives par mois et l'accès prioritaire aux nouveaux beats.",
    artistInfo: "Informations d'Artiste",
    artistName: "Nom d'Artiste / Groupe",
    emailAddr: "Adresse E-mail (pour livraison)",
    momoRedirect: "Valider via Mobile Money (WhatsApp)",
    paypalRedirect: "Procéder au Paiement PayPal",
    chooseExploitation: "Choisir une option d'exploitation :",
    popular: "Populaire",
    backToCatalog: "Retour au Catalogue",
    reviewsTitle: "Avis & Retours Artistes",
    leaveReview: "Laisser un retour sur ce beat :",
    yourArtistName: "Votre nom d'artiste / Pseudo",
    rating: "Note :",
    reviewPlaceholder: "Votre avis sur la prod, le mixage, les sonorités...",
    publishReview: "Publier mon avis",
    noReviewsYet: "Aucun commentaire pour le moment. Soyez le premier artiste à donner votre avis !",
    noResultsFound: "Aucun beat ne correspond à ta recherche pour le moment.",
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
    yourEmail: "Votre e-mail...",
    securePayments: "Paiements Sécurisés",
    paypalCard: "PayPal / Carte Bancaire",
    mobileMoney: "Mobile Money",
    collaborations: "Collaborations & Placements",
    licenceBtn: "Licence"
  },
  EN: {
    beatstore: "Beatstore",
    soundKits: "Sound Kits & Loops",
    services: "Studio Services",
    heroBadge: "Exceptional Sound Architecture",
    heroTitle1: "Your next project,",
    heroTitle2: "fully produced.",
    heroSub: "End-to-end production for hip-hop artists releasing their next EP, mixtape, or album. Beats, mix, master, cover art — handled by one producer. You write and record. I deliver release-ready.",
    letsBuild: "Let's Build Your Project →",
    statArtists: "ARTISTS SERVED",
    statExp: "YEARS EXPERIENCE",
    statDemos: "FIRST DEMOS",
    searchPlaceholder: "Search title, genre, mood...",
    addToCart: "Add to Cart",
    getLicense: "Get License",
    securedPreview: "Secured Preview (HEAVIEXO Watermark Active)",
    cartTitle: "My Cart",
    emptyCart: "Your cart is empty",
    selectBeatOrKit: "Select a beat or a Sound Kit to get started.",
    paymentMode: "Payment Method:",
    totalToPay: "Total to pay:",
    securedPayment: "Secured payment • Instant direct processing",
    footerDesc: "High-definition music production studio. Original beats, pro sound kits & custom audio engineering.",
    vipClub: "Beatmaker VIP Club",
    vipDesc: "Get 5 free exclusive loops every month and priority access to new beat drops.",
    artistInfo: "Artist Information",
    artistName: "Artist / Stage Name",
    emailAddr: "Email Address (for delivery)",
    momoRedirect: "Confirm via Mobile Money (WhatsApp)",
    paypalRedirect: "Proceed with PayPal",
    chooseExploitation: "Choose an exploitation option:",
    popular: "Popular",
    backToCatalog: "Back to Catalogue",
    reviewsTitle: "Artist Reviews & Feedback",
    leaveReview: "Leave feedback on this beat:",
    yourArtistName: "Your artist name / Alias",
    rating: "Rating:",
    reviewPlaceholder: "Your thoughts on the production, mixing, sounds...",
    publishReview: "Post my review",
    noReviewsYet: "No reviews yet. Be the first artist to share your thoughts!",
    noResultsFound: "No beats match your search right now.",
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
    yourEmail: "Your email...",
    securePayments: "Secure Payments",
    paypalCard: "PayPal / Credit Card",
    mobileMoney: "Mobile Money",
    collaborations: "Collaborations & Placements",
    licenceBtn: "License"
  }
};

interface Comment {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
}

interface Beat {
  id: string;
  title: string;
  type: string;
  bpm: number;
  key: string;
  mood: string;
  price: number;
  cover: string;
  previewMp3: string;
  description: string;
  visible?: boolean;
  comments?: Comment[];
}

interface SoundKit {
  id: string;
  title: string;
  category: "Drum Kit" | "Loop Kit" | "MIDI Pack" | "Preset Bank";
  price: number;
  cover: string;
  itemCount: string;
  fileSize: string;
  description: string;
}

interface License {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

interface CartItem {
  cartId: string;
  itemType: "beat" | "kit";
  beat?: Beat;
  license?: License;
  kit?: SoundKit;
  price: string;
}

const defaultLicenses: License[] = [
  { id: "mp3", name: "MP3 Lease", price: 29.99, features: ["Fichier MP3 320kbps", "Jusqu'à 100 000 streams", "2 500 ventes max", "1 Clip Vidéo (YouTube)", "Usage commercial autorisé"] },
  { id: "wav", name: "WAV Premium", price: 49.99, popular: true, features: ["Fichier WAV + MP3 haute qualité", "Jusqu'à 500 000 streams", "5 000 ventes max", "2 Clips Vidéos & Radio", "Usage commercial autorisé"] },
  { id: "stems", name: "Trackout / Stems", price: 149.00, features: ["Toutes les pistes séparées (WAV)", "Streams illimités", "Ventes illimitées", "Clips & Radio illimités", "Liberté totale de remix"] },
  { id: "exclusive", name: "Exclusive Rights", price: 997.00, features: ["Propriété exclusive (Retiré du store)", "Droits et ventes illimités", "Cession totale d'exploitation", "HeavieXo conserve 100% parts auteur (BMI)"] }
];

function ArtistMarquee() {
  const [artists, setArtists] = React.useState<string[]>([
    "Guen", "Amron", "Wedy", "Kiko", "Ghetto Mike", "Mic Flammez", "Speezy", "Kollins", "Prince Mo", "Cyanogène", "CCC", "Blaaz", "Jay Killah", "Stanley Enow", "Maalox", "Dove'N D", "Biz Ice", "Sonya Blade"
  ]);

  React.useEffect(() => {
    fetch("/api/design", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.artists && Array.isArray(data.artists) && data.artists.length > 0) {
          setArtists(data.artists);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-[#161311] py-6 border-y border-white/10 overflow-hidden relative my-6">
      <div className="absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-[#161311] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-[#161311] to-transparent z-10 pointer-events-none" />
      <div className="flex w-max animate-marquee space-x-12 items-center">
        {[...artists, ...artists, ...artists].map((artist, idx) => (
          <div key={idx} className="flex items-center space-x-4">
            <span className="text-sm md:text-base font-black uppercase tracking-widest text-[#C2B9B0] hover:text-[#C66B3D] transition-colors cursor-default whitespace-nowrap">
              {artist}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C66B3D]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function toSpotifyEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return `https://open.spotify.com/embed/${parts[0]}/${parts[1]}`;
    }
    return url;
  } catch {
    return url;
  }
}

function SpotifySection({ t }: { t: any }) {
  const [spotify, setSpotify] = useState<{ mainEmbedUrl: string; projects: { title: string; url: string }[] } | null>(null);

  useEffect(() => {
    fetch("/api/design", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.spotify) setSpotify(data.spotify);
      })
      .catch(() => {});
  }, []);

  const hasMain = spotify?.mainEmbedUrl && spotify.mainEmbedUrl.trim() !== "";
  const hasProjects = spotify?.projects && spotify.projects.length > 0;

  if (!hasMain && !hasProjects) return null;

  return (
    <section className="px-4 md:px-6 max-w-7xl mx-auto mt-16 mb-4 space-y-6">
      <h2 className="text-xl md:text-2xl font-black text-[#F4F0EB] uppercase tracking-tight text-center">
        {t.collaborations}
      </h2>
      {hasMain && (
        <div className="rounded-2xl overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.6)]">
          <iframe src={toSpotifyEmbedUrl(spotify!.mainEmbedUrl)} width="100%" height="352" style={{ border: 0 }} allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
        </div>
      )}
      {hasProjects && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {spotify!.projects.map((proj, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.5)]">
              <p className="text-xs font-bold text-[#C2B9B0] px-2 pb-2 pt-1">{proj.title}</p>
              <iframe src={toSpotifyEmbedUrl(proj.url)} width="100%" height="152" style={{ border: 0 }} allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const [beatsList, setBeatsList] = useState<Beat[]>([]);
  const [kitsList, setKitsList] = useState<SoundKit[]>([]);
  const [licensesList, setLicensesList] = useState<License[]>(defaultLicenses);
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  
  const [lang, setLang] = useState<"FR" | "EN">("FR");
  const t = translations[lang];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tagAudioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const [viewMode, setViewMode] = useState<"store" | "kits">("store");
  const [detailedBeat, setDetailedBeat] = useState<Beat | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [selectedBeatForPurchase, setSelectedBeatForPurchase] = useState<Beat | null>(null);
  const [selectedLicenseId, setSelectedLicenseId] = useState("wav");
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const [branding, setBranding] = useState<any>(null);

  useEffect(() => {
    fetch("/api/design", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.branding) setBranding(data.branding);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    const syncFromServer = async () => {
      try {
        const [beatsRes, kitsRes, licensesRes] = await Promise.all([
          fetch("/api/beats", { cache: "no-store" }),
          fetch("/api/kits", { cache: "no-store" }),
          fetch("/api/licenses", { cache: "no-store" })
        ]);
        const freshBeatsRaw: any[] = await beatsRes.json();
        const freshKits: SoundKit[] = await kitsRes.json();
        const freshLicenses: License[] = await licensesRes.json().catch(() => []);

        const freshBeats: Beat[] = freshBeatsRaw.map((b) => ({
          ...b,
          previewMp3: b.previewMp3 || b.audioUrl || "",
          comments: b.comments || []
        }));

        if (!isMounted) return;
        setBeatsList(freshBeats);
        setKitsList(freshKits);
        if (freshLicenses && freshLicenses.length > 0) setLicensesList(freshLicenses);
      } catch (err) {
        console.error("Erreur de synchronisation :", err);
      }
    };
    syncFromServer();
    const interval = setInterval(syncFromServer, 6000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [selectedLicenseId]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
      else audioRef.current.pause();
    }
  }, [isPlaying, currentBeat]);

  const togglePlay = (beat: Beat) => {
    if (currentBeat?.id === beat.id) setIsPlaying(!isPlaying);
    else { setCurrentBeat(beat); setIsPlaying(true); }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const filteredBeats = beatsList.filter(beat => {
    if (beat.visible === false) return false;
    const matchesSearch = beat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (beat.type && beat.type.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre = selectedGenre === "All" || (beat.type && beat.type.toLowerCase().includes(selectedGenre.toLowerCase()));
    return matchesSearch && matchesGenre;
  });

  const footerText = branding?.footerText || t.footerDesc;
  const copyrightText = branding?.copyright || "© 2026 HEAVIEXO BEATS. Tous droits réservés.";

  return (
    <div className="min-h-screen bg-[#161311] text-[#F4F0EB] selection:bg-[#C66B3D] selection:text-white font-sans pt-20 pb-36 relative overflow-x-hidden">
      {currentBeat && (
        <>
          <audio ref={audioRef} src={currentBeat.previewMp3} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
          <audio ref={tagAudioRef} src="/tag.wav" />
        </>
      )}

      {/* HEADER / MENU */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-[#161311]/85 px-4 md:px-8 py-3 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center cursor-pointer" onClick={() => setViewMode("store")}>
          <img src="/LOGO-BEAT.png" alt="HEAVIEXO BEATS" className="h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity" />
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-[#C2B9B0]">
          <button onClick={() => setViewMode("store")} className={`${viewMode === "store" && !detailedBeat ? "text-[#C66B3D]" : "hover:text-[#F4F0EB]"} transition-colors`}>{t.beatstore}</button>
          <button onClick={() => setViewMode("kits")} className={`${viewMode === "kits" ? "text-[#C66B3D]" : "hover:text-[#F4F0EB]"} transition-colors flex items-center space-x-1.5`}><Package className="w-3.5 h-3.5" /><span>{t.soundKits}</span></button>
          <Link href="/services" className="hover:text-[#F4F0EB] transition-colors">{t.services}</Link>
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

      {/* MENU MOBILE */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-x-0 top-[65px] z-30 bg-[#161311]/95 backdrop-blur-2xl p-6 md:hidden space-y-4 shadow-2xl">
            <div className="flex flex-col space-y-3 font-bold text-sm uppercase tracking-wider">
              <button onClick={() => { setViewMode("store"); setMobileMenuOpen(false); }} className="p-3 rounded-xl text-left bg-white/5 text-[#F4F0EB] flex items-center space-x-3">
                <Music2 className="w-4 h-4 text-[#C66B3D]" /><span>{t.beatstore}</span>
              </button>
              <button onClick={() => { setViewMode("kits"); setMobileMenuOpen(false); }} className="p-3 rounded-xl text-left bg-white/5 text-[#F4F0EB] flex items-center space-x-3">
                <Package className="w-4 h-4 text-[#C66B3D]" /><span>{t.soundKits}</span>
              </button>
              <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl text-left bg-white/5 text-[#F4F0EB] flex items-center space-x-3">
                <SlidersHorizontal className="w-4 h-4 text-[#C66B3D]" /><span>{t.services}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ArtistMarquee />

      {viewMode === "kits" ? (
        <main className="px-4 md:px-8 pt-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D]">Pro Sound Libraries</span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#F4F0EB] uppercase tracking-tight">{t.soundKits}</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kitsList.map((kit) => (
              <div key={kit.id} className="bg-[#29201C]/70 rounded-3xl overflow-hidden backdrop-blur-2xl flex flex-col justify-between shadow-xl">
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl m-4 shadow-md">
                    <img src={kit.cover} alt={kit.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 pt-2 space-y-3">
                    <h3 className="font-bold text-lg text-[#F4F0EB]">{kit.title}</h3>
                    <p className="text-xs text-[#C2B9B0]">{kit.description}</p>
                  </div>
                </div>
                <div className="p-6 pt-0 flex items-center justify-between">
                  <span className="text-2xl font-black text-[#F4F0EB]">${kit.price}</span>
                  <button onClick={() => setCartItems([...cartItems, { cartId: Date.now().toString(), itemType: "kit", kit, price: kit.price.toFixed(2) }])} className="bg-[#C66B3D] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2">
                    <ShoppingCart className="w-3.5 h-3.5" /><span>{t.addToCart}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : detailedBeat ? (
        <main className="px-4 md:px-8 pt-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
          <button onClick={() => setDetailedBeat(null)} className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-[#C2B9B0] bg-[#29201C]/70 px-4 py-2 rounded-full">
            <ChevronLeft className="w-4 h-4" /><span>{t.backToCatalog}</span>
          </button>
          <div className="bg-[#29201C]/70 rounded-3xl p-6 md:p-8 backdrop-blur-2xl grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group w-full aspect-square rounded-2xl overflow-hidden shadow-xl">
              <img src={detailedBeat.cover} alt={detailedBeat.title} className="w-full h-full object-cover" />
            </div>
            <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-[#C66B3D] uppercase tracking-widest block mb-1">{detailedBeat.type}</span>
                <h1 className="text-3xl md:text-5xl font-black text-[#F4F0EB] uppercase">{detailedBeat.title}</h1>
                <p className="text-sm text-[#C2B9B0] mt-4">{detailedBeat.description}</p>
              </div>
              <div className="flex items-center justify-end pt-2">
                <button onClick={() => setSelectedBeatForPurchase(detailedBeat)} className="bg-[#C66B3D]/30 text-[#F4F0EB] font-extrabold px-8 py-4 rounded-2xl text-sm uppercase flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4 text-[#C66B3D]" /><span>{t.getLicense}</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main>
          {/* HERO SECTION */}
          <section className="relative px-4 md:px-6 pt-12 md:pt-20 pb-12 md:pb-16 max-w-7xl mx-auto text-center space-y-12">
            <div className="space-y-4 max-w-4xl mx-auto">
              <span className="inline-block px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D] shadow-md">
                {t.heroBadge}
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#F4F0EB] uppercase leading-tight">
                {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97746] via-[#C66B3D] to-[#E3A857]">{t.heroTitle2}</span>
              </h1>
              <p className="text-[#C2B9B0] max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">
                {t.heroSub}
              </p>
              <div className="pt-4">
                <Link href="/services" className="inline-flex items-center space-x-2 bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold px-8 py-4 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-[#C66B3D]/30 transition-transform active:scale-95">
                  <span>{t.letsBuild}</span>
                </Link>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-black text-[#F4F0EB]">300+</div>
                <div className="text-[10px] md:text-xs text-[#9E938B] font-bold uppercase tracking-wider mt-1">{t.statArtists}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-black text-[#F4F0EB]">18+</div>
                <div className="text-[10px] md:text-xs text-[#9E938B] font-bold uppercase tracking-wider mt-1">{t.statExp}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-black text-[#F4F0EB]">72 hr</div>
                <div className="text-[10px] md:text-xs text-[#9E938B] font-bold uppercase tracking-wider mt-1">{t.statDemos}</div>
              </div>
            </div>

            {currentBeat && (
              <div className="bg-[#29201C]/70 rounded-2xl p-4 md:p-6 backdrop-blur-2xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-left shadow-2xl">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                  <img src={currentBeat.cover} alt={currentBeat.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <span className="text-[10px] md:text-xs uppercase tracking-wider text-[#C66B3D] font-extrabold">{currentBeat.type}</span>
                  <h3 onClick={() => setDetailedBeat(currentBeat)} className="text-xl md:text-2xl font-bold text-[#F4F0EB] truncate cursor-pointer hover:text-[#C66B3D]">
                    {currentBeat.title}
                  </h3>
                </div>
                <button onClick={() => togglePlay(currentBeat)} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#C66B3D] text-white flex items-center justify-center shadow-lg">
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>
              </div>
            )}
          </section>

          <section className="px-4 md:px-6 max-w-7xl mx-auto mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 bg-[#29201C]/60 backdrop-blur-2xl p-3 md:p-4 rounded-xl shadow-lg">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E938B]" />
                <input 
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1C1714] rounded-lg pl-10 pr-4 py-2 text-sm text-[#F4F0EB] focus:outline-none focus:ring-1 focus:ring-[#C66B3D]"
                />
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {["All", "Dark Trap", "Melodic Drill", "Boom Bap", "Cinematic"].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      selectedGenre === genre ? "bg-[#C66B3D] text-white font-extrabold" : "bg-[#29201C] text-[#C2B9B0]"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 md:px-6 max-w-7xl mx-auto">
            <div className="bg-[#29201C]/70 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl">
              <div className="divide-y divide-white/10">
                {filteredBeats.length === 0 ? (
                  <div className="p-10 text-center text-[#9E938B] text-sm">{t.noResultsFound}</div>
                ) : (
                  filteredBeats.map((beat) => {
                    const isSelected = currentBeat?.id === beat.id;
                    const isThisPlaying = isSelected && isPlaying;

                    return (
                      <div key={beat.id} className={`flex items-center justify-between p-3.5 md:p-4 hover:bg-[#C66B3D]/10 transition-colors ${isSelected ? "bg-[#C66B3D]/20" : ""}`}>
                        <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                          <button onClick={() => togglePlay(beat)} className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                            <img src={beat.cover} alt={beat.title} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${isThisPlaying ? "opacity-100" : "opacity-0"}`}>
                              <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                            </div>
                          </button>
                          <div className="min-w-0 flex-1">
                            <h4 onClick={() => setDetailedBeat(beat)} className={`font-bold text-sm md:text-base truncate cursor-pointer hover:underline ${isSelected ? "text-[#C66B3D]" : "text-[#F4F0EB]"}`}>
                              {beat.title}
                            </h4>
                            <p className="text-xs text-[#C2B9B0] truncate">{beat.type} • {beat.bpm} BPM</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 md:space-x-3 ml-2 flex-shrink-0">
                          <button onClick={() => setSelectedBeatForPurchase(beat)} className="bg-[#C66B3D] text-white p-2.5 rounded-xl shadow-md" title={t.licenceBtn}>
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          <SpotifySection t={t} />
        </main>
      )}

      {/* FOOTER */}
      <footer className="mt-20 bg-[#161311]/95 backdrop-blur-xl px-4 md:px-8 py-12 shadow-2xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <img src="/LOGO-BEAT.png" alt="HEAVIEXO BEATS" className="h-10 w-auto object-contain" />
            <p className="text-xs text-[#C2B9B0] leading-relaxed">{footerText}</p>
          </div>
          <div>
            <h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">{t.catalogueTitle}</h5>
            <ul className="space-y-2 text-xs text-[#C2B9B0] font-medium">
              <li onClick={() => setViewMode("store")} className="hover:text-[#C66B3D] cursor-pointer">{t.darkTrapBeats}</li>
              <li onClick={() => setViewMode("kits")} className="hover:text-[#C66B3D] cursor-pointer">{t.soundkitsDrumkits}</li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">{t.engineeringServices}</h5>
            <ul className="space-y-2 text-xs text-[#C2B9B0] font-medium">
              <li><Link href="/services" className="hover:text-[#C66B3D] transition-colors">{t.mixingStemsPro}</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">{t.vipClub}</h5>
            <p className="text-xs text-[#C2B9B0] leading-relaxed">{t.vipDesc}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 text-[11px] text-[#9E938B] font-medium text-center">
          <p>{copyrightText}</p>
        </div>
      </footer>
    </div>
  );
}