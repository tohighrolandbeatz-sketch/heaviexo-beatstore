'use client';

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Check, FileAudio, Sliders, Layers, Crown } from "lucide-react";
import { Beat, License } from "@/types";

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
  const calculatedPrice = Number(activeLicense?.price || 0).toFixed(2);

  return (
    <AnimatePresence>
      {beat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#29201C]/90 w-full max-w-xl rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl relative z-10 my-8"
          >
            <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                  <img src={beat.cover} alt={beat.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F4F0EB] tracking-wide">{beat.title}</h3>
                  <p className="text-xs text-[#C66B3D] uppercase font-extrabold">{beat.type} • {beat.bpm} BPM</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-[#9E938B] hover:text-[#F4F0EB] rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#9E938B] block mb-2">
                {t.chooseExploitation}
              </span>

              {licenses.map((lic) => {
                const isSelected = selectedLicenseId === lic.id;
                const price = Number(lic.price || 0).toFixed(2);
                const IconComponent = lic.id === "mp3" ? FileAudio : lic.id === "wav" ? Sliders : lic.id === "stems" ? Layers : Crown;

                let displayName = lic.name;
                let displayFeatures = lic.features;

                if (lang === "EN") {
                  if (lic.id === "mp3") {
                    displayName = "MP3 Lease";
                    displayFeatures = ["MP3 File 320kbps", "Up to 100,000 streams", "2,500 sales max", "1 Music Video (YouTube)", "Commercial use allowed"];
                  } else if (lic.id === "wav") {
                    displayName = "WAV Premium";
                    displayFeatures = ["High quality WAV + MP3 files", "Up to 500,000 streams", "5,000 sales max", "2 Music Videos & Radio", "Commercial use allowed"];
                  } else if (lic.id === "stems") {
                    displayName = "Trackout / Stems";
                    displayFeatures = ["All separated tracks (WAV stems)", "Unlimited streams", "Unlimited sales", "Unlimited videos & radio", "Full remix freedom"];
                  } else if (lic.id === "exclusive") {
                    displayName = "Exclusive Rights";
                    displayFeatures = ["Exclusive ownership (Removed from store)", "Unlimited rights and sales", "Full exploitation transfer", "HeavieXo keeps 100% publishing (BMI)"];
                  }
                }

                return (
                  <motion.div
                    whileTap={{ scale: 0.99 }}
                    key={lic.id}
                    onClick={() => onSelectLicense(lic.id)}
                    className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur-2xl shadow-xl ${
                      isSelected
                        ? "bg-[#C66B3D]/25 text-[#F4F0EB] shadow-[0_15px_35px_rgba(193,107,61,0.2)]"
                        : "bg-white/[0.03] text-[#C2B9B0] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2.5">
                        <IconComponent className={`w-5 h-5 ${isSelected ? "text-[#C66B3D]" : "text-[#9E938B]"}`} />
                        <h4 className="font-bold text-[#F4F0EB] text-base">{displayName}</h4>
                        {lic.popular && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#C66B3D] text-white shadow-md">
                            {t.popular}
                          </span>
                        )}
                      </div>
                      <span className="text-base md:text-lg font-black text-[#C66B3D]">${price}</span>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-white/5 text-xs text-[#C2B9B0]">
                      {Array.isArray(displayFeatures) && displayFeatures.map((feat: string, idx: number) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-[#C66B3D] flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-5 md:p-6 border-t border-white/10 bg-white/5 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#9E938B] font-extrabold uppercase tracking-widest block">Total sélection :</span>
                <span className="text-2xl font-black text-[#F4F0EB]">${calculatedPrice}</span>
              </div>

              <button
                onClick={onAddToCart}
                className="w-full sm:w-auto bg-[#C66B3D] hover:bg-[#D97746] active:scale-95 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center space-x-2 shadow-xl shadow-[#C66B3D]/30"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}