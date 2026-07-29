import db from '@/lib/db';

export interface Analytics {
  id: string;
  beat_id: string;
  plays_count: number;
  cart_adds: number;
  created_at: string;
  updated_at: string;
}

export const analyticsRepository = {
  async findByBeatId(beatId: string): Promise<Analytics | null> {
    const row = await db.prepare('SELECT * FROM analytics WHERE beat_id = ?').get(beatId);
    return (row as Analytics | undefined) ?? null;
  },

  async incrementPlay(beatId: string): Promise<void> {
    const now = new Date().toISOString();
    const existing = await analyticsRepository.findByBeatId(beatId);

    if (existing) {
      await db
        .prepare('UPDATE analytics SET plays_count = plays_count + 1, updated_at = ? WHERE beat_id = ?')
        .run(now, beatId);
    } else {
      await db.prepare(`
        INSERT INTO analytics (id, beat_id, plays_count, cart_adds, created_at, updated_at)
        VALUES (?, ?, 1, 0, ?, ?)
      `).run(`ana_${Date.now()}`, beatId, now, now);
    }
  },

  async incrementCartAdd(beatId: string): Promise<void> {
    const now = new Date().toISOString();
    const existing = await analyticsRepository.findByBeatId(beatId);

    if (existing) {
      await db
        .prepare('UPDATE analytics SET cart_adds = cart_adds + 1, updated_at = ? WHERE beat_id = ?')
        .run(now, beatId);
    } else {
      await db.prepare(`
        INSERT INTO analytics (id, beat_id, plays_count, cart_adds, created_at, updated_at)
        VALUES (?, ?, 0, 1, ?, ?)
      `).run(`ana_${Date.now()}`, beatId, now, now);
    }
  },
};