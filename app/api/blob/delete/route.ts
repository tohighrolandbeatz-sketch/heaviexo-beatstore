import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL manquante' }, { status: 400 });
    }
    await del(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression Blob:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du fichier' }, { status: 500 });
  }
}