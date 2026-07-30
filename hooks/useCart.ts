import { useState } from "react";
import { CartItem, Beat, SoundKit, License } from "@/types";
import { PHONE_WHATSAPP } from "@/constants/config";

export function useCart(licensesList: License[]) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedLicenseId, setSelectedLicenseId] = useState("wav");

  const handleAddBeatToCart = (beat: Beat) => {
    const lic = licensesList.find(l => l.id === selectedLicenseId) || licensesList[0];
    const itemPrice = Number(lic?.price || 0).toFixed(2);
    const newItem: CartItem = {
      cartId: Date.now().toString(),
      itemType: "beat",
      beat,
      license: lic,
      price: itemPrice
    };
    setCartItems([...cartItems, newItem]);
    setCartOpen(true);
  };

  const handleAddKitToCart = (kit: SoundKit) => {
    const newItem: CartItem = {
      cartId: Date.now().toString(),
      itemType: "kit",
      kit,
      price: kit.price.toFixed(2)
    };
    setCartItems([...cartItems, newItem]);
    setCartOpen(true);
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2);

  const handleCheckout = (customerName: string, customerEmail: string, paymentMethod: "momo" | "paypal") => {
    if (!customerName || !customerEmail || cartItems.length === 0) return;
    
    const itemsSummary = cartItems.map((item, idx) => {
      let licenseName = item.license?.name;
      if (item.itemType === "beat") {
        return `${idx + 1}. Beat: ${item.beat?.title} (${licenseName}) - $${item.price}`;
      }
      return `${idx + 1}. Kit: ${item.kit?.title} - $${item.price}`;
    }).join("%0A");

    if (paymentMethod === "momo") {
      const message = `*COMMANDE HEAVIEXO BEATS*%0A%0A*Artiste:* ${encodeURIComponent(customerName)}%0A*Email:* ${encodeURIComponent(customerEmail)}%0A%0A*Panier:*%0A${itemsSummary}%0A%0A*Total:* $${cartTotal}%0A*Mode de Paiement:* Mobile Money (MTN / Moov)%0A%0AMerci de m'envoyer les instructions de paiement !`;
      window.open(`https://wa.me/${PHONE_WHATSAPP}?text=${message}`, "_blank");
    } else {
      let paypalLink = "https://www.paypal.com/ncp/payment/8ATGLJLD9WVBC";
      const firstItem = cartItems[0];
      if (firstItem && firstItem.itemType === "beat") {
        const licenseId = firstItem.license?.id;
        if (licenseId === "mp3") paypalLink = "https://www.paypal.com/ncp/payment/ZSS69K9VHU59C";
        else if (licenseId === "wav") paypalLink = "https://www.paypal.com/ncp/payment/8ATGLJLD9WVBC";
        else if (licenseId === "stems") paypalLink = "https://www.paypal.com/ncp/payment/WG64S2QL5RUNL";
        else if (licenseId === "exclusive") paypalLink = "https://www.paypal.com/ncp/payment/XU9GSXMKN2HKL";
      }
      window.open(paypalLink, "_blank");
    }
  };

  return {
    cartItems,
    cartOpen,
    setCartOpen,
    selectedLicenseId,
    setSelectedLicenseId,
    cartTotal,
    handleAddBeatToCart,
    handleAddKitToCart,
    handleRemoveFromCart,
    handleCheckout
  };
}