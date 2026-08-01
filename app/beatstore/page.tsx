'use client';

import React, { useState, useEffect } from "react";
import { translations } from "@/constants/translations";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useBeatData } from "@/hooks/useBeatData";
import { useCart } from "@/hooks/useCart";
import { useTracking } from "@/hooks/useTracking";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { ArtistMarquee } from "@/components/home/ArtistMarquee";
import { BeatDetail } from "@/components/beats/BeatDetail";
import { CartModal } from "@/components/cart/CartModal";
import { LicenseModal } from "@/components/license/LicenseModal";
import { SharePopup } from "@/components/ui/SharePopup";
import { SpotifySection } from "@/components/home/SpotifySection";
import { Beat, License } from "@/types";
import { ShoppingCart, Play, Pause, Search, Share2 } from "lucide-react";
import { useBranding } from "@/components/ThemeProvider";

const waveAnimation = `
  @keyframes pulseWave {
    0% { transform: scaleY(1); opacity: 0.5; }
    50% { transform: scaleY(2.2); opacity: 1; }
    100% { transform: scaleY(1); opacity: 0.5; }
  }
`;

const MiniWaveform = ({ isPlaying }: { isPlaying: boolean }) => (
  <div className="flex items-end h-4 gap-[2px] w-20 md:w-28 overflow-hidden px-1">
    {[...Array(18)].map((_, i) => (
      <div
        key={i}
        className={`flex-1 rounded-full ${isPlaying ? 'bg-[#C66B3D]' : 'bg-white/20'}`}
        style={{
          height: `${((i * 7 + 5) % 70) + 20}%`,
          ...(isPlaying ? {
            animationName: 'pulseWave',
            animationDuration: '0.8s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            animationDelay: `${i * 0.05}s`,
          } : {}),
        }}
      />
    ))}
  </div>
);

function NowPlayingBar({ beat, isPlaying, currentTime, duration, formatTime, onToggle, onClose, onSeek }: any) {
  if (!beat) return null;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1311]/95 backdrop-blur-xl border-t border-white/5 px-4 py-3">
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-white/10 cursor-pointer group/progress"
        onClick={(e: any) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          onSeek(pct * duration);
        }}
      >
        <div className="h-full bg-[#C66B3D] transition-all duration-300 group-hover/progress:bg-[#FF8C5A]" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center gap-4 max-w-7xl mx-auto pt-1">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img src={beat.cover || "/placeholder.jpg"} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{beat.title}</p>
            <p className="text-[10px] text-[#8C8279] truncate">{beat.type}</p>
          </div>
        </div>
        <button onClick={onToggle} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0">
          {isPlaying ? <Pause className="w-4 h-4 text-black" /> : <Play className="w-4 h-4 text-black ml-0.5" />}
        </button>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[10px] text-[#8C8279] tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <button onClick={onClose} className="text-[#8C8279] hover:text-white transition text-sm">✕</button>
        </div>
      </div>
    </div>
  );
}

