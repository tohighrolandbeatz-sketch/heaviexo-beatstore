'use client';

import React, { useState } from "react";
import { translations } from "@/constants/translations";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useBeatData } from "@/hooks/useBeatData";
import { useCart } from "@/hooks/useCart";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { ArtistMarquee } from "@/components/home/ArtistMarquee";
import { BeatDetail } from "@/components/beats/BeatDetail";
import { CartModal } from "@/components/cart/CartModal";
import { LicenseModal } from "@/components/license/LicenseModal";
import { Beat } from "@/types";
import { ShoppingCart, Play, Pause, Search } from "lucide-react";

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
          height: `${Math.random() * 70 + 20}%`,
          animation: isPlaying ? `pulseWave 0.8s infinite ease-in-out` : 'none',
          animationDelay: `${i * 0.05}s`,
        }}
      />
    ))}
  </div>
);

export default function BeatstorePage() {
  const [lang, setLang] = useState<"FR" | "EN">("FR");
  const t = translations[lang];

  const { beatsList, licensesList, branding } = useBeatData();
  const { currentBeat, isPlaying, AudioElements, togglePlay } = useAudioPlayer();
  const { cartItems, cartOpen, setCartOpen, selectedLicenseId, setSelectedLicenseId, cartTotal, handleAddBeatToCart, handleRemoveFromCart, handleCheckout } = useCart(licensesList);

  const [detailedBeat, setDetailedBeat] = useState<Beat | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedBeatForPurchase, setSelectedBeatForPurchase] = useState<Beat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const filteredBeats = beatsList.filter(beat => {
    if (beat.visible === false) return false;
    const matchesSearch = beat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (beat.type && beat.type.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre = selectedGenre === "All" || (beat.type && beat.type.toLowerCase().includes(selectedGenre.toLowerCase()));
    return matchesSearch && matchesGenre;
  });

  const handleBeatLicense = (beat: Beat, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedBeatForPurchase(beat);
  };

  const handleAddToCart = () => {
    if (selectedBeatForPurchase) {
      handleAddBeatToCart(selectedBeatForPurchase);
      setSelectedBeatForPurchase(null);
    }
  };

  const footerText = branding?.footerText || t.footerDesc;
  const copyrightText = branding?.copyright || "© 2026 HEAVIEXO BEATS. All Rights reserved.";
  const heroBeat = beatsList[0];

  return (
    <div className="min-h-screen bg-black text-[#F4F0EB] selection:bg-[#C66B3D] selection:text-white font-sans pt-24 pb-16 relative overflow-x-hidden">
      <style>{waveAnimation}</style>
      {currentBeat && <AudioElements />}

      {/* HEADER */}
      <Header
        viewMode="store"
        setViewMode={() => {}}
        lang={lang}
        setLang={setLang}
        cartItemsCount={cartItems.length}
        onCartOpen={() => setCartOpen(true)}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
        t={t}
      />

      {/* MOBILE MENU */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        setViewMode={() => {}}
        t={t}
      />

      {/* HERO SECTION */}
      {!detailedBeat && heroBeat && (
        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center mb-12 md:mb-20 overflow-hidden bg-black px-4">
          <div 
            className="absolute inset-0 z-0 opacity-40 scale-110 bg-cover bg-center blur-[100px]" 
            style={{ backgroundImage: `url(${heroBeat.cover})` }}
          />
          
          <div className="relative z-10 text-center max-w-4xl">
            <span className="inline-block px-3 py-1 mb-4 md:mb-6 text-[10px] md:text-[11px] font-bold uppercase tracking-widest rounded-full bg-[#C66B3D]/20 text-[#C66B3D] border border-[#C66B3D]/30 backdrop-blur-sm">Dernière Sortie Exclusive</span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-[#F4F0EB] tracking-tighter mb-4 md:mb-6 leading-[0.9] drop-shadow-lg">
              {heroBeat.title}
            </h1>
            <p className="text-sm md:text-xl text-[#C2B9B0] mb-8 md:mb-10 font-light max-w-xl mx-auto">Plongez dans l'univers sonore de <strong className='text-white font-medium'>Heaviexo</strong>. Production sombre et atmosphérique certifiée.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => togglePlay(heroBeat)} className="flex items-center justify-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-extrabold text-sm md:text-lg hover:scale-105 transition-transform">
                {isPlaying && currentBeat?.id === heroBeat.id ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black" />}
                {isPlaying && currentBeat?.id === heroBeat.id ? "PAUSE" : "PLAY NOW"}
              </button>
              <button onClick={(e) => handleBeatLicense(heroBeat, e)} className="bg-black/50 backdrop-blur-md border border-white/10 text-white px-8 py-3.5 rounded-full font-bold text-sm md:text-lg hover:bg-white/10">
                LICENCE
              </button>
            </div>
          </div>
        </section>
      )}

      <ArtistMarquee />

      {/* MAIN CONTENT */}
      <main className="px-4 md:px-10 pt-6 max-w-7xl mx-auto">
        {detailedBeat ? (
          <BeatDetail
            beat={detailedBeat}
            onBack={() => setDetailedBeat(null)}
            onGetLicense={(beat) => handleBeatLicense(beat)}
            t={t}
          />
        ) : (
          <div className="animate-fadeIn space-y-6">
            {/* SEARCH & FILTERS */}
            <div className="bg-[#111] border border-white/5 p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder || "Rechercher un beat, genre, mood..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-[#888] focus:outline-none focus:border-[#C66B3D] transition-colors"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                {["All", "Dark Trap", "Melodic Drill", "Boom Bap"].map(genre => (
                  <button 
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${selectedGenre === genre ? 'bg-[#C66B3D] text-white' : 'bg-white/5 text-[#888] hover:text-white'}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* BEATS LIST */}
            <div className="bg-[#111]/90 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl divide-y divide-white/5">
              <div className="px-4 md:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#666] grid grid-cols-12 items-center">
                <div className="col-span-7 sm:col-span-5">Titre / Projet</div>
                <div className="hidden sm:block sm:col-span-2">Genre / BPM</div>
                <div className="col-span-2 sm:col-span-3 text-center">Waveform</div>
                <div className="col-span-3 sm:col-span-2 text-right">Actions</div>
              </div>

              {filteredBeats.map((beat) => {
                const isThisPlaying = currentBeat?.id === beat.id && isPlaying;
                const isThisSelected = currentBeat?.id === beat.id;

                return (
                  <div
                    key={beat.id}
                    onClick={() => setDetailedBeat(beat)}
                    className={`group px-4 md:px-6 py-3.5 grid grid-cols-12 items-center cursor-pointer transition-all duration-200 ${
                      isThisSelected ? 'bg-[#C66B3D]/15 border-l-4 border-l-[#C66B3D]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="col-span-7 sm:col-span-5 flex items-center gap-3 md:gap-4 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-black group-hover:scale-105 transition-transform shadow-md">
                        <img src={beat.cover} alt={beat.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-[9px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded">Détails</span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className={`font-bold text-xs md:text-sm truncate transition-colors ${isThisSelected ? 'text-[#C66B3D]' : 'text-white group-hover:text-[#C66B3D]'}`}>
                          {beat.title}
                        </h4>
                        <p className="text-[10px] md:text-[11px] text-[#888] truncate">{beat.type || 'Trap'} • {beat.bpm} BPM</p>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:col-span-2 text-xs text-[#ccc]">
                      <span className="block font-medium">{beat.type || 'Trap'}</span>
                      <span className="text-[10px] text-[#888]">{beat.bpm} BPM</span>
                    </div>
                    <div className="col-span-2 sm:col-span-3 flex justify-center" onClick={(e) => { e.stopPropagation(); togglePlay(beat); }}>
                      <div className="p-1 hover:scale-105 transition-transform" title="Play / Pause">
                        <MiniWaveform isPlaying={isThisPlaying} />
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1.5 md:gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => togglePlay(beat)} className={`p-2 rounded-xl border transition-all ${isThisSelected ? 'bg-[#C66B3D] text-white border-[#C66B3D]' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}>
                        {isThisPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>
                      <button onClick={(e) => handleBeatLicense(beat, e)} className="bg-[#C66B3D] hover:bg-[#d87847] text-white px-3 md:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-sm">
                        <ShoppingCart className="w-3 h-3" />
                        <span>${beat.price || 29}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer t={t} setViewMode={() => {}} footerText={footerText} copyrightText={copyrightText} />

      {/* MODALS */}
      <LicenseModal beat={selectedBeatForPurchase} licenses={licensesList} selectedLicenseId={selectedLicenseId} onSelectLicense={setSelectedLicenseId} onAddToCart={handleAddToCart} onClose={() => setSelectedBeatForPurchase(null)} t={t} lang={lang} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} cartTotal={cartTotal} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} t={t} lang={lang} />
    </div>
  );
}