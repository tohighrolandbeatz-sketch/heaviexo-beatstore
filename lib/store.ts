import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

export interface Comment {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
}

export interface Beat {
  id: string;
  title: string;
  type: string;
  bpm: number;
  key: string;
  mood: string;
  price: number;
  cover: string;
  audioUrl: string;
  description: string;
  visible?: boolean;
  comments: Comment[];
}

export interface SoundKit {
  id: string;
  title: string;
  category: "Drum Kit" | "Loop Kit" | "MIDI Pack" | "Preset Bank";
  price: number;
  cover: string;
  itemCount: string;
  fileSize: string;
  description: string;
}

export interface LicenseData {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

interface StoreData {
  beats: Beat[];
  kits: SoundKit[];
  licenses: LicenseData[];
}

const DEFAULT_DATA: StoreData = {
  beats: [
    {
      id: "1", title: "Night Call", type: "Dark Trap", bpm: 140, key: "C Minor", mood: "Cinematic",
      price: 29.99, cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      description: "Ambiance sombre, basses 808 lourdes et nappes cinématographiques créées pour un morceau percutant.",
      visible: true, comments: []
    },
    {
      id: "2", title: "Shadows & Light", type: "Melodic Drill", bpm: 142, key: "F# Minor", mood: "Emotional",
      price: 35.0, cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      description: "Mélodie de piano mélancolique combinée à des hi-hats drill rapides et agressifs.",
      visible: true, comments: []
    },
    {
      id: "3", title: "Voodoo Rhythms", type: "Afro Trap", bpm: 110, key: "A Minor", mood: "Energetic",
      price: 29.99, cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      description: "Percussions organiques et synthés hypnotiques pour un hit club très énergique.",
      visible: true, comments: []
    },
    {
      id: "4", title: "Subway Prophet", type: "Boom Bap", bpm: 90, key: "D Minor", mood: "Dark",
      price: 25.0, cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      description: "Grain vinyle vintage, batterie Boom Bap percutante et sample de cuivre sombre.",
      visible: true, comments: []
    }
  ],
  kits: [
    {
      id: "k1", title: "OBSIDIAN Dark Trap Drumkit", category: "Drum Kit", price: 29.99,
      cover: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80",
      itemCount: "140+ Samples WAV (808s, Snares, Hats)", fileSize: "320 MB",
      description: "Snares tranchantes, 808s accordées et saturées sur mesure, percs rares pour productions Dark Trap."
    },
    {
      id: "k2", title: "VOODOO Afro & Amapiano Loops", category: "Loop Kit", price: 24.99,
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
      itemCount: "25 Melodic Loops + Stems WAV", fileSize: "580 MB",
      description: "Mélodies riches avec synthés analogiques, guitares live et log drums prêts pour vos hits Afrobeat."
    },
    {
      id: "k3", title: "CYBER DRILL MIDI Suite Vol. 1", category: "MIDI Pack", price: 19.99,
      cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80",
      itemCount: "80+ Fichiers MIDI Hi-Hats & Chords", fileSize: "15 MB",
      description: "Accélérez votre workflow avec des motifs de Hi-Hats Drill complexes et des progressions d'accords sombres."
    }
  ],
  licenses: [
    { id: "mp3", name: "MP3 Lease", price: 29.99, popular: false, features: ["Fichier MP3 320 kbps (Non taggué)", "100 000 Streams Audio", "Usage Commercial Autorisé", "Contrat PDF Instantané"] },
    { id: "wav", name: "WAV Lease", price: 49.99, popular: true, features: ["Fichier WAV 24-bit HQ + MP3", "500 000 Streams Audio", "Clip Vidéo / YouTube Autorisé", "Contrat PDF Instantané"] },
    { id: "stems", name: "Trackouts / Stems", price: 99.99, popular: false, features: ["Toutes les pistes séparées (WAV)", "Streams Illimités", "Mix & Master Personnalisables", "Droits Radio & Concerts"] },
    { id: "exclusive", name: "Droits Exclusifs", price: 299.99, popular: false, features: ["Pleine Propriété Exclusive", "Retrait immédiat du BeatStore", "Exploitation commerciale illimitée", "Transfert complet des droits"] }
  ]
};

let writeQueue: Promise<void> = Promise.resolve();

function ensureStore(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(DEFAULT_DATA, null, 2), "utf-8");
  }
}

export function readStore(): StoreData {
  ensureStore();
  const raw = fs.readFileSync(STORE_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    fs.writeFileSync(STORE_FILE, JSON.stringify(DEFAULT_DATA, null, 2), "utf-8");
    return DEFAULT_DATA;
  }
}

export function writeStore(data: StoreData): Promise<void> {
  writeQueue = writeQueue.then(() => {
    ensureStore();
    const tmpFile = STORE_FILE + ".tmp";
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tmpFile, STORE_FILE);
  });
  return writeQueue;
}