export default function BeatstorePage() {
  const [lang, setLang] = useState<"FR" | "EN">("FR");
  const t = translations[lang];

  const { beatsList, licensesList, branding } = useBeatData();
  const { currentBeat, isPlaying, AudioElements, togglePlay, currentTime, duration, formatTime, setOnEnd, seek } = useAudioPlayer();
  const { cartItems, cartOpen, setCartOpen, selectedLicenseId, setSelectedLicenseId, cartTotal, handleAddBeatToCart, handleRemoveFromCart, handleCheckout } = useCart(licensesList);
  const { branding: designBranding } = useBranding();

  const [detailedBeat, setDetailedBeat] = useState<Beat | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedBeatForPurchase, setSelectedBeatForPurchase] = useState<Beat | null>(null);
  const [shareBeat, setShareBeat] = useState<Beat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useTracking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredLicenses = selectedBeatForPurchase?.licenses_json
    ? licensesList.filter((l: License) => {
        try { return JSON.parse(selectedBeatForPurchase.licenses_json!).includes(l.id); } catch { return true; }
      })
    : licensesList;

  const filteredBeats = beatsList.filter((beat: Beat) => {
    if (beat.visible === false) return false;
    const q = searchQuery.toLowerCase();
    const matchSearch = beat.title.toLowerCase().includes(q) || (beat.type && beat.type.toLowerCase().includes(q));
    const matchGenre = selectedGenre === "All" || (beat.type && beat.type.toLowerCase().includes(selectedGenre.toLowerCase()));
    return matchSearch && matchGenre;
  });

  useEffect(() => {
    if (!currentBeat || filteredBeats.length === 0) return;
    const currentIndex = filteredBeats.findIndex((b: Beat) => b.id === currentBeat.id);
    setOnEnd(() => {
      const nextIndex = (currentIndex + 1) % filteredBeats.length;
      togglePlay(filteredBeats[nextIndex]);
    });
    return () => setOnEnd(null);
  }, [currentBeat, filteredBeats]);

  const handleBeatLicense = (beat: Beat, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedBeatForPurchase(beat);
  };

  const handleAddToCart = () => {
    if (selectedBeatForPurchase) { handleAddBeatToCart(selectedBeatForPurchase); setSelectedBeatForPurchase(null); }
  };

  const footerText = branding?.footerText || t.footerDesc;
  const heroBeat = beatsList.find((b: Beat) => b.featured) || beatsList[0];

  if (beatsList.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-2 border-[#C66B3D] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#C66B3D] text-sm font-medium uppercase tracking-wider">Chargement du catalogue...</p>
        <div className="flex gap-2 mt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-[#C66B3D] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="top" className="min-h-screen bg-black text-[#F4F0EB] font-sans pt-24 pb-24 relative overflow-x-hidden">
      <style>{waveAnimation}</style>
      {currentBeat && <AudioElements />}
      <Header viewMode="store" setViewMode={() => {}} lang={lang} setLang={setLang} cartItemsCount={cartItems.length} onCartOpen={() => setCartOpen(true)} onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} t={t} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} setViewMode={() => {}} t={t} />

      {!detailedBeat && heroBeat && (
        <section className="relative w-full mb-12 md:mb-20 overflow-hidden bg-black">
          <div className="relative w-full max-h-[60vh] overflow-hidden">
            <img fetchPriority="high" loading="eager" width="1200" height="1200" src={heroBeat.cover} alt={heroBeat.title} className="w-full h-full object-contain bg-black" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 md:p-10 text-center">
              <span className="inline-block px-3 py-1 mb-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D] border border-[#C66B3D]/30 backdrop-blur-sm">
                {designBranding?.heroBadge || t.heroBadge}
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-[0.9] drop-shadow-lg">
                {designBranding?.heroTitle || heroBeat.title}
              </h1>
              <p className="text-sm md:text-lg text-[#C2B9B0] mb-6 font-light max-w-xl">
                {designBranding?.heroSubtitle || t.heroSub}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button onClick={() => togglePlay(heroBeat)} className="flex items-center justify-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-extrabold text-sm md:text-lg hover:scale-105 transition-transform">
                  {isPlaying && currentBeat?.id === heroBeat.id ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black" />}
                  {isPlaying && currentBeat?.id === heroBeat.id ? "PAUSE" : "PLAY NOW"}
                </button>
                <button onClick={(e) => handleBeatLicense(heroBeat, e)} className="bg-black/50 backdrop-blur-md border border-white/10 text-white px-8 py-3.5 rounded-full font-bold text-sm md:text-lg hover:bg-white/10">LICENCE</button>
              </div>
            </div>
          </div>
        </section>
      )}

      <ArtistMarquee />
      <main className="px-4 md:px-10 pt-6 max-w-7xl mx-auto">
        {detailedBeat ? (
          <BeatDetail beat={detailedBeat} onBack={() => { setDetailedBeat(null); window.scrollTo(0, 0); }} onGetLicense={(beat: Beat) => handleBeatLicense(beat)} t={t} />
        ) : (
          <div className="animate-fadeIn space-y-6">
            <div className="bg-[#111] border border-white/5 p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
                <input type="text" placeholder={t.searchPlaceholder || "Rechercher un beat..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-[#888] focus:outline-none focus:border-[#C66B3D] transition-colors" />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                {["All", "Dark Trap", "Melodic Drill", "Boom Bap"].map(genre => (
                  <button key={genre} onClick={() => setSelectedGenre(genre)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap ${selectedGenre === genre ? 'bg-[#C66B3D] text-white' : 'bg-white/5 text-[#888] hover:text-white'}`}>{genre}</button>
                ))}
              </div>
            </div>

            <div className="bg-[#111]/90 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl divide-y divide-white/5">
              {filteredBeats.map((beat: Beat) => {
                const isThisPlaying = currentBeat?.id === beat.id && isPlaying;
                const isThisSelected = currentBeat?.id === beat.id;
                return (
                  <div key={beat.id} className={`group flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${isThisSelected ? 'bg-[#C66B3D]/15 border-l-4 border-l-[#C66B3D]' : 'hover:bg-white/[0.03]'}`}>
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-black hover:scale-105 transition-transform shadow-md" onClick={(e) => { e.stopPropagation(); togglePlay(beat); }}>
                      <img loading="lazy" width="300" height="300" sizes="(max-width: 768px) 48px, 300px" src={beat.cover} alt={beat.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        {isThisPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setDetailedBeat(beat)}>
                      <h4 className="font-bold text-sm truncate text-white group-hover:text-[#C66B3D]">{beat.title}</h4>
                      <p className="text-[10px] text-[#888] truncate">{beat.type || 'Trap'} • {beat.bpm} BPM</p>
                    </div>
                    <div className="hidden md:flex items-end gap-[2px] h-8 flex-1 justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); togglePlay(beat); }}>
                      <MiniWaveform isPlaying={isThisPlaying} />
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setShareBeat(beat); }} className="text-[#888] hover:text-white p-2 transition-colors" title="Partager">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => handleBeatLicense(beat, e)} className="bg-[#C66B3D] hover:bg-[#d87847] text-white p-2 rounded-xl shadow-sm transition-all flex-shrink-0" title="Acheter">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <SpotifySection t={t} playlistUrl={designBranding?.spotifyPlaylist || undefined} />
      <Footer t={t} setViewMode={() => {}} footerText={footerText} copyrightText={designBranding?.copyright || "© 2026 HEAVIEXO BEATS"} />
      <LicenseModal beat={selectedBeatForPurchase} licenses={filteredLicenses} selectedLicenseId={selectedLicenseId} onSelectLicense={setSelectedLicenseId} onAddToCart={handleAddToCart} onClose={() => setSelectedBeatForPurchase(null)} t={t} lang={lang} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} cartTotal={cartTotal} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} t={t} lang={lang} />
      <SharePopup beat={shareBeat!} isOpen={!!shareBeat} onClose={() => setShareBeat(null)} />
      <NowPlayingBar beat={currentBeat} isPlaying={isPlaying} currentTime={currentTime} duration={duration} formatTime={formatTime} onToggle={() => currentBeat && togglePlay(currentBeat)} onClose={() => currentBeat && togglePlay(currentBeat)} onSeek={seek} />
    </div>
  );
}