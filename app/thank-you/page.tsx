'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as "FR" | "EN") || "FR";

  const content = {
    FR: {
      title: "Merci pour votre commande !",
      subtitle: "Votre demande a été envoyée avec succès. Veuillez effectuer le paiement Mobile Money et envoyer la capture d'écran sur WhatsApp. Vos fichiers vous seront livrés dès confirmation du paiement.",
      confirmation: "Confirmation",
      confirmationText: "Un récapitulatif sera envoyé par WhatsApp",
      support: "Support",
      supportText: "Des questions ? Contactez-nous sur WhatsApp",
      back: "Retour au Beatstore"
    },
    EN: {
      title: "Thank you for your order!",
      subtitle: "Your request has been sent successfully. Please complete the Mobile Money payment and send the screenshot on WhatsApp. Your files will be delivered upon payment confirmation.",
      confirmation: "Confirmation",
      confirmationText: "A summary will be sent via WhatsApp",
      support: "Support",
      supportText: "Questions? Contact us on WhatsApp",
      back: "Back to Beatstore"
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-lg space-y-8 animate-fadeIn">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#C66B3D]/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#C66B3D]" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">{t.title}</h1>
          <p className="text-[#C2B9B0] text-sm md:text-base leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="bg-[#1A1311] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-left">
            <span className="text-[#C66B3D] text-2xl">📧</span>
            <div>
              <p className="text-xs text-[#888] uppercase tracking-wider">{t.confirmation}</p>
              <p className="text-sm text-white">{t.confirmationText}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left">
            <span className="text-[#C66B3D] text-2xl">📱</span>
            <div>
              <p className="text-xs text-[#888] uppercase tracking-wider">{t.support}</p>
              <p className="text-sm text-white">{t.supportText}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 bg-[#C66B3D] text-white font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wider hover:bg-[#FF8C5A] transition-all shadow-lg shadow-[#C66B3D]/20"
        >
          {t.back}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ThankYouContent />
    </Suspense>
  );
}