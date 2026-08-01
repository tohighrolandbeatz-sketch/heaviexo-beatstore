import { db } from '@/lib/db';
import { beats } from '@/app/config/schema';
import { eq } from 'drizzle-orm';

export const uploadRepository = {
  async updateBeatFiles(
    id: string,
    filesData: { cover_url?: string; preview_url?: string; master_url?: string; stems_url?: string }
  ): Promise<void> {
    try {
      const updateValues: Record<string, any> = {
        updatedAt: new Date(),
      };

      if (filesData.cover_url !== undefined) {
        updateValues.coverUrl = filesData.cover_url;
      }
      if (filesData.preview_url !== undefined) {
        updateValues.previewUrl = filesData.preview_url;
      }
      if (filesData.master_url !== undefined) {
        updateValues.masterUrl = filesData.master_url;
      }
      if (filesData.stems_url !== undefined) {
        updateValues.stemsUrl = filesData.stems_url;
      }

      if (Object.keys(updateValues).length <= 1) return;

      await db
        .update(beats)
        .set(updateValues)
        .where(eq(beats.id, id));
    } catch (error) {
      console.error(`Erreur UploadRepository:`, error);
      throw new Error(`Échec mise à jour fichiers beat ${id}.`);
    }
  }
};
