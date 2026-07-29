import { put } from '@vercel/blob';

export const blobService = {
  async uploadFile(file: File, folderName: string, fileName: string): Promise<string> {
    try {
      const blobPath = `beats/${folderName}/${fileName}`;
      
      const blob = await put(blobPath, file, {
        access: 'public',
        addRandomSuffix: false, // Conserve le nom exact (ex: cover.webp, preview.mp3)
      });

      return blob.url;
    } catch (error) {
      console.error(`Erreur BlobService lors de l'upload de ${fileName} pour ${folderName}:`, error);
      throw new Error(`Échec de l'upload du fichier ${fileName} vers Vercel Blob.`);
    }
  }
};