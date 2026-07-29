import { NextRequest, NextResponse } from 'next/server';
import { beatRepository } from '@/lib/repositories/beatRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const beat = await beatRepository.findById(id);

    if (!beat) {
      return NextResponse.json({ error: 'Beat introuvable' }, { status: 404 });
    }

    const fileUrl = beat.master_url;
    if (!fileUrl) {
      return NextResponse.json({ error: 'Fichier non disponible pour le téléchargement' }, { status: 404 });
    }

    return NextResponse.redirect(fileUrl);

  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
