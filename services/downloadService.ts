import { db } from '@/lib/db';
import { beats, sales, licenses } from '@/app/config/schema';
import { eq, and } from 'drizzle-orm';

export interface DownloadPermissionResult {
  allowed: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
}

class DownloadService {
  async getSecureDownloadLink(userId: string, beatId: string, requestedType: 'master' | 'stems' | 'preview'): Promise<DownloadPermissionResult> {
    try {
      // 1. Préécoutes accessibles publiquement
      if (requestedType === 'preview') {
        const result = await db.select({ previewUrl: beats.previewUrl, title: beats.title })
          .from(beats)
          .where(eq(beats.id, beatId))
          .limit(1);
        const beat = result[0];
        if (!beat || !beat.previewUrl) {
          return { allowed: false, error: 'Preview introuvable.' };
        }
        return { allowed: true, filePath: beat.previewUrl, fileName: `${beat.title}_Preview.mp3` };
      }

      // 2. Vérification achat pour master/stems
      const purchaseResult = await db.select({ licenseName: licenses.name })
        .from(sales)
        .innerJoin(licenses, eq(sales.licenseId, licenses.id))
        .where(and(eq(sales.userId, userId), eq(sales.beatId, beatId)))
        .limit(1);
      const purchase = purchaseResult[0];

      if (!purchase) {
        return { 
          allowed: false, 
          error: 'Accès refusé : Aucun achat actif trouvé pour ce master.' 
        };
      }

      // 3. Récupération des fichiers
      const beatResult = await db.select({
          title: beats.title,
          masterUrl: beats.masterUrl,
          stemsUrl: beats.stemsUrl,
        })
        .from(beats)
        .where(eq(beats.id, beatId))
        .limit(1);
      const beatFiles = beatResult[0];

      if (!beatFiles) {
        return { allowed: false, error: 'Instrumental introuvable.' };
      }

      if (requestedType === 'master') {
        if (!beatFiles.masterUrl) return { allowed: false, error: 'Fichier master.wav non disponible.' };
        return { allowed: true, filePath: beatFiles.masterUrl, fileName: `${beatFiles.title}_Master.wav` };
      }

      if (requestedType === 'stems') {
        if (purchase.licenseName === 'Basic') {
          return { allowed: false, error: 'Votre licence Basic n\'inclut pas le téléchargement des Stems.' };
        }
        if (!beatFiles.stemsUrl) return { allowed: false, error: 'Fichiers stems.zip non disponibles.' };
        return { allowed: true, filePath: beatFiles.stemsUrl, fileName: `${beatFiles.title}_Stems.zip` };
      }

      return { allowed: false, error: 'Type de fichier demandé invalide.' };
    } catch (error) {
      console.error('Erreur dans DownloadService:', error);
      return { allowed: false, error: 'Erreur interne du serveur.' };
    }
  }
}

export const downloadService = new DownloadService();