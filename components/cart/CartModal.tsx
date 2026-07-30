'use client';

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import { CartItem as CartItemType } from "@/types";
import { CartItemComponent } from "./CartItem";
import { CartCheckout } from "./CartCheckout";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItemType[];
  cartTotal: string;
  onRemoveItem: (cartId: string) => void;
  onCheckout: (customerName: string, customerEmail: string, paymentMethod: "momo" | "paypal") => void;
  t: any;
  lang: "FR" | "EN";
}

export function CartModal({ isOpen, onClose, cartItems, cartTotal, onRemoveItem, onCheckout, t, lang }: CartModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-screen max-w-md bg-[#161311]/95 backdrop-blur-2xl text-[#F4F0EB] shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-5 h-5 text-[#C66B3D]" />
                  <h3 className="font-extrabold text-lg uppercase tracking-wide">{t.cartTitle} ({cartItems.length})</h3>
                </div>
                <button onClick={onClose} className="p-2 text-[#9E938B] hover:text-[#F4F0EB] rounded-full hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 text-[#9E938B] space-y-3">
                    <ShoppingCart className="w-12 h-12 mx-auto opacity-30" />
                    <p className="text-sm font-semibold">{t.emptyCart}</p>
                    <span className="text-xs text-[#9E938B] block">{t.selectBeatOrKit}</span>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <CartItemComponent key={item.cartId} item={item} onRemove={onRemoveItem} lang={lang} />
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <CartCheckout cartTotal={cartTotal} onCheckout={onCheckout} t={t} />
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}