import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            'image/*',
            'audio/mpeg',
            'audio/wav',
            'audio/x-wav',
            'application/zip',
            'application/x-zip-compressed',
            'application/x-rar-compressed',
          ],
          addRandomSuffix: false,
          maximumSizeInBytes: 2 * 1024 * 1024 * 1024, // 2 Go max par fichier
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload terminé:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Erreur upload Blob:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}