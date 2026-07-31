'use client';

import React, { useState } from "react";
import { User, Mail, Smartphone, CreditCard, ExternalLink, ShieldCheck, Ticket } from "lucide-react";
import { PHONE_WHATSAPP, PHONE_OWNER_NAME } from "@/constants/config";

interface CartCheckoutProps {
  cartTotal: string;
  onCheckout: (customerName: string, customerEmail: string, paymentMethod: "momo" | "paypal") => void;
  t: any;
}

export function CartCheckout({ cartTotal, onCheckout, t }: CartCheckoutProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "paypal">("momo");
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountFixed, setDiscountFixed] = useState(0);
  const [promoLoading, setPromoLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckout(customerName, customerEmail, paymentMethod);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoMessage(null);

    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode }),
      });
      const data = await res.json();

      if (data.valid) {
        if (data.type === 'percent') {
          setDiscountPercent(data.discount);
          setDiscountFixed(0);
        } else {
          setDiscountFixed(data.discount);
          setDiscountPercent(0);
        }
        setPromoMessage({ text: data.message, type: 'success' });
      } else {
        setDiscountPercent(0);
        setDiscountFixed(0);
        setPromoMessage({ text: data.error, type: 'error' });
      }
    } catch {
      setPromoMessage({ text: 'Erreur lors de la vérification', type: 'error' });
    } finally {
      setPromoLoading(false);
    }
  };

  const discountedTotal = Math.max(0, parseFloat(cartTotal) - discountFixed - (parseFloat(cartTotal) * discountPercent / 100)).toFixed(2);

  return (
    <form onSubmit={handleSubmit} className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-md space-y-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-[#C66B3D] block mb-1">{t.artistInfo}</span>

      <div className="space-y-2">
        <div className="relative">
          <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E938B]" />
          <input type="text" placeholder={t.artistName} value={customerName} onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-black/40 backdrop-blur-2xl rounded-xl pl-10 pr-4 py-3 text-xs text-[#F4F0EB] placeholder:text-[#9E938B] focus:outline-none focus:ring-1 focus:ring-[#C66B3D] shadow-inner" required />
        </div>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E938B]" />
          <input type="email" placeholder={t.emailAddr} value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full bg-black/40 backdrop-blur-2xl rounded-xl pl-10 pr-4 py-3 text-xs text-[#F4F0EB] placeholder:text-[#9E938B] focus:outline-none focus:ring-1 focus:ring-[#C66B3D] shadow-inner" required />
        </div>
      </div>

      {/* Code Promo */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#C2B9B0] block">Code Promo</span>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Ticket className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E938B]" />
            <input type="text" placeholder="Entrez un code..." value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyPromo())}
              className="w-full bg-black/40 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-[#9E938B] focus:outline-none focus:ring-1 focus:ring-[#C66B3D]" />
          </div>
          <button type="button" onClick={handleApplyPromo} disabled={promoLoading}
            className="bg-[#C66B3D]/20 text-[#C66B3D] font-bold px-4 py-3 rounded-xl text-xs hover:bg-[#C66B3D]/30 transition-colors disabled:opacity-50">
            {promoLoading ? '...' : 'Appliquer'}
          </button>
        </div>
        {promoMessage && (
          <p className={`text-[10px] ${promoMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {promoMessage.text}
          </p>
        )}
      </div>

      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#C2B9B0] block mb-2">{t.paymentMode}</span>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setPaymentMethod("momo")}
            className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all backdrop-blur-2xl shadow-xl ${
              paymentMethod === "momo" ? "bg-[#C66B3D]/30 text-[#F4F0EB] shadow-lg shadow-[#C66B3D]/20" : "bg-white/[0.03] text-[#C2B9B0] hover:bg-white/[0.06]"}`}>
            <Smartphone className="w-4 h-4 text-[#C66B3D]" /><span>Mobile Money</span>
          </button>
          <button type="button" onClick={() => setPaymentMethod("paypal")}
            className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all backdrop-blur-2xl shadow-xl ${
              paymentMethod === "paypal" ? "bg-[#C66B3D]/30 text-[#F4F0EB] shadow-lg shadow-[#C66B3D]/20" : "bg-white/[0.03] text-[#C2B9B0] hover:bg-white/[0.06]"}`}>
            <CreditCard className="w-4 h-4 text-[#C66B3D]" /><span>PayPal / CB</span>
          </button>
        </div>
      </div>

      {paymentMethod === "momo" && (
        <div className="bg-[#C66B3D]/10 border border-[#C66B3D]/30 rounded-xl p-3 text-center">
          <p className="text-[10px] text-[#C2B9B0] uppercase tracking-wider mb-1">{t.momoInfoTitle}</p>
          <p className="text-sm font-bold text-white">{PHONE_OWNER_NAME}</p>
          <p className="text-sm font-bold text-[#C66B3D]">+{PHONE_WHATSAPP}</p>
          <p className="text-[10px] text-[#9E938B] mt-1">{t.momoInfoSub}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <span className="text-xs text-[#C2B9B0] font-bold uppercase">{t.totalToPay}</span>
        <div className="text-right">
          {(discountPercent > 0 || discountFixed > 0) && (
            <span className="text-xs text-[#888] line-through block">${cartTotal}</span>
          )}
          <span className="text-2xl font-black text-[#C66B3D]">${discountedTotal}</span>
        </div>
      </div>

      <button type="submit"
        className="w-full bg-[#C66B3D] hover:bg-[#D97746] active:scale-95 text-white font-extrabold py-4 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-xl shadow-[#C66B3D]/30">
        <span>{paymentMethod === "momo" ? t.momoRedirect : t.paypalRedirect}</span>
        <ExternalLink className="w-4 h-4" />
      </button>

      <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#9E938B] pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-[#C66B3D]" />
        <span>{t.securedPayment}</span>
      </div>
    </form>
  );
}