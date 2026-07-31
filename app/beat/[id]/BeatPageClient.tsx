'use client';

import { useRouter } from 'next/navigation';
import { Play, Pause, ShoppingCart, ArrowRight, Share2, Disc } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useState } from 'react';
import { LicenseModal } from '@/components/license/LicenseModal';
import { useBeatData } from '@/hooks/useBeatData';
import { useCart } from '@/hooks/useCart';
import { Beat } from '@/types';

export default function BeatPageClient({ beat }: { beat: any }) {
  const router = useRouter();
  const { togglePlay, currentBeat, isPlaying, currentTime, duration, formatTime, seek } = useAudioPlayer();
  const { licensesList } = useBeatData();
  const { selectedLicenseId, setSelectedLicenseId, handleAddBeatToCart } = useCart(licensesList);
  const [showLicense, setShowLicense] = useState(false);
  const [copied, setCopied] = useState(false);

  const isThisPlaying = currentBeat?.id === beat.id && isPlaying;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const mappedBeat: Beat = {
    id: beat.id,
    title: beat.title,
    type: beat.genre || '',
    bpm: beat.bpm || 0,
    key: beat.musical_key || '',
    mood: beat.mood || '',
    price: beat.price || 0,
    cover: beat.cover_url || '',
    previewMp3: beat.preview_url || '',
    description: beat.description || '',
    visible: true,
    licenses_json: beat.licenses_json || '[]',
    featured: beat.featured === 1,
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/beat/${beat.id}` : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070504] text-[#F4F0EB] flex flex-col relative overflow-x-hidden">
      {/* Arrière-plan cinématique flouté basé sur la pochette */}
      <div 
        className="absolute inset-0 z-0 opacity-20 scale-125 bg-cover bg-center blur-[120px] pointer-events-none" 
        style={{ backgroundImage: `url(${mappedBeat.cover})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#070504]/80 to-[#070504] z-0 pointer-events-none" />

      {/* Header minimal */}
      <header className="relative z-20 px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <button 
          onClick={() => router.push('/')} 
          className="flex items-center gap-2 text-xs font-semibold text-[#888] hover:text-white transition-colors group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
          HeavieXo Beats
        </button>
        <button 
          onClick={handleCopy} 
          className="flex items-center gap-2 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[#ccc] hover:text-white transition-all"
        >
          {copied ? '✓ Lien copié' : <><Share2 className="w-3.5 h-3.5 text-[#C66B3D]" /> Partager</>}
        </button>
      </header>

      {/* Contenu principal */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10 md:py-16 max-w-3xl mx-auto w-full space-y-12">
        
        {/* Cover avec animation vinyle immersive */}
        <div className="relative flex items-center justify-center my-4">
          {/* Disque vinyle en arrière-plan qui glisse */}
          <div className={`absolute w-60 h-60 md:w-72 md:h-72 rounded-full bg-[#111] border-[6px] border-[#1a1a1a] shadow-2xl flex items-center justify-center transition-all duration-700 ease-out z-0 ${isThisPlaying ? 'translate-x-20 md:translate-x-28 rotate-180 scale-105' : 'translate-x-0 opacity-40'}`}>
            <div className="absolute inset-3 rounded-full border border-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/5" />
            <div className="absolute inset-14 rounded-full border border-white/10" />
            <div className="absolute w-20 h-20 rounded-full bg-black border-2 border-[#C66B3D] flex items-center justify-center shadow-inner">
              <Disc className="w-6 h-6 text-[#C66B3D] animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>

          {/* Pochette principale */}
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 relative z-10 bg-[#15100e]">
            <img src={mappedBeat.cover} alt={mappedBeat.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
          </div>
        </div>

        {/* Infos du beat */}
        <div className="text-center space-y-3 max-w-xl">
          <span className="inline-block text-[11px] font-extrabold text-[#C66B3D] uppercase tracking-widest bg-[#C66B3D]/15 border border-[#C66B3D]/30 px-4 py-1.5 rounded-full backdrop-blur-md">
            {mappedBeat.type}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-md">
            {mappedBeat.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-xs md:text-sm text-[#999] font-medium pt-1">
            <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">{mappedBeat.bpm} BPM</span>
            <span>•</span>
            <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">{mappedBeat.key}</span>
            {mappedBeat.mood && (
              <>
                <span>•</span>
                <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">{mappedBeat.mood}</span>
              </>
            )}
          </div>
        </div>

        {/* Player Glassmorphism */}
        <div className="w-full max-w-md bg-[#140F0D]/80 backdrop-blur-2xl rounded-3xl p-6 space-y-5 shadow-2xl border border-white/10">
          {/* Progress bar */}
          <div className="space-y-2">
            <div 
              className="h-2.5 bg-white/10 rounded-full cursor-pointer overflow-hidden relative group" 
              onClick={(e: any) => {
                const rect = e.currentTarget.getBoundingClientRect();
                seek((e.clientX - rect.left) / rect.width * duration);
              }}
            >
              <div 
                className="h-full bg-gradient-to-r from-[#C66B3D] to-[#FF8C5A] rounded-full transition-all duration-150 relative" 
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#C66B3D] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-white/50">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls & Waveform container */}
          <div className="flex items-center justify-between gap-6 pt-1">
            {/* Mini waveform esthétique */}
            <div className="flex items-end justify-start gap-[3px] h-10 flex-1 px-2">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 rounded-full transition-all duration-300 ${isThisPlaying ? 'bg-[#C66B3D]' : 'bg-white/20'}`}
                  style={{ 
                    height: `${isThisPlaying ? Math.max(15, Math.sin(i + currentTime * 5) * 35 + 20) : 8}px`,
                    opacity: isThisPlaying ? 1 : 0.4 
                  }} 
                />
              ))}
            </div>

            {/* Bouton Play / Pause principal */}
            <button 
              onClick={() => togglePlay(mappedBeat)}
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#C66B3D] to-[#E8815A] flex items-center justify-center shadow-lg shadow-[#C66B3D]/30 hover:scale-105 active:scale-95 transition-all flex-shrink-0"
              aria-label={isThisPlaying ? "Pause" : "Play"}
            >
              {isThisPlaying ? (
                <Pause className="w-7 h-7 text-white fill-white" />
              ) : (
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Boutons d'action principaux */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-md">
          <button 
            onClick={() => setShowLicense(true)}
            className="flex-1 bg-gradient-to-r from-[#C66B3D] to-[#D97743] hover:from-[#d87847] hover:to-[#e88854] text-white font-extrabold py-4 px-8 rounded-2xl text-xs md:text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#C66B3D]/25 flex items-center justify-center gap-2.5 active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            Obtenir une licence • ${mappedBeat.price}
          </button>
          <button 
            onClick={handleCopy}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-6 rounded-2xl text-xs md:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Share2 className="w-4 h-4 text-[#C66B3D]" />
            {copied ? 'Copié !' : 'Partager'}
          </button>
        </div>
      </main>

      {/* Footer minimaliste */}
      <footer className="relative z-20 px-6 py-6 border-t border-white/5 text-center backdrop-blur-md">
        <p className="text-xs text-[#777]">
          Écoutez ce beat sur <span className="text-[#C66B3D] font-bold">HeavieXo Beats</span> • Produit par HeavieXo
        </p>
      </footer>

      {/* Modal des licences */}
      {showLicense && (
        <LicenseModal
          beat={mappedBeat}
          licenses={licensesList}
          selectedLicenseId={selectedLicenseId}
          onSelectLicense={setSelectedLicenseId}
          onAddToCart={() => { handleAddBeatToCart(mappedBeat); setShowLicense(false); }}
          onClose={() => setShowLicense(false)}
          t={{ getLicense: 'OBTENIR UNE LICENCE' }}
          lang="FR"
        />
      )}
    </div>
  );
}