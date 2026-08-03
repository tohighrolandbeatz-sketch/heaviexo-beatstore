import { NextRequest, NextResponse } from 'next/server';
import { verifyDownloadToken } from '@/lib/downloadToken';
import { saleRepository } from '@/lib/repositories/saleRepository';
import { beatRepository } from '@/lib/repositories/beatRepository';

function buildFileName(beat: any, fileUrl: string): string {
  const sanitize = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

  const parts = [
    sanitize(beat.title || 'Beat'),
    beat.musical_key ? sanitize(beat.musical_key) : '',
    beat.bpm ? `${beat.bpm}BPM` : '',
  ].filter(Boolean);

  const ext = fileUrl.split('.').pop()?.split('?')[0] || 'mp3';
  return `${parts.join('_')}.${ext}`;
}

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

  const fileResponse = await fetch(fileUrl);
  if (!fileResponse.ok || !fileResponse.body) {
    return NextResponse.json({ error: 'Erreur lors de la récupération du fichier.' }, { status: 502 });
  }

  const fileName = buildFileName(beat, fileUrl);

  return new NextResponse(fileResponse.body, {
    headers: {
      'Content-Type': fileResponse.headers.get('content-type') || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  });
}