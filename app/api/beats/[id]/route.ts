import { NextResponse } from "next/server";
import { BeatRepository } from "@/lib/repositories/BeatRepository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

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

function buildUpdatesFromBody(body: any): Record<string, any> {
  const updates: Record<string, any> = {};

  if (body.visible !== undefined) updates.visible = body.visible ? 1 : 0;
  if (body.title !== undefined) updates.title = body.title;
  if (body.type !== undefined) {
    updates.genre = body.type;
    updates.type = body.type;
  }
  if (body.genre !== undefined) {
    updates.genre = body.genre;
    updates.type = body.genre;
  }
  if (body.bpm !== undefined) updates.bpm = Number(body.bpm);
  if (body.key !== undefined) updates.musicalKey = body.key;
  if (body.musicalKey !== undefined) updates.musicalKey = body.musicalKey;
  if (body.mood !== undefined) updates.mood = body.mood;
  if (body.price !== undefined) updates.basicPrice = Number(body.price);
  if (body.basicPrice !== undefined) updates.basicPrice = Number(body.basicPrice);
  if (body.cover !== undefined) updates.cover = body.cover;
  if (body.audioUrl !== undefined) updates.previewMp3 = body.audioUrl;
  if (body.previewMp3 !== undefined) updates.previewMp3 = body.previewMp3;

  return updates;
}

// DELETE : Supprimer un beat par son ID dans SQLite
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    if (!BeatRepository.exists(id)) {
      return NextResponse.json({ error: "Beat introuvable" }, { status: 404 });
    }

    BeatRepository.delete(id);

    return NextResponse.json(
      { success: true, message: "Beat supprimé avec succès" },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH : Mise à jour partielle (ex: visibilité seule)
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    if (!BeatRepository.exists(id)) {
      return NextResponse.json({ error: "Beat introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const updates = buildUpdatesFromBody(body);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Aucune donnée à mettre à jour" }, { status: 400 });
    }

    BeatRepository.update(id, updates);
    const updated = BeatRepository.getById(id);
    if (!updated) return NextResponse.json({ error: "Beat introuvable après mise à jour" }, { status: 404 });

    return NextResponse.json(toFrontendBeat(updated), { status: 200, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Erreur lors de la mise à jour (PATCH) :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT : Mise à jour complète (utilisée par le formulaire d'édition de l'admin)
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    if (!BeatRepository.exists(id)) {
      return NextResponse.json({ error: "Beat introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const updates = buildUpdatesFromBody(body);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Aucune donnée à mettre à jour" }, { status: 400 });
    }

    BeatRepository.update(id, updates);
    const updated = BeatRepository.getById(id);
    if (!updated) return NextResponse.json({ error: "Beat introuvable après mise à jour" }, { status: 404 });

    return NextResponse.json(toFrontendBeat(updated), { status: 200, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Erreur lors de la mise à jour (PUT) :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}