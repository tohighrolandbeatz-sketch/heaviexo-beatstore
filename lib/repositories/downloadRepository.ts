import db from '@/lib/db';

export interface Download {
  id: string;
  user_id?: string;
  beat_id: string;
  sale_id?: string;
  ip_address?: string;
  created_at: string;
  updated_at: string;
}

export const downloadRepository = {
  findByUserId(userId: string): Download[] {
    return db.prepare('SELECT * FROM downloads WHERE user_id = ? ORDER BY created_at DESC').all() as Download[];
  },

  create(download: Omit<Download, 'created_at' | 'updated_at'>): Download {
    const now = new Date().toISOString();
    const newDownload: Download = {
      ...download,
      created_at: now,
      updated_at: now,
    };

    db.prepare(`
      INSERT INTO downloads (id, user_id, beat_id, sale_id, ip_address, created_at, updated_at)
      VALUES (@id, @user_id, @beat_id, @sale_id, @ip_address, @created_at, @updated_at)
    `).run(newDownload);

    return newDownload;
  }
};