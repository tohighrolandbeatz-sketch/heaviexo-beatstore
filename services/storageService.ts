import { put } from '@vercel/blob';

export const storageService = {
  async uploadBeatFile(
    file: File, 
    beatId: string, 
    fileType: 'cover' | 'preview' | 'wav' | 'stems'
  ): Promise<string> {
    const extension = file.name.split('.').pop() || 'bin';
    let fileName = 'file';

    if (fileType === 'cover') fileName = 'cover.webp';
    else if (fileType === 'preview') fileName = 'preview.mp3';
    else if (fileType === 'wav') fileName = 'master.wav';
    else if (fileType === 'stems') fileName = `stems.${extension}`;

    // Structure propre par dossier : beats/b_0001/cover.webp
    const blobPath = `beats/${beatId}/${fileName}`;

    const blob = await put(blobPath, file, {
      access: 'public',
      addRandomSuffix: false, // Garde le nom exact pour éviter les doublons
    });

    return blob.url;
  }
};