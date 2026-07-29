import { db } from '@/lib/db';
import { beats } from '@/app/config/schema';
import { eq } from 'drizzle-orm';

export const uploadRepository = {
  async updateBeatFiles(
    id: string, 
    filesData: { cover?: string; previewMp3?: string; masterWav?: string; stemsZip?: string }
  ): Promise<void> {
    try {
      const updateValues: Record<string, any> = {
        updatedAt: new Date(),
      };

      if (filesData.cover !== undefined) {
        updateValues.coverUrl = filesData.cover;
      }
      if (filesData.previewMp3 !== undefined) {
        updateValues.previewUrl = filesData.previewMp3;
      }
      if (filesData.masterWav !== undefined) {
        updateValues.masterUrl = filesData.masterWav;
      }
      if (filesData.stemsZip !== undefined) {
        updateValues.stemsUrl = filesData.stemsZip;
      }

      if (Object.keys(updateValues).length <= 1) return;

      await db
        .update(beats)
        .set(updateValues)
        .where(eq(beats.id, id));
    } catch (error) {
      console.error(`Erreur UploadRepository lors de la mise à jour des fichiers du beat ${id}:`, error);
      throw new Error(`Échec de la mise en base de données des fichiers pour le beat ${id}.`);
    }
  }
};