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
      <div className="absolute inset-0 z-0 opacity-20 scale-125 bg-cover bg-center blur-[120px] pointer-events-none" style={{ backgroundImage: `url(${mappedBeat.cover})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#070504]/80 to-[#070504] z-0 pointer-events-none" />

      <header className="relative z-20 px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs font-semibold text-[#888] hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4 rotate-180" /> HeavieXo Beats
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLicense(true)} className="text-[#888] hover:text-[#C66B3D] p-2 transition-colors" title="Licence">
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button onClick={handleCopy} className="text-[#888] hover:text-[#C66B3D] p-2 transition-colors" title="Partager">
            {copied ? <span className="text-[10px] text-emerald-400">✓</span> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10 max-w-2xl mx-auto w-full space-y-8">
        
        <div className="relative">
          <div className={`absolute w-48 h-48 md:w-56 md:h-56 rounded-full bg-[#111] border-4 border-[#1a1a1a] flex items-center justify-center transition-all duration-700 z-0 ${isThisPlaying ? 'translate-x-16 md:translate-x-20 rotate-180 opacity-100' : 'translate-x-0 opacity-30'}`}>
            <div className="absolute inset-4 rounded-full border border-white/5" />
            <div className="absolute inset-10 rounded-full border border-white/10" />
            <div className="absolute w-12 h-12 rounded-full bg-black border-2 border-[#C66B3D] flex items-center justify-center">
              <Disc className="w-4 h-4 text-[#C66B3D]" />
            </div>
          </div>
          <div className="w-52 h-52 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl relative z-10">
            <img src={mappedBeat.cover} alt={mappedBeat.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="text-center space-y-2 max-w-xl">
          <span className="inline-block text-[10px] font-extrabold text-[#C66B3D] uppercase tracking-widest bg-[#C66B3D]/15 border border-[#C66B3D]/30 px-3 py-1 rounded-full">
            {mappedBeat.type}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">{mappedBeat.title}</h1>
          <div className="flex items-center justify-center gap-2 text-xs text-[#999]">
            <span>{mappedBeat.bpm} BPM</span><span>•</span><span>{mappedBeat.key}</span>
            {mappedBeat.mood && <><span>•</span><span>{mappedBeat.mood}</span></>}
          </div>
        </div>

        {/* Player compact */}
        <div className="w-full max-w-sm bg-[#140F0D]/80 backdrop-blur-2xl rounded-2xl p-4 space-y-3 border border-white/10">
          <div className="h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden" onClick={(e: any) => {
            const rect = e.currentTarget.getBoundingClientRect();
            seek((e.clientX - rect.left) / rect.width * duration);
          }}>
            <div className="h-full bg-gradient-to-r from-[#C66B3D] to-[#FF8C5A] rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40">{formatTime(currentTime)}</span>
            <button onClick={() => togglePlay(mappedBeat)} className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C66B3D] to-[#E8815A] flex items-center justify-center shadow-lg">
              {isThisPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
            </button>
            <span className="text-[10px] text-white/40">{formatTime(duration)}</span>
          </div>
        </div>
      </main>

      <footer className="relative z-20 px-6 py-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-[#666]">Écoutez sur <span className="text-[#C66B3D] font-bold">HeavieXo Beats</span></p>
      </footer>

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