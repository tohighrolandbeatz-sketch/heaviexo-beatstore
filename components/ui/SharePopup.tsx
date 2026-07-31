'use client';

import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Beat } from '@/types';

interface SharePopupProps {
  beat: Beat;
  isOpen: boolean;
  onClose: () => void;
}

export function SharePopup({ beat, isOpen, onClose }: SharePopupProps) {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen || !beat) return null;
  
  const shareUrl = `${window.location.origin}/beat/${beat.id}`;
  const shareText = `Écoute "${beat.title}" par HeavieXo Beats 🔥`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-[#1A1311] border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Partager ce beat</h3>
          <button onClick={onClose} className="text-[#888] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
          <img src={beat.cover || '/placeholder.jpg'} alt={beat.title} className="w-12 h-12 rounded-lg object-cover" />
          <div>
            <p className="text-xs font-bold text-white">{beat.title}</p>
            <p className="text-[10px] text-[#888]">{beat.type} • {beat.bpm} BPM</p>
          </div>
        </div>

        <button onClick={handleCopy} className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <span className="text-xs text-white">📋 Copier le lien</span>
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#888]" />}
        </button>

        <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <span className="text-xs text-white">💬 WhatsApp</span>
          <span className="text-[10px] text-[#888]">Partager</span>
        </a>

        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <span className="text-xs text-white">🐦 Twitter / X</span>
          <span className="text-[10px] text-[#888]">Tweeter</span>
        </a>

        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <span className="text-xs text-white">📘 Facebook</span>
          <span className="text-[10px] text-[#888]">Partager</span>
        </a>
      </div>
    </div>
  );
}