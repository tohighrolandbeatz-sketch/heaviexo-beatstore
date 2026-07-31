'use client';

import React, { useState, useEffect } from "react";
import { ChevronLeft, ShoppingCart, Play, Pause, Star, MessageCircle, Share2 } from "lucide-react";
import { Beat } from "@/types";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface BeatDetailProps {
  beat: Beat;
  onBack: () => void;
  onGetLicense: (beat: Beat) => void;
  t: any;
}

export function BeatDetail({ beat, onBack, onGetLicense, t }: BeatDetailProps) {
  const { currentBeat, isPlaying, togglePlay, currentTime, duration, formatTime, seek } = useAudioPlayer();
  const isThisPlaying = currentBeat?.id === beat.id && isPlaying;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const [userRating, setUserRating] = useState(0);
  const [pseudo, setPseudo] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/comments?beatId=${beat.id}`).then(r => r.json()).then(data => { if (Array.isArray(data)) setComments(data); }).catch(() => {});
  }, [beat.id]);

  const handleAddComment = async () => {
    if (!comment.trim() || !pseudo.trim()) return;
    const res = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ beat_id: beat.id, user_id: pseudo.trim(), content: comment }) });
    if (res.ok) { const newComment = await res.json(); setComments([newComment, ...comments]); setComment(""); }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/beat/${beat.id}`;
    navigator.clipboard.writeText(url).then(() => alert('Lien copié !'));
  };

  return (
    <main className="px-4 md:px-8 pt-8 pb-32 max-w-5xl mx-auto space-y-6 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#C2B9B0] hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4" />{t.backToCatalog || "Retour au catalogue"}
      </button>

      <div className="relative w-full aspect-square max-h-[400px] rounded-3xl overflow-hidden shadow-2xl">
        <img src={beat.cover} alt={beat.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
          {isThisPlaying && (
            <div className="w-full mb-4" onClick={(e: any) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              seek(pct * duration);
            }}>
              <div className="h-1 bg-white/20 rounded-full cursor-pointer">
                <div className="h-full bg-[#C66B3D] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-white/60 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-[#C66B3D] uppercase tracking-widest">{beat.type}</span>
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase">{beat.title}</h1>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-4 h-4 cursor-pointer transition-colors ${star <= userRating ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`} onClick={() => setUserRating(star)} />
                ))}
                <span className="text-xs text-white/60 ml-2">{userRating > 0 ? `${userRating}/5` : "Noter"}</span>
              </div>
            </div>
            <button onClick={() => togglePlay(beat)} className="w-16 h-16 rounded-full bg-[#C66B3D] flex items-center justify-center shadow-lg hover:scale-105 transition-transform flex-shrink-0">
              {isThisPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-4 text-sm text-[#C2B9B0]">
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs">{beat.bpm} BPM</span>
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs">{beat.key || "C min"}</span>
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs">{beat.mood}</span>
          </div>
          <p className="text-sm text-[#C2B9B0] leading-relaxed">{beat.description || "Aucune description disponible."}</p>
        </div>
        <div className="flex items-start justify-end gap-2">
          <button onClick={handleShare} className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all" title="Partager"><Share2 className="w-5 h-5" /></button>
          <button onClick={() => onGetLicense(beat)} className="bg-[#C66B3D] hover:bg-[#FF8C5A] text-white font-extrabold px-6 py-4 rounded-2xl text-sm uppercase flex items-center gap-2 shadow-lg shadow-[#C66B3D]/20 transition-all w-full md:w-auto justify-center">
            <ShoppingCart className="w-5 h-5" />{t.getLicense || "OBTENIR UNE LICENCE"}
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2"><MessageCircle className="w-5 h-5 text-[#C66B3D]" />Commentaires ({comments.length})</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="Ton pseudo..." value={pseudo} onChange={(e) => setPseudo(e.target.value)} className="sm:w-40 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#888] focus:outline-none focus:border-[#C66B3D] transition-colors" />
          <input type="text" placeholder="Ajouter un commentaire..." value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddComment()} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#888] focus:outline-none focus:border-[#C66B3D] transition-colors" />
          <button onClick={handleAddComment} className="bg-[#C66B3D] text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-[#FF8C5A] transition-colors">Envoyer</button>
        </div>
        <div className="space-y-4">
          {comments.length === 0 && <p className="text-xs text-[#666] text-center py-4">Aucun commentaire. Sois le premier !</p>}
          {comments.map((c: any) => (
            <div key={c.id} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-8 h-8 rounded-full bg-[#C66B3D]/20 flex items-center justify-center text-xs font-bold text-[#C66B3D] flex-shrink-0">{(c.user_id || 'A')[0].toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><span className="text-xs font-semibold text-white">{c.user_id || 'Anonyme'}</span><span className="text-[10px] text-[#666]">{c.created_at?.split('T')[0] || ''}</span></div>
                <p className="text-sm text-[#C2B9B0] mt-0.5">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}