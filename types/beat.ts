export interface Beat {
  id: string;          // ex: "b_0001"
  folder: string;      // ex: "b_0001"
  title: string;
  genre: string;
  mood: string;
  bpm: number;
  musicalKey: string;
  price: number;
  cover: string;
  previewMp3: string;
  masterWav?: string;
  stemsZip?: string;
  visible: boolean;
  createdAt: string;
}

export interface BeatUploadPayload {
  title: string;
  genre: string;
  mood: string;
  bpm: number;
  musicalKey: string;
  price: number;
  cover: string;
  previewMp3: string;
  masterWav?: string;
  stemsZip?: string;
}