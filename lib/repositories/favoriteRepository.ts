import { db } from '@/lib/db';
import { favorites } from '@/app/config/schema';
import { eq, and, desc } from 'drizzle-orm';

export interface Favorite {
  id: string;
  user_id: string;
  beat_id: string;
  created_at: string;
  updated_at: string;
}

export const favoriteRepository = {
  async findByUserId(userId: string): Promise<Favorite[]> {
    const result = await db.select().from(favorites).where(eq(favorites.userId, userId)).orderBy(desc(favorites.createdAt));
    return result.map((row) => ({
      id: row.id,
      user_id: row.userId,
      beat_id: row.beatId,
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
    }));
  },

  async add(userId: string, beatId: string): Promise<Favorite> {
    const now = new Date();
    const id = `fav_${Date.now()}`;
    
    // On utilise onConflictDoNothing pour simuler l'INSERT OR IGNORE de SQLite
    await db.insert(favorites).values({
      id,
      userId,
      beatId,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();

    return { 
      id, 
      user_id: userId, 
      beat_id: beatId, 
      created_at: now.toISOString(), 
      updated_at: now.toISOString() 
    };
  },

  async remove(userId: string, beatId: string): Promise<void> {
    await db.delete(favorites).where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.beatId, beatId)
      )
    );
  }
};