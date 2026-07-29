import { blobService } from './blobService';

export interface BeatFiles {
  cover?: File;
  preview?: File;
  wav?: File;
  stems?: File;
}

export const uploadService = {
  async processBeatUpload(slug: string, files: BeatFiles): Promise<Record<string, string>> {
    const uploadedUrls: Record<string, string> = {};

    try {
      if (files.cover) {
        uploadedUrls.cover = await blobService.uploadFile(files.cover, slug, 'cover.webp');
      }

      if (files.preview) {
        uploadedUrls.previewMp3 = await blobService.uploadFile(files.preview, slug, 'preview.mp3');
      }

      if (files.wav) {
        uploadedUrls.masterWav = await blobService.uploadFile(files.wav, slug, 'master.wav');
      }

      if (files.stems) {
        const ext = files.stems.name.split('.').pop() || 'zip';
        uploadedUrls.stemsZip = await blobService.uploadFile(files.stems, slug, `stems.${ext}`);
      }

      return uploadedUrls;
    } catch (error) {
      console.error(`Erreur UploadService pour le beat ${slug}:`, error);
      throw new Error(`Échec du traitement des fichiers pour le beat ${slug}.`);
    }
  }
};