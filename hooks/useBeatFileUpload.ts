'use client';

import { upload } from '@vercel/blob/client';
import { useState } from 'react';

type FileKind = 'cover' | 'preview' | 'master' | 'stems';

// Noms fixes attendus par le schéma, sauf stems qui garde l'extension d'origine
function buildFileName(kind: FileKind, originalName: string): string {
  switch (kind) {
    case 'cover':
      return 'cover.webp';
    case 'preview':
      return 'preview.mp3';
    case 'master':
      return 'master.wav';
    case 'stems': {
      const ext = originalName.split('.').pop() || 'zip';
      return `stems.${ext}`;
    }
  }
}

export function useBeatFileUpload(beatId: string) {
  const [progress, setProgress] = useState<Record<FileKind, number>>({
    cover: 0,
    preview: 0,
    master: 0,
    stems: 0,
  });

  async function uploadBeatFile(file: File, kind: FileKind): Promise<string> {
    const fileName = buildFileName(kind, file.name);
    const pathname = `beats/${beatId}/${fileName}`;

    const blob = await upload(pathname, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
      clientPayload: JSON.stringify({ beatId, kind }),
      onUploadProgress: ({ percentage }) => {
        setProgress((p) => ({ ...p, [kind]: percentage }));
      },
    });

    return blob.url;
  }

  return { uploadBeatFile, progress };
}