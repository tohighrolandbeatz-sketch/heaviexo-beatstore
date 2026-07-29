import { NextResponse } from "next/server";
import { KitRepository } from "@/lib/repositories/kitRepository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

function toFrontendKit(row: any) {
  return {
    id: row.id,
    title: row.title,
    category: row.category || "Drum Kit",
    price: row.price || 0,
    cover: row.cover || "",
    fileUrl: row.fileUrl || "",
    itemCount: row.itemCount || "",
    fileSize: row.fileSize || "",
    description: row.description || "",
    visible: row.visible === 0 ? false : true,
  };
}

// GET : Récupérer un kit précis
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const kit = KitRepository.getById(id);
    if (!kit) return NextResponse.json({ error: "Kit introuvable" }, { status: 404 });
    return NextResponse.json(toFrontendKit(kit), { status: 200, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Erreur lors de la récupération du kit :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE : Supprimer un kit par son ID dans SQLite
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    if (!KitRepository.exists(id)) {
      return NextResponse.json({ error: "Kit introuvable" }, { status: 404 });
    }

    KitRepository.delete(id);

    return NextResponse.json(
      { success: true, message: "Kit supprimé avec succès" },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du kit :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH : Mise à jour partielle (visibilité, etc.)
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    if (!KitRepository.exists(id)) {
      return NextResponse.json({ error: "Kit introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const updates: Record<string, any> = {};

    if (body.visible !== undefined) updates.visible = body.visible ? 1 : 0;
    if (body.title !== undefined) updates.title = body.title;
    if (body.category !== undefined) updates.category = body.category;
    if (body.price !== undefined) updates.price = Number(body.price);
    if (body.cover !== undefined) updates.cover = body.cover;
    if (body.fileUrl !== undefined) updates.fileUrl = body.fileUrl;
    if (body.itemCount !== undefined) updates.itemCount = body.itemCount;
    if (body.fileSize !== undefined) updates.fileSize = body.fileSize;
    if (body.description !== undefined) updates.description = body.description;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Aucune donnée à mettre à jour" }, { status: 400 });
    }

    KitRepository.update(id, updates);
    const updated = KitRepository.getById(id);
    if (!updated) return NextResponse.json({ error: "Kit introuvable après mise à jour" }, { status: 404 });

    return NextResponse.json(toFrontendKit(updated), { status: 200, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du kit :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}