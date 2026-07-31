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
      {/* Arrière-plan cinématique flouté */}
      <div 
        className="absolute inset-0 z-0 opacity-20 scale-125 bg-cover bg-center blur-[120px] pointer-events-none" 
        style={{ backgroundImage: `url(${mappedBeat.cover})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#070504]/80 to-[#070504] z-0 pointer-events-none" />

      {/* Header minimal */}
      <header className="relative z-20 px-6 md:px-12 py-5 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <button 
          onClick={() => router.push('/')} 
          className="flex items-center gap-2 text-xs font-medium text-[#888] hover:text-white transition-colors group"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
          HeavieXo Beats
        </button>
        <button 
          onClick={handleCopy} 
          className="flex items-center gap-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full text-[#ccc] hover:text-white transition-all"
        >
          {copied ? '✓ Copié' : <><Share2 className="w-3 h-3 text-[#C66B3D]" /> Partager</>}
        </button>
      </header>

      {/* Contenu principal */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 max-w-2xl mx-auto w-full space-y-8">
        
        {/* Cover avec animation vinyle */}
        <div className="relative flex items-center justify-center my-2">
          <div className={`absolute w-52 h-52 md:w-64 md:h-64 rounded-full bg-[#111] shadow-2xl flex items-center justify-center transition-all duration-700 ease-out z-0 ${isThisPlaying ? 'translate-x-16 md:translate-x-24 rotate-180 scale-105' : 'translate-x-0 opacity-30'}`}>
            <div className="absolute inset-3 rounded-full border border-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/5" />
            <div className="absolute w-16 h-16 rounded-full bg-black border border-[#C66B3D]/50 flex items-center justify-center">
              <Disc className="w-5 h-5 text-[#C66B3D] animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>

          <div className="w-56 h-56 md:w-68 md:h-68 rounded-2xl overflow-hidden shadow-2xl relative z-10 bg-[#15100e]">
            <img src={mappedBeat.cover} alt={mappedBeat.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
          </div>
        </div>

        {/* Infos du beat */}
        <div className="text-center space-y-2 max-w-lg">
          <span className="inline-block text-[10px] font-bold text-[#C66B3D] uppercase tracking-widest bg-[#C66B3D]/10 px-3 py-1 rounded-full">
            {mappedBeat.type}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            {mappedBeat.title}
          </h1>
          <div className="flex items-center justify-center gap-2.5 text-xs text-[#888] font-medium pt-0.5">
            <span>{mappedBeat.bpm} BPM</span>
            <span>•</span>
            <span>{mappedBeat.key}</span>
            {mappedBeat.mood && (
              <>
                <span>•</span>
                <span>{mappedBeat.mood}</span>
              </>
            )}
          </div>
        </div>

        {/* Lecteur réduit et épuré (sans contours lourds) */}
        <div className="w-full max-w-sm bg-white/[0.02] backdrop-blur-md rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-4">
            {/* Bouton Play compact */}
            <button 
              onClick={() => togglePlay(mappedBeat)}
              className="w-12 h-12 rounded-xl bg-[#C66B3D] hover:bg-[#d87847] text-white flex items-center justify-center shadow-md shadow-[#C66B3D]/20 transition-all flex-shrink-0 active:scale-95"
              aria-label={isThisPlaying ? "Pause" : "Play"}
            >
              {isThisPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            {/* Barre de progression & Waveform intégrées */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-end justify-between gap-[2px] h-6 px-0.5">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1 rounded-full transition-all duration-300 ${isThisPlaying ? 'bg-[#C66B3D]' : 'bg-white/15'}`}
                    style={{ 
                      height: `${isThisPlaying ? Math.max(12, Math.sin(i + currentTime * 5) * 24 + 10) : 6}px`,
                      opacity: isThisPlaying ? 1 : 0.3 
                    }} 
                  />
                ))}
              </div>

              <div 
                className="h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden relative" 
                onClick={(e: any) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  seek((e.clientX - rect.left) / rect.width * duration);
                }}
              >
                <div 
                  className="h-full bg-[#C66B3D] rounded-full transition-all duration-150" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-white/40 px-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Boutons d'action optimisés (plus fins et discrets) */}
        <div className="flex items-center gap-2.5 w-full max-w-sm">
          <button 
            onClick={() => setShowLicense(true)}
            className="flex-1 bg-[#C66B3D] hover:bg-[#d87847] text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#C66B3D]/20 active:scale-[0.98]"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Licence • ${mappedBeat.price}
          </button>
          <button 
            onClick={handleCopy}
            className="bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C66B3D]" />
            {copied ? 'Copié' : 'Partager'}
          </button>
        </div>
      </main>

      {/* Footer minimaliste */}
      <footer className="relative z-20 px-6 py-4 text-center">
        <p className="text-[11px] text-[#666]">
          HeavieXo Beats • Tous droits réservés
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