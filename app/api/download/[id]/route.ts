import { NextResponse } from 'next/server';

// ⚠️ Cette route est désactivée : elle permettait de télécharger le fichier master
// de n'importe quel beat sans aucune vérification d'achat.
// Utilisez désormais /api/download?token=... (voir lib/downloadToken.ts).
export async function GET() {
  return NextResponse.json(
    { error: 'Cette route a été désactivée pour des raisons de sécurité.' },
    { status: 410 }
  );
}