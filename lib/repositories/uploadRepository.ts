import { db } from '@/lib/db';

export const uploadRepository = {
  updateBeatFiles(
    id: string, 
    filesData: { cover?: string; previewMp3?: string; masterWav?: string; stemsZip?: string }
  ): void {
    try {
      const fields = [];
      const values: any = { id };

      if (filesData.cover !== undefined) {
        fields.push('cover = @cover');
        values.cover = filesData.cover;
      }
      if (filesData.previewMp3 !== undefined) {
        fields.push('previewMp3 = @previewMp3');
        values.previewMp3 = filesData.previewMp3;
      }
      if (filesData.masterWav !== undefined) {
        fields.push('masterWav = @masterWav');
        values.masterWav = filesData.masterWav;
      }
      if (filesData.stemsZip !== undefined) {
        fields.push('stemsZip = @stemsZip');
        values.stemsZip = filesData.stemsZip;
      }

      if (fields.length === 0) return;

      const query = `UPDATE beats SET ${fields.join(', ')} WHERE id = @id`;
      db.prepare(query).run(values);
    } catch (error) {
      console.error(`Erreur UploadRepository lors de la mise à jour des fichiers du beat ${id}:`, error);
      throw new Error(`Échec de la mise en base de données des fichiers pour le beat ${id}.`);
    }
  }
};