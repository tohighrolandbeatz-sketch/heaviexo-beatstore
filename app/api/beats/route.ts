import { NextResponse } from "next/server";
import { BeatRepository } from "@/lib/repositories/BeatRepository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

// Traduit une ligne SQLite (noms de colonnes DB) vers le format attendu par le frontend
function toFrontendBeat(row: any) {
  return {
    id: row.id,
    title: row.title,
    type: row.genre || row.type || "",
    bpm: row.bpm || 0,
    key: row.musicalKey || "",
    mood: row.mood || "",
    price: row.basicPrice || 0,
    cover: row.cover || "",
    audioUrl: row.previewMp3 || "",
    description: row.description || "",
    visible: row.visible === 0 ? false : true,
    comments: [],
  };
}

// GET : Récupérer tous les beats depuis SQLite
export async function GET() {
  try {
    const beats = BeatRepository.getAll();
    const mapped = beats.map(toFrontendBeat);
    return NextResponse.json(mapped, { status: 200, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Erreur lors de la récupération des beats :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST : Créer un nouveau beat dans SQLite
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = Date.now().toString();

    // IMPORTANT : better-sqlite3 exige que TOUS les paramètres nommés
    // référencés dans la requête INSERT soient présents dans l'objet,
    // même si leur valeur est null. On donne donc une valeur par défaut
    // explicite à chaque colonne de la table "beats".
    const newBeatData = {
      id,
      title: body.title || "Sans titre",
      slug: null,
      producer: body.producer || "HeavieX'O",
      genre: body.genre || body.type || "",
      type: body.type || body.genre || "",
      bpm: Number(body.bpm) || 0,
      musicalKey: body.musicalKey || body.key || "",
      mood: body.mood || "",
      duration: body.duration || null,
      description: body.description || "",
      tags: body.tags || null,
      cover: body.cover || "",
      previewMp3: body.previewMp3 || body.audioUrl || "",
      wavFile: body.wavFile || null,
      stemsFile: body.stemsFile || null,
      trackoutFile: body.trackoutFile || null,
      waveform: body.waveform || null,
      basicPrice: Number(body.basicPrice ?? body.price) || 0,
      wavPrice: body.wavPrice !== undefined ? Number(body.wavPrice) : null,
      stemsPrice: body.stemsPrice !== undefined ? Number(body.stemsPrice) : null,
      exclusivePrice: body.exclusivePrice !== undefined ? Number(body.exclusivePrice) : null,
      visible: 1,
      featured: 0,
      exclusive: 0,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
    };

    BeatRepository.create(newBeatData as any);

    // BeatRepository.create() ne renvoie rien : on relit la ligne fraîchement créée
    const created = BeatRepository.getById(id);
    if (!created) {
      return NextResponse.json({ error: "Beat créé mais introuvable après insertion" }, { status: 500 });
    }

    return NextResponse.json(toFrontendBeat(created), { status: 201, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Erreur lors de la création du beat :", error);
    return NextResponse.json({ error: "Erreur serveur", details: String(error) }, { status: 500 });
  }
}