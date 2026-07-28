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

    const sizeLimit = 100 * 1024 * 1024; // 100 Mo
    if (file.size > sizeLimit) {
      return NextResponse.json(
        { success: false, error: 'Fichier trop volumineux (max 100 Mo)' },
        { status: 400 }
      );
    }

    // Utiliser l'URL d'upload client Vercel Blob
    const response = await fetch(
      `https://blob.vercel-storage.com/upload?filename=${encodeURIComponent(file.name)}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
          'Content-Type': file.type,
          'Content-Length': file.size.toString(),
        },
        body: file,
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur Blob: ${response.status}`);
    }

    const blob = await response.json();
    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    console.error('Erreur upload:', err);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}