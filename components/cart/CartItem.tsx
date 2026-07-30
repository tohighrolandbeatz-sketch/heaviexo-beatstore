'use client';

import React from "react";
import { Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onRemove: (cartId: string) => void;
  lang: "FR" | "EN";
}

export function CartItemComponent({ item, onRemove, lang }: CartItemProps) {
  const itemName = item.itemType === "beat" ? item.beat?.title : item.kit?.title;
  let itemLicenseName = item.itemType === "beat" && item.license ? item.license.name : item.kit?.category;
  
  if (lang === "EN" && item.license) {
    if (item.license.id === "mp3") itemLicenseName = "MP3 Lease";
    else if (item.license.id === "wav") itemLicenseName = "WAV Premium";
    else if (item.license.id === "stems") itemLicenseName = "Trackout / Stems";
    else if (item.license.id === "exclusive") itemLicenseName = "Exclusive Rights";
  }

  return (
    <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-2xl flex items-center justify-between space-x-3 shadow-xl">
      <div className="w-12 h-12 rounded-xl overflow-hidden shadow flex-shrink-0">
        <img src={item.itemType === "beat" ? item.beat?.cover : item.kit?.cover} alt="Cover" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="font-bold text-sm text-[#F4F0EB] truncate">{itemName}</h5>
        <span className="text-xs text-[#C66B3D] font-extrabold uppercase block">{itemLicenseName}</span>
      </div>
      <div className="text-right">
        <span className="font-black text-sm text-[#F4F0EB] block">${item.price}</span>
        <button onClick={() => onRemove(item.cartId)} className="text-[#9E938B] hover:text-red-400 transition-colors p-1">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}