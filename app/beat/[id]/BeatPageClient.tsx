'use client';

import { useRouter } from 'next/navigation';
import { Play, Pause, ShoppingCart, ArrowRight, Share2, Music, Disc } from 'lucide-react';
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header minimal */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs text-[#888] hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4 rotate-180" />
          HeavieXo Beats
        </button>
        <button onClick={handleCopy} className="flex items-center gap-2 text-xs text-[#888] hover:text-white transition-colors">
          {copied ? '✓ Copié' : <><Share2 className="w-3 h-3" /> Partager</>}
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-2xl mx-auto w-full space-y-10">
        
        {/* Cover avec animation vinyle */}
        <div className="relative group">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-[#1A1311] relative z-10 group-hover:scale-105 transition-transform duration-500">
            <img src={mappedBeat.cover} alt={mappedBeat.title} className="w-full h-full object-cover" />
          </div>
          {/* Disque vinyle décoratif */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-72 md:h-72 rounded-full bg-[#111] border-4 border-[#222] z-0 transition-all duration-700 ${isThisPlaying ? 'translate-x-[-20%] translate-y-[-50%] opacity-100' : 'opacity-30'}`}>
            <div className="absolute inset-4 rounded-full border border-[#333]" />
            <div className="absolute inset-8 rounded-full border border-[#444]" />
            <div className="absolute inset-[40%] rounded-full bg-black border-2 border-[#C66B3D] flex items-center justify-center">
              <Disc className="w-4 h-4 text-[#C66B3D]" />
            </div>
          </div>
        </div>

        {/* Infos du beat */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black text-[#C66B3D] uppercase tracking-widest bg-[#C66B3D]/10 px-3 py-1 rounded-full">
            {mappedBeat.type}
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">{mappedBeat.title}</h1>
          <div className="flex items-center justify-center gap-3 text-sm text-[#888]">
            <span>{mappedBeat.bpm} BPM</span>
            <span>•</span>
            <span>{mappedBeat.key}</span>
            {mappedBeat.mood && <><span>•</span><span>{mappedBeat.mood}</span></>}
          </div>
        </div>

        {/* Player */}
        <div className="w-full max-w-md bg-[#1A1311] rounded-2xl p-5 space-y-4 shadow-2xl border border-white/5">
          {/* Progress */}
          <div className="space-y-2">
            <div className="h-2 bg-white/10 rounded-full cursor-pointer overflow-hidden" onClick={(e: any) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - rect.left) / rect.width * duration);
            }}>
              <div className="h-full bg-gradient-to-r from-[#C66B3D] to-[#FF8C5A] rounded-full transition-all duration-300 relative" style={{ width: `${progress}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-white/40">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => togglePlay(mappedBeat)}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C66B3D] to-[#E8815A] flex items-center justify-center shadow-lg shadow-[#C66B3D]/30 hover:scale-105 transition-all active:scale-95">
              {isThisPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
            </button>
          </div>

          {/* Mini waveform */}
          <div className="flex items-end justify-center gap-[2px] h-8">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="w-1 rounded-full bg-[#C66B3D]/30 transition-all duration-200"
                style={{ height: `${isThisPlaying ? 4 + Math.random() * 24 : 4}px`, opacity: isThisPlaying ? 1 : 0.3 }} />
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <button onClick={() => setShowLicense(true)}
            className="flex-1 bg-[#C66B3D] hover:bg-[#FF8C5A] text-white font-bold py-4 rounded-full text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#C66B3D]/20 flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Obtenir une licence
          </button>
          <button onClick={handleCopy}
            className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-6 rounded-full text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />
            {copied ? '✓ Copié' : 'Partager'}
          </button>
        </div>
      </div>

      {/* Footer minimal */}
      <div className="px-6 py-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-[#666]">
          Écoutez ce beat sur <span className="text-[#C66B3D] font-bold">HeavieXo Beats</span> • Produit par HeavieXo
        </p>
      </div>

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