import { NextResponse } from "next/server";
import { LicenseRepository } from "@/lib/repositories/LicenseRepository";

// Empêche Next.js de mettre en cache la route GET
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const licenses = LicenseRepository.getAll();
    return NextResponse.json(licenses, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des licences :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}