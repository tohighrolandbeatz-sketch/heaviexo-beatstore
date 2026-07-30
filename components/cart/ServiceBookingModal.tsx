'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, User, Mail, MessageCircle, Music, Send } from "lucide-react";

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle: string;
  packagePrice: string;
  packageFeatures: string[];
  packageType: "EP" | "Album" | "Custom" | "MixMaster";
}

export function ServiceBookingModal({ isOpen, onClose, packageTitle, packagePrice, packageFeatures, packageType }: ServiceBookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    artistName: "",
    email: "",
    phone: "",
    projectName: "",
    style: "",
    references: "",
    deadline: "",
    tracks: "",
    message: ""
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = `Réservation ${packageType} - ${formData.artistName}`;
    const body = `
🎵 RÉSERVATION ${packageType}
━━━━━━━━━━━━━━━━━━━━
📦 Package : ${packageTitle}
💰 Prix : ${packagePrice}

👤 Artiste : ${formData.artistName}
📧 Email : ${formData.email}
📱 Téléphone : ${formData.phone}
🎶 Projet : ${formData.projectName}
🎧 Style musical : ${formData.style}
🎯 Références : ${formData.references}
📅 Deadline souhaitée : ${formData.deadline}
🔢 Nombre de pistes : ${formData.tracks}

💬 Message :
${formData.message}
━━━━━━━━━━━━━━━━━━━━
    `.trim();

    window.open(`mailto:contact@heaviexo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0a0a0a] border border-[#2a2a2a] w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative z-10 my-8"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-xs tracking-[0.2em] uppercase mb-2">Réservation</p>
                <h2 className="text-4xl font-bold text-white mb-1 tracking-tight">{packageTitle}</h2>
                <p className="text-gray-400 text-sm">{packageType === "EP" ? "4–6 tracks" : packageType === "Album" ? "10+ tracks" : "Sur-mesure"}</p>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prix */}
            <div className="px-8 mb-6 flex items-baseline gap-2">
              <span className="text-gray-500 text-xs uppercase tracking-widest font-semibold">From</span>
              <span className="text-6xl font-extrabold tracking-tighter text-white">{packagePrice}</span>
            </div>

            {/* Steps */}
            <div className="px-8 mb-6 flex gap-4">
              {[1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setStep(s)}
                  className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                    step === s ? 'bg-[#ff4500] text-white' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                  }`}
                >
                  {s === 1 ? "🎵 Détails du projet" : "📋 Récapitulatif"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="px-8 pb-8 space-y-4 max-h-[50vh] overflow-y-auto">
                  {/* Artiste */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Nom d'artiste / Groupe *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="text" required value={formData.artistName} onChange={(e) => updateField("artistName", e.target.value)}
                        placeholder="Ton blaze..." className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff4500] transition-colors" />
                    </div>
                  </div>

                  {/* Email + Téléphone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input type="email" required value={formData.email} onChange={(e) => updateField("email", e.target.value)}
                          placeholder="ton@email.com" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff4500] transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Téléphone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+229 XX XX XX XX" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff4500] transition-colors" />
                    </div>
                  </div>

                  {/* Projet + Style */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Nom du projet</label>
                      <div className="relative">
                        <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input type="text" value={formData.projectName} onChange={(e) => updateField("projectName", e.target.value)}
                          placeholder="Mon EP/Album..." className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff4500] transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Style musical</label>
                      <input type="text" value={formData.style} onChange={(e) => updateField("style", e.target.value)}
                        placeholder="Trap, Drill, Afro..." className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff4500] transition-colors" />
                    </div>
                  </div>

                  {/* Références */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Références (artistes, sons)</label>
                    <textarea value={formData.references} onChange={(e) => updateField("references", e.target.value)}
                      placeholder="Ex: Gunna - fukumean, Travis Scott - FE!N..." rows={2}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff4500] transition-colors resize-none" />
                  </div>

                  {/* Deadline + Tracks */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Deadline souhaitée</label>
                      <input type="text" value={formData.deadline} onChange={(e) => updateField("deadline", e.target.value)}
                        placeholder="Ex: 15 Mars 2026" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff4500] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Nombre de pistes</label>
                      <input type="text" value={formData.tracks} onChange={(e) => updateField("tracks", e.target.value)}
                        placeholder="4-6" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff4500] transition-colors" />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Message (optionnel)</label>
                    <textarea value={formData.message} onChange={(e) => updateField("message", e.target.value)}
                      placeholder="Décris ton projet, tes envies..." rows={3}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff4500] transition-colors resize-none" />
                  </div>

                  <button type="button" onClick={() => setStep(2)} className="w-full bg-[#ff4500] hover:bg-[#e03e00] text-white font-bold py-4 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-95 text-sm uppercase tracking-wider">
                    Continuer →
                  </button>
                </div>
              ) : (
                <div className="px-8 pb-8 space-y-4 max-h-[50vh] overflow-y-auto">
                  {/* Récapitulatif */}
                  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Récapitulatif de votre commande</h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">Package</span><span className="text-white font-bold">{packageTitle}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Prix</span><span className="text-[#ff4500] font-bold">{packagePrice}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Artiste</span><span className="text-white">{formData.artistName}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Email</span><span className="text-white">{formData.email}</span></div>
                      {formData.projectName && <div className="flex justify-between"><span className="text-gray-400">Projet</span><span className="text-white">{formData.projectName}</span></div>}
                      {formData.style && <div className="flex justify-between"><span className="text-gray-400">Style</span><span className="text-white">{formData.style}</span></div>}
                      {formData.tracks && <div className="flex justify-between"><span className="text-gray-400">Pistes</span><span className="text-white">{formData.tracks}</span></div>}
                    </div>

                    <div className="pt-4 border-t border-[#2a2a2a]">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Inclus :</p>
                      <ul className="space-y-1.5">
                        {packageFeatures.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-[#ff4500] flex-shrink-0 mt-0.5" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-bold py-4 rounded-full transition-all text-sm uppercase tracking-wider">
                      ← Retour
                    </button>
                    <button type="submit" className="flex-1 bg-[#ff4500] hover:bg-[#e03e00] text-white font-bold py-4 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-95 text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> Envoyer la demande
                    </button>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
