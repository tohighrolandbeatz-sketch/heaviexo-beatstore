import { NextRequest, NextResponse } from 'next/server';
import { verifyDownloadToken } from '@/lib/downloadToken';
import { saleRepository } from '@/lib/repositories/saleRepository';
import { beatRepository } from '@/lib/repositories/beatRepository';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Lien de téléchargement invalide.' }, { status: 400 });
  }

  const payload = verifyDownloadToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: 'Ce lien est invalide ou a expiré. Contactez-nous pour en recevoir un nouveau.' },
      { status: 403 }
    );
  }

  const sale = await saleRepository.findById(payload.saleId);
  if (!sale || sale.status !== 'CONFIRMED' || sale.beat_id !== payload.beatId) {
    return NextResponse.json({ error: 'Achat introuvable ou non confirmé.' }, { status: 403 });
  }

  const beat = await beatRepository.findById(payload.beatId);
  if (!beat) {
    return NextResponse.json({ error: 'Beat introuvable.' }, { status: 404 });
  }

  const fileUrl =
    payload.fileType === 'master' ? beat.master_url :
    payload.fileType === 'stems' ? beat.stems_url :
    beat.preview_url;

  if (!fileUrl) {
    return NextResponse.json({ error: 'Fichier non disponible pour le moment.' }, { status: 404 });
  }

  return NextResponse.redirect(fileUrl);
}