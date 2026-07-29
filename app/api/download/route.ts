import { NextRequest, NextResponse } from 'next/server';
import { beatRepository } from '@/lib/repositories/beatRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Récupérer le beat depuis la base de données
    const beat = await beatRepository.findById(id);

    if (!beat) {
      return NextResponse.json({ error: 'Beat introuvable' }, { status: 404 });
    }

    // 2. Vérifier si l'URL du master WAV existe
    const fileUrl = beat.master_url;
    if (!fileUrl) {
      return NextResponse.json({ error: 'Fichier non disponible pour le téléchargement' }, { status: 404 });
    }

    // 3. Redirection sécurisée vers l'URL Vercel Blob
    return NextResponse.redirect(fileUrl);

  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}