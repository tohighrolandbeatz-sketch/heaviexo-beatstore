'use client';

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Check, Phone } from "lucide-react";
import { Beat, License } from "@/types";
import { PHONE_WHATSAPP } from "@/constants/config";

interface LicenseModalProps {
  beat: Beat | null;
  licenses: License[];
  selectedLicenseId: string;
  onSelectLicense: (id: string) => void;
  onAddToCart: () => void;
  onClose: () => void;
  t: any;
  lang: "FR" | "EN";
}

export function LicenseModal({ beat, licenses, selectedLicenseId, onSelectLicense, onAddToCart, onClose, t, lang }: LicenseModalProps) {
  if (!beat) return null;

  const activeLicense = licenses.find(l => l.id === selectedLicenseId) || licenses[0];
  const isExclusive = activeLicense?.id === 'exclusive';

  const handleContactWhatsApp = () => {
    const message = `Bonjour HeavieXo, je suis intéressé par les droits exclusifs du beat "${beat.title}". Merci de me recontacter.`;
    window.open(`https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {beat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-[#1C1714]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 w-full max-w-md space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">{t.getLicense || "Obtenir une Licence"}</h3>
              <button onClick={onClose} className="p-2 text-[#888] hover:text-white rounded-full hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-black/30 rounded-2xl">
              <img src={beat.cover} alt={beat.title} className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <p className="font-bold text-white">{beat.title}</p>
                <p className="text-xs text-[#888]">{beat.type || 'Beat'} • {beat.bpm} BPM</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C2B9B0] block mb-2">{t.chooseExploitation || "Choisir une licence"}</span>
              {licenses.map((lic) => {
                const features = Array.isArray(lic.features) ? lic.features : [];
                const isExclusiveLic = lic.id === 'exclusive';
                return (
                  <button
                    key={lic.id}
                    onClick={() => onSelectLicense(lic.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all border ${
                      selectedLicenseId === lic.id
                        ? 'bg-[#C66B3D]/10 border-[#C66B3D]/50 shadow-lg'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        {lic.name}
                        {lic.id === 'wav' && <span className="ml-2 text-[10px] bg-[#C66B3D]/20 text-[#C66B3D] px-2 py-0.5 rounded-full">{t.popular || "Populaire"}</span>}
                      </span>
                      {isExclusiveLic ? (
                        <span className="text-sm font-black text-[#C66B3D]">Sur Devis</span>
                      ) : (
                        <span className="text-sm font-black text-[#C66B3D]">${Number(lic.price || 0).toFixed(2)}</span>
                      )}
                    </div>
                    {(selectedLicenseId === lic.id || licenses.length === 1) && features.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {features.map((f: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] text-[#C2B9B0]">
                            <Check className="w-3.5 h-3.5 text-[#C66B3D] flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-xs text-[#C2B9B0] font-bold uppercase">{t.totalToPay || "Total"}</span>
              {isExclusive ? (
                <span className="text-lg font-black text-[#C66B3D]">Sur Devis</span>
              ) : (
                <span className="text-2xl font-black text-[#C66B3D]">${Number(activeLicense?.price || 0).toFixed(2)}</span>
              )}
            </div>

            {isExclusive ? (
              <button
                onClick={handleContactWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-extrabold py-4 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <Phone className="w-4 h-4" />
                Contacter HeavieXo sur WhatsApp
              </button>
            ) : (
              <button
                onClick={onAddToCart}
                className="w-full bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold py-4 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C66B3D]/30"
              >
                <ShoppingCart className="w-4 h-4" />
                {lang === "FR" ? "Ajouter au panier" : "Add to Cart"}
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}