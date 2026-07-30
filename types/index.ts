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
  previewMp3: string;
  description: string;
  visible?: boolean;
  comments?: Comment[];
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

export interface License {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface CartItem {
  cartId: string;
  itemType: "beat" | "kit";
  beat?: Beat;
  license?: License;
  kit?: SoundKit;
  price: string;
}