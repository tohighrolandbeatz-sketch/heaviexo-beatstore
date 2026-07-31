'use client';

import { useRouter } from 'next/navigation';
import { Play, Pause, ShoppingCart, ArrowRight } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8">
        <img src={mappedBeat.cover} alt={mappedBeat.title} className="w-full max-w-md mx-auto rounded-3xl shadow-2xl" />
        <h1 className="text-4xl md:text-6xl font-black uppercase">{mappedBeat.title}</h1>
        <div className="flex items-center justify-center gap-4 text-[#C2B9B0]">
          <span>{mappedBeat.type}</span>
          <span>•</span>
          <span>{mappedBeat.bpm} BPM</span>
          <span>•</span>
          <span>{mappedBeat.key}</span>
        </div>

        <div className="bg-[#1A1311] rounded-2xl p-4 flex items-center gap-4 max-w-md mx-auto">
          <button onClick={() => togglePlay(mappedBeat)} className="w-12 h-12 rounded-full bg-[#C66B3D] flex items-center justify-center">
            {isThisPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <div className="flex-1" onClick={(e: any) => {
            const rect = e.currentTarget.getBoundingClientRect();
            seek((e.clientX - rect.left) / rect.width * duration);
          }}>
            <div className="h-1 bg-white/10 rounded-full cursor-pointer">
              <div className="h-full bg-[#C66B3D] rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-white/40 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <button onClick={() => setShowLicense(true)} className="bg-[#C66B3D] text-white font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wider hover:bg-[#FF8C5A] transition-all inline-flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Obtenir une licence
        </button>

        <button onClick={() => router.push('/')} className="text-[#888] hover:text-white transition-colors text-sm flex items-center gap-2 justify-center">
          <ArrowRight className="w-4 h-4" /> Retour au Beatstore
        </button>
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
