import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export interface DownloadPermissionResult {
  allowed: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
}

class DownloadService {
  /**
   * Vérifie les droits d'un utilisateur sur un beat selon sa licence et autorise ou bloque l'accès au fichier (Master / Stems).
   */
  async getSecureDownloadLink(userId: string, beatId: string, requestedType: 'master' | 'stems' | 'preview'): Promise<DownloadPermissionResult> {
    try {
      // 1. Les préécoutes (preview.mp3) sont toujours accessibles publiquement
      if (requestedType === 'preview') {
        const beat = db.prepare('SELECT preview_url, title FROM beats WHERE id = ?').get(beatId) as { preview_url: string; title: string } | undefined;
        if (!beat || !beat.preview_url) {
          return { allowed: false, error: 'Preview introuvable.' };
        }
        return { allowed: true, filePath: beat.preview_url, fileName: `${beat.title}_Preview.mp3` };
      }

      // 2. Pour le Master (.wav) ou les Stems (.zip), vérification stricte de l'achat en base de données
      const purchase = db.prepare(`
        Tabel ventes ou commandes (à adapter selon ta table purchases/orders)
        SELECT p.*, l.name as license_name 
        FROM purchases p 
        JOIN licenses l ON p.license_id = l.id 
        WHERE p.user_id = ? AND p.beat_id = ?
      `).get(userId, beatId) as { license_name: string } | undefined;

      // Si l'utilisateur n'a pas acheté le beat, l'accès au master/stems est strictement interdit
      if (!purchase) {
        return { 
          allowed: false, 
          error: 'Accès refusé : Aucun achat actif trouvé pour ce master. Les utilisateurs gratuits ne peuvent pas télécharger les fichiers haute qualité.' 
        };
      }

      // 3. Récupération des chemins des fichiers associés au beat
      const beatFiles = db.prepare('SELECT title, master_url, stems_url FROM beats WHERE id = ?').get(beatId) as {
        title: string;
        master_url?: string;
        stems_url?: string;
      } | undefined;

      if (!beatFiles) {
        return { allowed: false, error: 'Instrumental introuvable dans le catalogue.' };
      }

      if (requestedType === 'master') {
        if (!beatFiles.master_url) return { allowed: false, error: 'Fichier master.wav non disponible pour ce beat.' };
        return { allowed: true, filePath: beatFiles.master_url, fileName: `${beatFiles.title}_Master.wav` };
      }

      if (requestedType === 'stems') {
        // Vérification optionnelle si la licence autorise les stems (ex: Unlimited / Exclusive)
        if (purchase.license_name === 'Basic') {
          return { allowed: false, error: 'Votre licence Basic n\'inclut pas le téléchargement des Stems séparés.' };
        }
        if (!beatFiles.stems_url) return { allowed: false, error: 'Fichiers stems.zip non disponibles pour ce beat.' };
        return { allowed: true, filePath: beatFiles.stems_url, fileName: `${beatFiles.title}_Stems.zip` };
      }

      return { allowed: false, error: 'Type de fichier demandé invalide.' };
    } catch (error) {
      console.error('Erreur dans DownloadService:', error);
      return { allowed: false, error: 'Erreur interne du serveur lors de la vérification des droits.' };
    }
  }
}

export const downloadService = new DownloadService();