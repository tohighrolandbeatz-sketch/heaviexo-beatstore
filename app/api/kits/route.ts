import { NextResponse } from "next/server";
import { KitRepository } from "@/lib/repositories/kitRepository";

// Empêche Next.js de mettre en cache la route GET
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const kits = KitRepository.getAll();
    return NextResponse.json(kits, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des kits :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}