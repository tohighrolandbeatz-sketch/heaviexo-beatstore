import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const form = await request.formData();
    const file = form.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json(
      { success: true, url: blob.url },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    console.error('Erreur lors de l\'upload :', err);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de l\'upload' },
      { status: 500 }
    );
  }
}