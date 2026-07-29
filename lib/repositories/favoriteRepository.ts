import db from '@/lib/db';

export interface Favorite {
  id: string;
  user_id: string;
  beat_id: string;
  created_at: string;
  updated_at: string;
}

export const favoriteRepository = {
  findByUserId(userId: string): Favorite[] {
    return await db.prepare('SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC').all() as Favorite[];
  },

  add(userId: string, beatId: string): Favorite {
    const now = new Date().toISOString();
    const id = `fav_${Date.now()}`;
    
    // Évite les doublons grâce à la contrainte UNIQUE, ou ignore si déjà présent
    db.prepare(`
      INSERT OR IGNORE INTO favorites (id, user_id, beat_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, userId, beatId, now, now);

    return { id, user_id: userId, beat_id: beatId, created_at: now, updated_at: now };
  },

  remove(userId: string, beatId: string): void {
    db.prepare('DELETE FROM favorites WHERE user_id = ? AND beat_id = ?').run(userId, beatId);
  }
};