"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Search, 
  Heart, 
  ShoppingCart, 
  Volume2, 
  VolumeX,
  SkipBack, 
  SkipForward,
  Menu,
  X,
  Check,
  FileAudio,
  Sliders,
  Layers,
  Crown,
  Trash2,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Star,
  MessageSquare,
  Send,
  ShieldAlert,
  Disc,
  Mic2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Package,
  FolderArchive,
  MessageCircle,
  User,
  Mail,
  ExternalLink,
  Music2
} from "lucide-react";

const PHONE_WHATSAPP = "2290156646409";

const translations = {
  FR: {
    beatstore: "Beatstore",
    soundKits: "Sound Kits & Loops",
    services: "Services Studio",
    heroBadge: "Architecture Sonore d'Exception",
    heroTitle1: "Chaque beat",
    heroTitle2: "raconte une histoire.",
    heroSub: "Productions cinématographiques, dark trap et mélodies sur-mesure pour artistes exigeants.",
    searchPlaceholder: "Rechercher titre, genre, mood...",
    addToCart: "Ajouter au Panier",
    getLicense: "Obtenir la Licence",
    securedPreview: "Aperçu Sécurisé (Watermark HEAVIEXO Actif)",
    cartTitle: "Mon Panier",
    emptyCart: "Votre panier est vide",
    selectBeatOrKit: "Sélectionnez un beat ou un Sound Kit pour démarrer.",
    paymentMode: "Mode de Règlement :",
    totalToPay: "Total à payer :",
    payAndDownload: "Payer & Télécharger",
    securedPayment: "Paiement sécurisé • Traitement direct instantané",
    orderConfirmed: "Commande Confirmée !",
    downloadFiles: "Télécharger mes Fichiers",
    customServices: "Services Studio Sur-Mesure",
    servicesSub: "Faites passer vos morceaux au niveau supérieur avec un traitement sonore haute précision et des productions exclusives.",
    reserve: "Réserver",
    footerDesc: "Studio de production musicale haute définition. Beats originaux, Sound Kits professionnels & ingénierie sonore sur-mesure.",
    vipClub: "VIP Club Beatmaker",
    vipDesc: "Recevez gratuitement 5 boucles exclusives par mois et l'accès prioritaire aux nouveaux beats.",
    artistInfo: "Informations d'Artiste",
    artistName: "Nom d'Artiste / Groupe",
    emailAddr: "Adresse E-mail (pour livraison)",
    momoRedirect: "Valider via Mobile Money (WhatsApp)",
    paypalRedirect: "Procéder au Paiement PayPal",
    chooseExploitation: "Choisir une option d'exploitation :",
    popular: "Populaire"
  },
  EN: {
    beatstore: "Beatstore",
    soundKits: "Sound Kits & Loops",
    services: "Studio Services",
    heroBadge: "Exceptional Sound Architecture",
    heroTitle1: "Every beat",
    heroTitle2: "tells a story.",
    heroSub: "Cinematic productions, dark trap, and custom melodies crafted for demanding artists.",
    searchPlaceholder: "Search title, genre, mood...",
    addToCart: "Add to Cart",
    getLicense: "Get License",
    securedPreview: "Secured Preview (HEAVIEXO Watermark Active)",
    cartTitle: "My Cart",
    emptyCart: "Your cart is empty",
    selectBeatOrKit: "Select a beat or a Sound Kit to get started.",
    paymentMode: "Payment Method:",
    totalToPay: "Total to pay:",
    payAndDownload: "Pay & Download",
    securedPayment: "Secured payment • Instant direct processing",
    orderConfirmed: "Order Confirmed!",
    downloadFiles: "Download My Files",
    customServices: "Custom Studio Services",
    servicesSub: "Take your tracks to the next level with high-precision audio processing and custom exclusive productions.",
    reserve: "Book Now",
    footerDesc: "High-definition music production studio. Original beats, pro sound kits & custom audio engineering.",
    vipClub: "Beatmaker VIP Club",
    vipDesc: "Get 5 free exclusive loops every month and priority access to new beat drops.",
    artistInfo: "Artist Information",
    artistName: "Artist / Stage Name",
    emailAddr: "Email Address (for delivery)",
    momoRedirect: "Confirm via Mobile Money (WhatsApp)",
    paypalRedirect: "Proceed with PayPal",
    chooseExploitation: "Choose an exploitation option:",
    popular: "Popular"
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
  nameEn?: string;
  price: number;
  features: string[];
  featuresEn?: string[];
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
  {
    id: "mp3",
    name: "MP3 Lease",
    price: 29.99,
    features: [
      "Fichier MP3 320kbps",
      "Jusqu'à 100 000 streams",
      "2 500 ventes max",
      "1 Clip Vidéo (YouTube)",
      "Usage commercial autorisé"
    ]
  },
  {
    id: "wav",
    name: "WAV Premium",
    price: 49.99,
    popular: true,
    features: [
      "Fichier WAV + MP3 haute qualité",
      "Jusqu'à 500 000 streams",
      "5 000 ventes max",
      "2 Clips Vidéos & Radio",
      "Usage commercial autorisé"
    ]
  },
  {
    id: "stems",
    name: "Trackout / Stems",
    price: 149.00,
    features: [
      "Toutes les pistes séparées (WAV)",
      "Streams illimités",
      "Ventes illimitées",
      "Clips & Radio illimités",
      "Liberté totale de remix"
    ]
  },
  {
    id: "exclusive",
    name: "Exclusive Rights",
    price: 997.00,
    features: [
      "Propriété exclusive (Retiré du store)",
      "Droits et ventes illimités",
      "Cession totale d'exploitation",
      "HeavieXo conserve 100% parts auteur (BMI)"
    ]
  }
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

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tagAudioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const [viewMode, setViewMode] = useState<"store" | "kits" | "services">("store");
  const [detailedBeat, setDetailedBeat] = useState<Beat | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [selectedBeatForPurchase, setSelectedBeatForPurchase] = useState<Beat | null>(null);
  const [selectedLicenseId, setSelectedLicenseId] = useState("wav");
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "momo">("momo");

  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentRating, setNewCommentRating] = useState(5);

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
        if (freshLicenses && freshLicenses.length > 0) {
          setLicensesList(freshLicenses);
        }

        if (licensesList.length > 0 && !licensesList.find(l => l.id === selectedLicenseId)) {
          setSelectedLicenseId(licensesList[0].id);
        }

        setCurrentBeat((prev) => {
          if (prev) {
            const stillExists = freshBeats.find((b) => b.id === prev.id && b.visible !== false);
            if (stillExists) return stillExists;
          }
          return freshBeats.find((b) => b.visible !== false) || null;
        });

        setDetailedBeat((prev) => {
          if (!prev) return prev;
          const updated = freshBeats.find((b) => b.id === prev.id);
          return updated || prev;
        });
      } catch (err) {
        console.error("Erreur de synchronisation :", err);
      }
    };

    syncFromServer();
    const interval = setInterval(syncFromServer, 6000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedLicenseId]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentBeat]);

  // Tag audio déclenché toutes les 25 secondes avec gestion du volume et de la lecture forcée
  useEffect(() => {
    let tagInterval: NodeJS.Timeout;
    if (isPlaying) {
      tagInterval = setInterval(() => {
        if (tagAudioRef.current) {
          tagAudioRef.current.currentTime = 0;
          tagAudioRef.current.volume = volume;
          tagAudioRef.current.play().catch((err) => console.log("Tag audio bloqué par le navigateur :", err));
        }
      }, 25000);
    }
    return () => clearInterval(tagInterval);
  }, [isPlaying, volume]);

  const togglePlay = (beat: Beat) => {
    if (currentBeat?.id === beat.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentBeat(beat);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * (duration || 0);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (tagAudioRef.current) {
      tagAudioRef.current.volume = newVol;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleNextBeat = () => {
    if (!detailedBeat) return;
    const visibleBeats = beatsList.filter(b => b.visible !== false);
    const currentIndex = visibleBeats.findIndex(b => b.id === detailedBeat.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % visibleBeats.length;
      setDetailedBeat(visibleBeats[nextIndex]);
    }
  };

  const handlePrevBeat = () => {
    if (!detailedBeat) return;
    const visibleBeats = beatsList.filter(b => b.visible !== false);
    const currentIndex = visibleBeats.findIndex(b => b.id === detailedBeat.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + visibleBeats.length) % visibleBeats.length;
      setDetailedBeat(visibleBeats[prevIndex]);
    }
  };

  const handleAddBeatToCart = () => {
    if (!selectedBeatForPurchase) return;
    const lic = licensesList.find(l => l.id === selectedLicenseId) || licensesList[0];
    const itemPrice = Number(lic?.price || 0).toFixed(2);

    const newItem: CartItem = {
      cartId: Date.now().toString(),
      itemType: "beat",
      beat: selectedBeatForPurchase,
      license: lic,
      price: itemPrice
    };

    setCartItems([...cartItems, newItem]);
    setSelectedBeatForPurchase(null);
    setCartOpen(true);
  };

  const handleAddKitToCart = (kit: SoundKit) => {
    const newItem: CartItem = {
      cartId: Date.now().toString(),
      itemType: "kit",
      kit: kit,
      price: Number(kit.price).toFixed(2)
    };

    setCartItems([...cartItems, newItem]);
    setCartOpen(true);
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailedBeat || !newCommentAuthor || !newCommentText) return;

    try {
      const res = await fetch(`/api/beats/${detailedBeat.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: newCommentAuthor,
          text: newCommentText,
          rating: newCommentRating,
          date: lang === "FR" ? "À l'instant" : "Just now"
        })
      });
      const savedComment: Comment = await res.json();
      const currentComments = detailedBeat.comments || [];

      const updatedBeats = beatsList.map(b => {
        if (b.id === detailedBeat.id) {
          return { ...b, comments: [savedComment, ...(b.comments || [])] };
        }
        return b;
      });

      setBeatsList(updatedBeats);
      setDetailedBeat({ ...detailedBeat, comments: [savedComment, ...currentComments] });
      setNewCommentText("");
      setNewCommentAuthor("");
    } catch (err) {
      console.error("Erreur commentaire :", err);
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || cartItems.length === 0) return;

    const itemsSummary = cartItems.map((item, idx) => {
      let licenseName = item.license?.name;
      if (item.license) {
        if (lang === "EN") {
          if (item.license.id === "mp3") licenseName = "MP3 Lease";
          else if (item.license.id === "wav") licenseName = "WAV Premium";
          else if (item.license.id === "stems") licenseName = "Trackout / Stems";
          else if (item.license.id === "exclusive") licenseName = "Exclusive Rights";
        }
      }
      if (item.itemType === "beat") {
        return `${idx + 1}. Beat: ${item.beat?.title} (${licenseName}) - $${item.price}`;
      }
      return `${idx + 1}. Kit: ${item.kit?.title} - $${item.price}`;
    }).join("%0A");

    if (paymentMethod === "momo") {
      const message = `*COMMANDE HEAVIEXO BEATS*%0A%0A*Artiste:* ${encodeURIComponent(customerName)}%0A*Email:* ${encodeURIComponent(customerEmail)}%0A%0A*Panier:*%0A${itemsSummary}%0A%0A*Total:* $${cartTotal}%0A*Mode de Paiement:* Mobile Money (MTN / Moov)%0A%0AMerci de m'envoyer les instructions de paiement !`;
      window.open(`https://wa.me/${PHONE_WHATSAPP}?text=${message}`, "_blank");
    } else {
      let paypalLink = "https://www.paypal.com/ncp/payment/8ATGLJLD9WVBC";
      const firstItem = cartItems[0];
      if (firstItem && firstItem.itemType === "beat") {
        const licenseId = firstItem.license?.id;
        if (licenseId === "mp3") {
          paypalLink = "https://www.paypal.com/ncp/payment/ZSS69K9VHU59C";
        } else if (licenseId === "wav") {
          paypalLink = "https://www.paypal.com/ncp/payment/8ATGLJLD9WVBC";
        } else if (licenseId === "stems") {
          paypalLink = "https://www.paypal.com/ncp/payment/WG64S2QL5RUNL";
        } else if (licenseId === "exclusive") {
          paypalLink = "https://www.paypal.com/ncp/payment/XU9GSXMKN2HKL";
        }
      }
      window.open(paypalLink, "_blank");
    }
  };

  const filteredBeats = beatsList.filter(beat => {
    if (beat.visible === false) return false;
    const matchesSearch = beat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (beat.type && beat.type.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre = selectedGenre === "All" || (beat.type && beat.type.toLowerCase().includes(selectedGenre.toLowerCase()));
    return matchesSearch && matchesGenre;
  });

  const activeLicense = licensesList.find(l => l.id === selectedLicenseId) || licensesList[0];
  const calculatedPrice = Number(activeLicense?.price || 0).toFixed(2);

  const commentsList = detailedBeat?.comments || [];
  const averageRating = commentsList.length > 0 
    ? (commentsList.reduce((acc, c) => acc + c.rating, 0) / commentsList.length).toFixed(1)
    : "0.0";

  const navigateTo = (mode: "store" | "kits" | "services") => {
    setViewMode(mode);
    setDetailedBeat(null);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#161311] text-[#F4F0EB] selection:bg-[#C66B3D] selection:text-white font-sans pt-20 pb-36 relative overflow-x-hidden">
      {currentBeat && (
        <>
          <audio
            ref={audioRef}
            src={currentBeat.previewMp3}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />
          <audio
            ref={tagAudioRef}
            src="/tag.wav"
          />
        </>
      )}

      <div className="fixed inset-0 bg-[linear-gradient(to_right,#221B17_1px,transparent_1px),linear-gradient(to_bottom,#221B17_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] opacity-30 pointer-events-none" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C66B3D]/15 blur-[160px] pointer-events-none rounded-full" />

      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-[#161311]/85 px-4 md:px-8 py-3 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center cursor-pointer" onClick={() => navigateTo("store")}>
          <img 
            src="/LOGO-BEAT.png" 
            alt="HEAVIEXO BEATS" 
            className="h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity"
          />
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-[#C2B9B0]">
          <button 
            onClick={() => navigateTo("store")} 
            className={`${viewMode === "store" && !detailedBeat ? "text-[#C66B3D]" : "hover:text-[#F4F0EB]"} transition-colors`}
          >
            {t.beatstore}
          </button>
          <button 
            onClick={() => navigateTo("kits")}
            className={`${viewMode === "kits" ? "text-[#C66B3D]" : "hover:text-[#F4F0EB]"} transition-colors flex items-center space-x-1.5`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{t.soundKits}</span>
          </button>
          <button 
            onClick={() => navigateTo("services")}
            className={`${viewMode === "services" ? "text-[#C66B3D]" : "hover:text-[#F4F0EB]"} transition-colors`}
          >
            {t.services}
          </button>
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-3">
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
              <span className={`transition-colors ${lang === "FR" ? "text-white font-extrabold" : "text-[#9E938B]"}`}>
                FR
              </span>
              <span className={`transition-colors ${lang === "EN" ? "text-white font-extrabold" : "text-[#9E938B]"}`}>
                EN
              </span>
            </div>
          </div>

          <button 
            onClick={() => setCartOpen(true)}
            className="bg-[#2D231E] hover:bg-[#382B25] px-3.5 py-2 rounded-full text-[10px] font-extrabold tracking-widest uppercase transition-all flex items-center space-x-1.5 text-[#F4F0EB] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#C66B3D]" />
            <span>({cartItems.length})</span>
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F4F0EB] bg-[#2D231E] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#C66B3D]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[65px] z-30 bg-[#161311]/95 backdrop-blur-2xl p-6 md:hidden space-y-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          >
            <div className="pb-3 border-b border-white/10 flex justify-center">
              <img 
                src="/LOGO-BEAT.png" 
                alt="HEAVIEXO BEATS" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#9E938B] block">Navigation Studio</span>
            <div className="flex flex-col space-y-3 font-bold text-sm uppercase tracking-wider">
              <button 
                onClick={() => navigateTo("store")}
                className={`p-3 rounded-xl text-left flex items-center space-x-3 transition-colors ${
                  viewMode === "store" && !detailedBeat 
                    ? "bg-[#C66B3D]/20 text-[#C66B3D]" 
                    : "bg-white/5 text-[#F4F0EB]"
                }`}
              >
                <Music2 className="w-4 h-4" />
                <span>{t.beatstore}</span>
              </button>

              <button 
                onClick={() => navigateTo("kits")}
                className={`p-3 rounded-xl text-left flex items-center space-x-3 transition-colors ${
                  viewMode === "kits" 
                    ? "bg-[#C66B3D]/20 text-[#C66B3D]" 
                    : "bg-white/5 text-[#F4F0EB]"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>{t.soundKits}</span>
              </button>

              <button 
                onClick={() => navigateTo("services")}
                className={`p-3 rounded-xl text-left flex items-center space-x-3 transition-colors ${
                  viewMode === "services" 
                    ? "bg-[#C66B3D]/20 text-[#C66B3D]" 
                    : "bg-white/5 text-[#F4F0EB]"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{t.services}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ArtistMarquee />

      {viewMode === "kits" ? (
        <main className="px-4 md:px-8 pt-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D]">
              Pro Sound Libraries
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#F4F0EB] uppercase tracking-tight">{t.soundKits}</h1>
            <p className="text-xs sm:text-sm text-[#C2B9B0] leading-relaxed">
              Inspiration instantanée pour beatmakers et producteurs. Samples WAV 24-bit 100% libre de droits pour la création de vos prochains hits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kitsList.map((kit) => (
              <div 
                key={kit.id}
                className="bg-[#29201C]/70 rounded-3xl overflow-hidden backdrop-blur-2xl flex flex-col justify-between transition-all group shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(193,107,61,0.15)]"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl m-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <img src={kit.cover} alt={kit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#161311]/90 backdrop-blur-md text-[#C66B3D] shadow-md">
                      {kit.category}
                    </span>
                  </div>
                  <div className="p-6 pt-2 space-y-3">
                    <h3 className="font-bold text-lg text-[#F4F0EB] group-hover:text-[#C66B3D] transition-colors">{kit.title}</h3>
                    <p className="text-xs text-[#C2B9B0] leading-relaxed">{kit.description}</p>
                    
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#C2B9B0]">
                      <span className="flex items-center space-x-1"><FolderArchive className="w-3.5 h-3.5 text-[#C66B3D]" /> <span>{kit.itemCount}</span></span>
                      <span>{kit.fileSize}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between">
                  <span className="text-2xl font-black text-[#F4F0EB]">${kit.price}</span>
                  <button 
                    onClick={() => handleAddKitToCart(kit)}
                    className="bg-[#C66B3D] hover:bg-[#D97746] active:scale-95 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-transform flex items-center space-x-2 shadow-lg shadow-[#C66B3D]/30"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{t.addToCart}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : detailedBeat ? (
        <main className="px-4 md:px-8 pt-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setDetailedBeat(null)}
              className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-[#C2B9B0] hover:text-[#C66B3D] transition-colors bg-[#29201C]/70 px-4 py-2 rounded-full backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour au Catalogue</span>
            </button>

            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrevBeat}
                className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-[#C2B9B0] hover:text-[#C66B3D] transition-colors bg-[#29201C]/70 px-3 py-2 rounded-full backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Précédent</span>
              </button>
              <button 
                onClick={handleNextBeat}
                className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-[#C2B9B0] hover:text-[#C66B3D] transition-colors bg-[#29201C]/70 px-3 py-2 rounded-full backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
              >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-[#29201C]/70 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group w-full aspect-square rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <img src={detailedBeat.cover} alt={detailedBeat.title} className="w-full h-full object-cover" />
              <button 
                onClick={() => togglePlay(detailedBeat)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#C66B3D] text-white flex items-center justify-center shadow-2xl">
                  {isPlaying && currentBeat?.id === detailedBeat.id ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </div>
              </button>
            </div>

            <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-[#C66B3D] uppercase tracking-widest block mb-1">{detailedBeat.type}</span>
                <h1 className="text-3xl md:text-5xl font-black text-[#F4F0EB] uppercase tracking-tight">{detailedBeat.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#C2B9B0] mt-4">
                  <span className="bg-white/10 px-3 py-1.5 rounded-lg shadow-sm">BPM : <strong className="text-[#F4F0EB]">{detailedBeat.bpm}</strong></span>
                  <span className="bg-white/10 px-3 py-1.5 rounded-lg shadow-sm">KEY : <strong className="text-[#F4F0EB]">{detailedBeat.key}</strong></span>
                  <span className="bg-white/10 px-3 py-1.5 rounded-lg shadow-sm">MOOD : <strong className="text-[#F4F0EB]">{detailedBeat.mood}</strong></span>
                </div>

                <p className="text-sm text-[#C2B9B0] leading-relaxed mt-4 font-medium">
                  {detailedBeat.description}
                </p>
              </div>

              <div 
                onClick={handleWaveformClick}
                className="space-y-2 bg-white/10 p-4 rounded-2xl backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.4)] cursor-pointer group"
                title="Cliquer pour changer la position de lecture"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#C2B9B0]">
                  <span className="flex items-center space-x-1">
                    <ShieldAlert className="w-3 h-3 text-[#C66B3D]" />
                    <span>{t.securedPreview}</span>
                  </span>
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                
                <div className="flex items-end justify-between h-12 gap-1 px-1">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-all ${
                        (currentTime / (duration || 1)) * 40 > i ? "bg-[#C66B3D]" : "bg-white/10 group-hover:bg-white/30"
                      }`}
                      style={{ height: `${Math.max(20, Math.sin(i) * 100)}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button 
                  onClick={() => setSelectedBeatForPurchase(detailedBeat)}
                  className="bg-[#C66B3D]/30 hover:bg-[#C66B3D]/50 active:scale-95 text-[#F4F0EB] font-extrabold px-8 py-4 rounded-2xl text-sm transition-all flex items-center space-x-2 shadow-[0_10px_30px_rgba(193,107,61,0.25)] uppercase tracking-wider backdrop-blur-md"
                >
                  <ShoppingCart className="w-4 h-4 text-[#C66B3D]" />
                  <span>{t.getLicense}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#29201C]/70 rounded-3xl p-6 md:p-8 backdrop-blur-2xl space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-[#C66B3D]" />
                <h3 className="text-xs md:text-sm font-black text-[#F4F0EB] uppercase tracking-wider">Avis & Retours Artistes ({(detailedBeat.comments || []).length})</h3>
              </div>
              <div className="flex items-center space-x-1 text-[#C66B3D]">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-extrabold text-sm text-[#F4F0EB]">{averageRating} / 5</span>
              </div>
            </div>

            <form onSubmit={handleAddComment} className="space-y-4 bg-white/10 p-4 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.4)]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F4F0EB] block">Laisser un retour sur ce beat :</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="Votre nom d'artiste / Pseudo"
                  value={newCommentAuthor}
                  onChange={(e) => setNewCommentAuthor(e.target.value)}
                  className="bg-[#1C1714] rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:ring-1 focus:ring-[#C66B3D] shadow-inner"
                  required
                />
                <div className="flex items-center space-x-2 bg-[#1C1714] rounded-xl px-4 py-2.5 shadow-inner">
                  <span className="text-xs text-[#C2B9B0] font-semibold">Note :</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewCommentRating(star)}
                      className="p-0.5 focus:outline-none"
                    >
                      <Star className={`w-4 h-4 ${star <= newCommentRating ? "text-[#C66B3D] fill-current" : "text-white/25"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea 
                placeholder="Votre avis sur la prod, le mixage, les sonorités..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                rows={2}
                className="w-full bg-[#1C1714] rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:ring-1 focus:ring-[#C66B3D] shadow-inner"
                required
              />
              <button 
                type="submit"
                className="bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase transition-transform active:scale-95 flex items-center space-x-2 shadow-lg shadow-[#C66B3D]/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publier mon avis</span>
              </button>
            </form>

            <div className="space-y-3">
              {(!detailedBeat.comments || detailedBeat.comments.length === 0) ? (
                <p className="text-xs text-[#9E938B] italic text-center py-4">Aucun commentaire pour le moment. Soyez le premier artiste à donner votre avis !</p>
              ) : (
                detailedBeat.comments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-2xl bg-white/10 space-y-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#F4F0EB]">{comment.author}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(comment.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-[#C66B3D] fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#C2B9B0]">{comment.text}</p>
                    <span className="text-[10px] text-[#9E938B] block pt-1">{comment.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      ) : viewMode === "services" ? (
        <main className="px-4 md:px-8 pt-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D]">
              HEAVIEXO Audio Engineering
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#F4F0EB] uppercase tracking-tight">{t.customServices}</h1>
            <p className="text-xs sm:text-sm text-[#C2B9B0] leading-relaxed">
              {t.servicesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#29201C]/70 rounded-3xl p-6 backdrop-blur-2xl space-y-4 flex flex-col justify-between transition-colors shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(193,107,61,0.15)]">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C66B3D]/20 text-[#C66B3D] flex items-center justify-center shadow-inner">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#F4F0EB]">Mixage Stems Pro</h3>
                <p className="text-xs text-[#C2B9B0] leading-relaxed">
                  Équilibre des pistes, traitement dynamique des voix, spatialisation 3D et nettoyage haute définition de votre projet.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-lg font-black text-[#C66B3D]">$149 <span className="text-[10px] text-[#9E938B] font-normal">/ titre</span></span>
                <button className="bg-white/10 hover:bg-[#C66B3D] hover:text-white text-[#F4F0EB] font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm">{t.reserve}</button>
              </div>
            </div>

            <div className="bg-[#29201C]/70 rounded-3xl p-6 backdrop-blur-2xl space-y-4 flex flex-col justify-between transition-colors relative overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(193,107,61,0.15)]">
              <span className="absolute top-4 right-4 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#C66B3D] text-white shadow-md">
                Recommandé
              </span>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C66B3D]/20 text-[#C66B3D] flex items-center justify-center shadow-inner">
                  <Disc className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#F4F0EB]">Mastering Analog & Digital</h3>
                <p className="text-xs text-[#C2B9B0] leading-relaxed">
                  Finalisation du master aux normes streaming (Spotify, Apple Music) pour une puissance et une clarté optimale.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-lg font-black text-[#C66B3D]">$79 <span className="text-[10px] text-[#9E938B] font-normal">/ titre</span></span>
                <button className="bg-[#C66B3D] text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-[#C66B3D]/30">{t.reserve}</button>
              </div>
            </div>

            <div className="bg-[#29201C]/70 rounded-3xl p-6 backdrop-blur-2xl space-y-4 flex flex-col justify-between transition-colors shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(193,107,61,0.15)]">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C66B3D]/20 text-[#C66B3D] flex items-center justify-center shadow-inner">
                  <Mic2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#F4F0EB]">Prod Sur-Mesure Exclusive</h3>
                <p className="text-xs text-[#C2B9B0] leading-relaxed">
                  Création d'un instrumental unique selon votre cahier des charges avec cession totale des droits.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-lg font-black text-[#C66B3D]">$399 <span className="text-[10px] text-[#9E938B] font-normal">/ prod</span></span>
                <button className="bg-white/10 hover:bg-[#C66B3D] hover:text-white text-[#F4F0EB] font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm">{t.reserve}</button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main>
          <section className="relative px-4 md:px-6 pt-12 md:pt-20 pb-12 md:pb-16 max-w-7xl mx-auto text-center">
            <span className="inline-block px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D] mb-4 md:mb-6 shadow-md shadow-[#C66B3D]/20">
              {t.heroBadge}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#F4F0EB] mb-4 md:mb-6 uppercase leading-tight">
              {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97746] via-[#C66B3D] to-[#E3A857]">{t.heroTitle2}</span>
            </h1>
            <p className="text-[#C2B9B0] max-w-2xl mx-auto text-sm md:text-lg mb-8 md:mb-10 leading-relaxed px-2 font-medium">
              {t.heroSub}
            </p>

            {currentBeat && (
              <div className="bg-[#29201C]/70 rounded-2xl p-4 md:p-6 backdrop-blur-2xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-left shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex-shrink-0">
                  <img src={currentBeat.cover} alt={currentBeat.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <span className="text-[10px] md:text-xs uppercase tracking-wider text-[#C66B3D] font-extrabold">{currentBeat.type}</span>
                  <h3 
                    onClick={() => setDetailedBeat(currentBeat)}
                    className="text-xl md:text-2xl font-bold text-[#F4F0EB] truncate cursor-pointer hover:text-[#C66B3D] transition-colors"
                  >
                    {currentBeat.title}
                  </h3>
                  <div className="flex items-center justify-center sm:justify-start space-x-3 text-xs text-[#C2B9B0] mt-1 md:mt-2">
                    <span>BPM: <strong className="text-[#F4F0EB]">{currentBeat.bpm}</strong></span>
                    <span>•</span>
                    <span>KEY: <strong className="text-[#F4F0EB]">{currentBeat.key}</strong></span>
                    <span>•</span>
                    <span>MOOD: <strong className="text-[#F4F0EB]">{currentBeat.mood}</strong></span>
                  </div>
                </div>
                <button 
                  onClick={() => togglePlay(currentBeat)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#C66B3D] hover:bg-[#D97746] text-white flex items-center justify-center transition-transform transform active:scale-95 shadow-lg shadow-[#C66B3D]/30 flex-shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            )}
          </section>

          {/* Barre de recherche et filtres de genres compacts (sans débordement) */}
          <section className="px-4 md:px-6 max-w-7xl mx-auto mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 bg-[#29201C]/60 backdrop-blur-2xl p-3 md:p-4 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.5)]">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E938B]" />
                <input 
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1C1714] rounded-lg pl-10 pr-4 py-2 text-sm text-[#F4F0EB] focus:outline-none focus:ring-1 focus:ring-[#C66B3D] shadow-inner transition-colors"
                />
              </div>

              {/* Conteneur optimisé avec défilement fluide et tailles réduites pour mobile */}
              <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar max-w-full">
                {["All", "Dark Trap", "Melodic Drill", "Boom Bap", "Cinematic"].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors shadow-sm flex-shrink-0 ${
                      selectedGenre === genre 
                        ? "bg-[#C66B3D] text-white font-extrabold shadow-md shadow-[#C66B3D]/30" 
                        : "bg-[#29201C] text-[#C2B9B0] hover:bg-[#352923]"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 md:px-6 max-w-7xl mx-auto">
            <div className="bg-[#29201C]/70 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.6)]">
              <div className="divide-y divide-white/10">
                {filteredBeats.length === 0 ? (
                  <div className="p-10 text-center text-[#9E938B] text-sm">
                    Aucun beat ne correspond à ta recherche pour le moment.
                  </div>
                ) : (
                  filteredBeats.map((beat) => {
                    const isSelected = currentBeat?.id === beat.id;
                    const isThisPlaying = isSelected && isPlaying;

                    return (
                      <div 
                        key={beat.id}
                        className={`flex items-center justify-between p-3.5 md:p-4 hover:bg-[#C66B3D]/10 transition-colors ${
                          isSelected ? "bg-[#C66B3D]/20" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                          <button 
                            onClick={() => togglePlay(beat)}
                            className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md"
                          >
                            <img src={beat.cover} alt={beat.title} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${
                              isThisPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}>
                              {isThisPlaying ? (
                                <div className="flex items-end space-x-0.5 h-5">
                                  <motion.span animate={{ height: [8, 20, 10] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-[#C66B3D] rounded-full" />
                                  <motion.span animate={{ height: [15, 6, 18] }} transition={{ repeat: Infinity, duration: 0.3 }} className="w-1 bg-[#C66B3D] rounded-full" />
                                  <motion.span animate={{ height: [5, 18, 12] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-[#C66B3D] rounded-full" />
                                </div>
                              ) : (
                                <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                              )}
                            </div>
                          </button>

                          <div className="min-w-0 flex-1">
                            <h4 
                              onClick={() => setDetailedBeat(beat)}
                              className={`font-bold text-sm md:text-base truncate cursor-pointer hover:underline ${isSelected ? "text-[#C66B3D]" : "text-[#F4F0EB]"}`}
                            >
                              {beat.title}
                            </h4>
                            <p className="text-xs text-[#C2B9B0] truncate">
                              {beat.type} <span className="md:hidden text-[#9E938B]">• {beat.bpm} BPM</span>
                            </p>
                          </div>
                        </div>

                        <div className="hidden lg:flex items-center space-x-8 text-xs text-[#C2B9B0] mx-4">
                          <span className="w-16">BPM: <strong className="text-zinc-200">{beat.bpm}</strong></span>
                          <span className="w-20">KEY: <strong className="text-zinc-200">{beat.key}</strong></span>
                          <span className="w-24">MOOD: <strong className="text-zinc-200">{beat.mood}</strong></span>
                        </div>

                        <div className="flex items-center space-x-2 md:space-x-3 ml-2 flex-shrink-0">
                          <button className="hidden sm:block p-2 text-[#9E938B] hover:text-[#F4F0EB] transition-colors">
                            <Heart className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setSelectedBeatForPurchase(beat)}
                            className="bg-[#C66B3D] hover:bg-[#D97746] active:scale-95 text-white p-2.5 rounded-xl transition-transform flex items-center justify-center shadow-md shadow-[#C66B3D]/30"
                            title="Obtenir la licence"
                          >
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
        </main>
      )}

      <footer className="mt-20 bg-[#161311]/95 backdrop-blur-xl px-4 md:px-8 py-12 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <img 
              src="/LOGO-BEAT.png" 
              alt="HEAVIEXO BEATS" 
              className="h-10 w-auto object-contain"
            />
            <p className="text-xs text-[#C2B9B0] leading-relaxed">
              {t.footerDesc}
            </p>
            <div className="flex items-center space-x-3 text-[#C2B9B0]">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#29201C] hover:text-[#C66B3D] transition-colors shadow-md">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#29201C] hover:text-[#C66B3D] transition-colors shadow-md">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://t.me" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#29201C] hover:text-[#C66B3D] transition-colors shadow-md">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">Catalogue</h5>
            <ul className="space-y-2 text-xs text-[#C2B9B0] font-medium">
              <li onClick={() => navigateTo("store")} className="hover:text-[#C66B3D] cursor-pointer transition-colors">Dark Trap Beats</li>
              <li onClick={() => navigateTo("store")} className="hover:text-[#C66B3D] cursor-pointer transition-colors">Melodic Drill</li>
              <li onClick={() => navigateTo("store")} className="hover:text-[#C66B3D] cursor-pointer transition-colors">Afro & Amapiano</li>
              <li onClick={() => navigateTo("kits")} className="hover:text-[#C66B3D] cursor-pointer transition-colors">Soundkits & Drumkits</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB] mb-4">Ingénierie & Services</h5>
            <ul className="space-y-2 text-xs text-[#C2B9B0] font-medium">
              <li onClick={() => navigateTo("services")} className="hover:text-[#C66B3D] cursor-pointer transition-colors">Mixage Stems Pro</li>
              <li onClick={() => navigateTo("services")} className="hover:text-[#C66B3D] cursor-pointer transition-colors">Mastering Analogique</li>
              <li onClick={() => navigateTo("services")} className="hover:text-[#C66B3D] cursor-pointer transition-colors">Prod Sur-Mesure</li>
              <li onClick={() => navigateTo("services")} className="hover:text-[#C66B3D] cursor-pointer transition-colors">Contrats de Licences</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-widest text-[#F4F0EB]">{t.vipClub}</h5>
            <p className="text-xs text-[#C2B9B0] leading-relaxed">
              {t.vipDesc}
            </p>
            <div className="flex items-center space-x-2">
              <input 
                type="email" 
                placeholder="Votre e-mail..."
                className="bg-[#29201C] rounded-xl px-3 py-2 text-xs text-[#F4F0EB] focus:outline-none focus:ring-1 focus:ring-[#C66B3D] w-full shadow-inner"
              />
              <button className="bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold px-4 py-2 rounded-xl text-xs uppercase transition-transform active:scale-95 shadow-md shadow-[#C66B3D]/30">
                OK
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#9E938B] font-medium">
          <p>© 2026 HEAVIEXO BEATS. Tous droits réservés.</p>
          <div className="flex items-center space-x-4">
            <span>Paiements Sécurisés</span>
            <span className="text-[#C66B3D]">•</span>
            <span>PayPal / Carte Bancaire</span>
            <span className="text-[#C66B3D]">•</span>
            <span>Mobile Money</span>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedBeatForPurchase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedBeatForPurchase(null)}
              className="fixed inset-0 bg-black/65 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.93, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 25 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#29201C]/90 w-full max-w-xl rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl relative z-10 my-8"
            >
              <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                    <img src={selectedBeatForPurchase.cover} alt={selectedBeatForPurchase.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#F4F0EB] tracking-wide">{selectedBeatForPurchase.title}</h3>
                    <p className="text-xs text-[#C66B3D] uppercase font-extrabold">{selectedBeatForPurchase.type} • {selectedBeatForPurchase.bpm} BPM</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedBeatForPurchase(null)}
                  className="p-2 text-[#9E938B] hover:text-[#F4F0EB] rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 md:p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#9E938B] block mb-2">
                  {t.chooseExploitation}
                </span>
                
                {licensesList.map((lic) => {
                  const isSelected = selectedLicenseId === lic.id;
                  const price = Number(lic.price || 0).toFixed(2);
                  const IconComponent = lic.id === "mp3" ? FileAudio : lic.id === "wav" ? Sliders : lic.id === "stems" ? Layers : Crown;

                  let displayName = lic.name;
                  let displayFeatures = lic.features;

                  if (lang === "EN") {
                    if (lic.id === "mp3") {
                      displayName = "MP3 Lease";
                      displayFeatures = ["MP3 File 320kbps", "Up to 100,000 streams", "2,500 sales max", "1 Music Video (YouTube)", "Commercial use allowed"];
                    } else if (lic.id === "wav") {
                      displayName = "WAV Premium";
                      displayFeatures = ["High quality WAV + MP3 files", "Up to 500,000 streams", "5,000 sales max", "2 Music Videos & Radio", "Commercial use allowed"];
                    } else if (lic.id === "stems") {
                      displayName = "Trackout / Stems";
                      displayFeatures = ["All separated tracks (WAV stems)", "Unlimited streams", "Unlimited sales", "Unlimited videos & radio", "Full remix freedom"];
                    } else if (lic.id === "exclusive") {
                      displayName = "Exclusive Rights";
                      displayFeatures = ["Exclusive ownership (Removed from store)", "Unlimited rights and sales", "Full exploitation transfer", "HeavieXo keeps 100% publishing (BMI)"];
                    }
                  }

                  return (
                    <motion.div
                      whileTap={{ scale: 0.99 }}
                      key={lic.id}
                      onClick={() => setSelectedLicenseId(lic.id)}
                      className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur-2xl shadow-xl ${
                        isSelected 
                          ? "bg-[#C66B3D]/25 text-[#F4F0EB] shadow-[0_15px_35px_rgba(193,107,61,0.2)]" 
                          : "bg-white/[0.03] text-[#C2B9B0] hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2.5">
                          <IconComponent className={`w-5 h-5 ${isSelected ? "text-[#C66B3D]" : "text-[#9E938B]"}`} />
                          <h4 className="font-bold text-[#F4F0EB] text-base">{displayName}</h4>
                          {lic.popular && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#C66B3D] text-white shadow-md">
                              {t.popular}
                            </span>
                          )}
                        </div>
                        <span className="text-base md:text-lg font-black text-[#C66B3D]">${price}</span>
                      </div>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-white/5 text-xs text-[#C2B9B0]">
                        {Array.isArray(displayFeatures) && displayFeatures.map((feat: string, idx: number) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <Check className="w-3.5 h-3.5 text-[#C66B3D] flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-5 md:p-6 border-t border-white/10 bg-white/5 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-[#9E938B] font-extrabold uppercase tracking-widest block">Total sélection :</span>
                  <span className="text-2xl font-black text-[#F4F0EB]">${calculatedPrice}</span>
                </div>

                <button 
                  onClick={handleAddBeatToCart}
                  className="w-full sm:w-auto bg-[#C66B3D] hover:bg-[#D97746] active:scale-95 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center space-x-2 shadow-xl shadow-[#C66B3D]/30"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t.addToCart}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-screen max-w-md bg-[#161311]/95 backdrop-blur-2xl text-[#F4F0EB] shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-5 h-5 text-[#C66B3D]" />
                    <h3 className="font-extrabold text-lg uppercase tracking-wide">{t.cartTitle} ({cartItems.length})</h3>
                  </div>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="p-2 text-[#9E938B] hover:text-[#F4F0EB] rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-16 text-[#9E938B] space-y-3">
                      <ShoppingCart className="w-12 h-12 mx-auto opacity-30" />
                      <p className="text-sm font-semibold">{t.emptyCart}</p>
                      <span className="text-xs text-[#9E938B] block">{t.selectBeatOrKit}</span>
                    </div>
                  ) : (
                    cartItems.map((item) => {
                      const itemName = item.itemType === "beat" ? item.beat?.title : item.kit?.title;
                      let itemLicenseName = item.itemType === "beat" && item.license ? item.license.name : item.kit?.category;
                      if (lang === "EN" && item.license) {
                        if (item.license.id === "mp3") itemLicenseName = "MP3 Lease";
                        else if (item.license.id === "wav") itemLicenseName = "WAV Premium";
                        else if (item.license.id === "stems") itemLicenseName = "Trackout / Stems";
                        else if (item.license.id === "exclusive") itemLicenseName = "Exclusive Rights";
                      }

                      return (
                        <div 
                          key={item.cartId}
                          className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-2xl flex items-center justify-between space-x-3 shadow-xl"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden shadow flex-shrink-0">
                            <img src={item.itemType === "beat" ? item.beat?.cover : item.kit?.cover} alt="Cover" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-sm text-[#F4F0EB] truncate">
                              {itemName}
                            </h5>
                            <span className="text-xs text-[#C66B3D] font-extrabold uppercase block">
                              {itemLicenseName}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-sm text-[#F4F0EB] block">${item.price}</span>
                            <button 
                              onClick={() => handleRemoveFromCart(item.cartId)}
                              className="text-[#9E938B] hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {cartItems.length > 0 && (
                  <form onSubmit={handleCheckout} className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-md space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C66B3D] block mb-1">{t.artistInfo}</span>
                    
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E938B]" />
                        <input 
                          type="text" 
                          placeholder={t.artistName}
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-black/40 backdrop-blur-2xl rounded-xl pl-10 pr-4 py-3 text-xs text-[#F4F0EB] placeholder:text-[#9E938B] focus:outline-none focus:ring-1 focus:ring-[#C66B3D] shadow-inner"
                          required
                        />
                      </div>

                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E938B]" />
                        <input 
                          type="email" 
                          placeholder={t.emailAddr}
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-black/40 backdrop-blur-2xl rounded-xl pl-10 pr-4 py-3 text-xs text-[#F4F0EB] placeholder:text-[#9E938B] focus:outline-none focus:ring-1 focus:ring-[#C66B3D] shadow-inner"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#C2B9B0] block mb-2">{t.paymentMode}</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          type="button"
                          onClick={() => setPaymentMethod("momo")}
                          className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all backdrop-blur-2xl shadow-xl ${
                            paymentMethod === "momo" 
                              ? "bg-[#C66B3D]/30 text-[#F4F0EB] shadow-lg shadow-[#C66B3D]/20" 
                              : "bg-white/[0.03] text-[#C2B9B0] hover:bg-white/[0.06]"
                          }`}
                        >
                          <Smartphone className="w-4 h-4 text-[#C66B3D]" />
                          <span>Mobile Money</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => setPaymentMethod("paypal")}
                          className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all backdrop-blur-2xl shadow-xl ${
                            paymentMethod === "paypal" 
                              ? "bg-[#C66B3D]/30 text-[#F4F0EB] shadow-lg shadow-[#C66B3D]/20" 
                              : "bg-white/[0.03] text-[#C2B9B0] hover:bg-white/[0.06]"
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-[#C66B3D]" />
                          <span>PayPal / CB</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-[#C2B9B0] font-bold uppercase">{t.totalToPay}</span>
                      <span className="text-2xl font-black text-[#C66B3D]">${cartTotal}</span>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#C66B3D] hover:bg-[#D97746] active:scale-95 text-white font-extrabold py-4 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-xl shadow-[#C66B3D]/30"
                    >
                      <span>{paymentMethod === "momo" ? t.momoRedirect : t.paypalRedirect}</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#9E938B] pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C66B3D]" />
                      <span>{t.securedPayment}</span>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {currentBeat && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#161311]/90 backdrop-blur-2xl px-4 md:px-6 py-2.5 md:py-3 shadow-[0_-15px_45px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 w-1/2 md:w-1/4 min-w-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                <img src={currentBeat.cover} alt={currentBeat.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h5 
                  onClick={() => setDetailedBeat(currentBeat)}
                  className="text-xs md:text-sm font-bold text-[#F4F0EB] truncate cursor-pointer hover:text-[#C66B3D] transition-colors"
                >
                  {currentBeat.title}
                </h5>
                <p className="text-[10px] md:text-xs text-[#C66B3D] truncate">{currentBeat.type} • {currentBeat.bpm} BPM</p>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center w-2/4 max-w-xl">
              <div className="flex items-center space-x-6 mb-1.5">
                <button className="text-[#9E938B] hover:text-[#F4F0EB] transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-[#C66B3D] hover:bg-[#D97746] text-white flex items-center justify-center transition-transform transform active:scale-95 shadow-lg shadow-[#C66B3D]/30"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button className="text-[#9E938B] hover:text-[#F4F0EB] transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full flex items-center space-x-3">
                <span className="text-[10px] text-[#9E938B] font-mono w-8 text-right">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-[#C66B3D]"
                />
                <span className="text-[10px] text-[#9E938B] font-mono w-8">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex md:hidden items-center space-x-3">
              <span className="text-[11px] text-[#C66B3D] font-mono font-bold">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-[#C66B3D] text-white flex items-center justify-center active:scale-95 shadow-md shadow-[#C66B3D]/30"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>

            <div className="hidden md:flex items-center justify-end space-x-3 w-1/4">
              <button 
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                  if (tagAudioRef.current) {
                    tagAudioRef.current.muted = !isMuted;
                  }
                }}
                className="text-[#9E938B] hover:text-[#F4F0EB] transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-[#C66B3D]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}