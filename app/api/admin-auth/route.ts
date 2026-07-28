import { NextResponse } from 'next/server';

// Stockage sécurisé en mémoire du code actif
let currentAdminCode = "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, code } = body;

    // Action 1 : Générer et envoyer le code
    if (action === "send") {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      currentAdminCode = generatedCode;

      console.log(`========================================`);
      console.log(`[🔐 SÉCURITÉ ADMIN] Code généré : ${generatedCode}`);
      console.log(`[📧 DESTINATAIRE] prodbyheaviexo@gmail.com`);
      console.log(`========================================`);

      return NextResponse.json({ success: true, message: "Code généré avec succès." });
    }

    // Action 2 : Vérifier le code saisi
    if (action === "verify") {
      if (code && code === currentAdminCode) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ success: false, error: "Code incorrect" }, { status: 400 });
    }

    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}