"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Trash2, ShoppingCart, Send, CreditCard, Phone, User } from "lucide-react";

const PHONE_WHATSAPP = "2290156646409"; // Ton numéro Mobile Money officiel

interface CartDrawerProps {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cartItems: any[];
  handleRemoveFromCart: (cartId: string) => void;
  cartTotal: string;
  t: any;
}

export default function CartDrawer({
  cartOpen,
  setCartOpen,
  cartItems,
  handleRemoveFromCart,
  cartTotal,
  t
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "momo">("momo");

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || cartItems.length === 0) return;

    const itemsSummary = cartItems.map((item, idx) => {
      if (item.itemType === "beat") {
        return `${idx + 1}. Beat: ${item.beat?.title} (${item.license?.name}) - ${item.price}€`;
      }
      return `${idx + 1}. Kit: ${item.kit?.title} - ${item.price}€`;
    }).join("%0A");

    if (paymentMethod === "momo") {
      const message = `*COMMANDE HEAVIEXO BEATS*%0A%0AArtiste: ${encodeURIComponent(customerName)}%0AEmail: ${encodeURIComponent(customerEmail)}%0A%0A*Articles:*%0A${itemsSummary}%0A%0A*Total à payer:* ${cartTotal} EUR%0A%0A👑 *Bénéficiaire:* GBOSSA TOLIDJI ROLAND GAEL%0A📱 *Numéro MoMo:* +229 01 56 64 64 09%0A%0A👉 *Consigne :* J'ai effectué le paiement Mobile Money et je joins ma capture d'écran / preuve de paiement ci-dessous.`;
      window.open(`https://wa.me/${PHONE_WHATSAPP}?text=${message}`, "_blank");
    } else {
      // Sélection dynamique du lien PayPal en fonction du type de licence du premier article ou du panier
      let paypalLink = "https://www.paypal.com/ncp/payment/8ATGLJLD9WVBC"; // Lien par défaut (WAV)

      const firstItem = cartItems[0];
      if (firstItem && firstItem.itemType === "beat") {
        const licenseId = firstItem.license?.id;
        if (licenseId === "mp3") {
          paypalLink = "https://www.paypal.com/ncp/payment/ZSS69K9VHU59C";
        } else if (licenseId === "wav") {
          paypalLink = "https://www.paypal.com/ncp/payment/8ATGLJLD9WVBC";
        } else if (licenseId === "stems") {
          paypalLink = "https://www.paypal.com/ncp/payment/WG64S2QL5RUNL";
        } else if (licenseId === "exclusive") {
          paypalLink = "https://www.paypal.com/ncp/payment/XU9GSXMKN2HKL";
        }
      }

      window.open(paypalLink, "_blank");
    }
  };

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-screen max-w-md bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col justify-between"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-lg text-white uppercase tracking-wider">{t.cartTitle}</h3>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <ShoppingCart className="w-12 h-12 text-zinc-600 mx-auto stroke-1" />
                <p className="text-sm font-bold text-zinc-400">{t.emptyCart}</p>
                <p className="text-xs text-zinc-600">{t.selectBeatOrKit}</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.cartId} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={item.itemType === "beat" ? item.beat?.cover : item.kit?.cover}
                      alt="Cover"
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">
                        {item.itemType === "beat" ? item.beat?.title : item.kit?.title}
                      </h4>
                      <p className="text-[10px] text-emerald-400 font-extrabold uppercase">
                        {item.itemType === "beat" ? item.license?.name : item.kit?.category}
                      </p>
                      <span className="text-xs font-black text-white">{item.price} €</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.cartId)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
              <form onSubmit={handleCheckout} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    {t.artistName}
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    {t.emailAddr}
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    {t.paymentMode}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("momo")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                        paymentMethod === "momo"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : "bg-zinc-900 border-white/10 text-zinc-400"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Mobile Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                        paymentMethod === "paypal"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : "bg-zinc-900 border-white/10 text-zinc-400"
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>PayPal</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === "momo" && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1.5">
                    <p className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">
                      Instructions de paiement MoMo :
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-white">
                      <User className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="font-bold">GBOSSA TOLIDJI ROLAND GAEL</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-white">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="font-mono font-bold">+229 01 56 64 64 09</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 pt-1 border-t border-white/5">
                      1. Effectuez d'abord le transfert.<br />
                      2. Cliquez ci-dessous pour envoyer la preuve sur WhatsApp.
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-sm">
                  <span className="text-zinc-400 font-semibold">{t.totalToPay}</span>
                  <span className="text-xl font-black text-emerald-400">{cartTotal} €</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-black font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center space-x-2"
                >
                  {paymentMethod === "momo" ? (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Envoyer la commande sur WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>{t.paypalRedirect}</span>
                    </>
                  )}
                </button>
              </form>

              <p className="text-[10px] text-zinc-500 text-center font-medium">
                {t.securedPayment}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}