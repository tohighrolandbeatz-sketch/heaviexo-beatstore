import { License } from "@/types";

export const defaultLicenses: License[] = [
  { 
    id: "mp3", 
    name: "MP3 Lease", 
    price: 29.99, 
    features: [
      "Fichier MP3 320kbps", 
      "Jusqu'à 100 000 streams", 
      "2 500 ventes max", 
      "1 Clip Vidéo (YouTube)", 
      "Usage commercial autorisé"
    ] 
  },
  { 
    id: "wav", 
    name: "WAV Premium", 
    price: 49.99, 
    popular: true, 
    features: [
      "Fichier WAV + MP3 haute qualité", 
      "Jusqu'à 500 000 streams", 
      "5 000 ventes max", 
      "2 Clips Vidéos & Radio", 
      "Usage commercial autorisé"
    ] 
  },
  { 
    id: "stems", 
    name: "Trackout / Stems", 
    price: 149.00, 
    features: [
      "Toutes les pistes séparées (WAV)", 
      "Streams illimités", 
      "Ventes illimitées", 
      "Clips & Radio illimités", 
      "Liberté totale de remix"
    ] 
  },
  { 
    id: "exclusive", 
    name: "Exclusive Rights", 
    price: 997.00, 
    features: [
      "Propriété exclusive (Retiré du store)", 
      "Droits et ventes illimités", 
      "Cession totale d'exploitation", 
      "HeavieXo conserve 100% parts auteur (BMI)"
    ] 
  }
];