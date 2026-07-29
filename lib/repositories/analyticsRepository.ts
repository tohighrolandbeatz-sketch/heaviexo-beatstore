import { db } from '@/lib/db';
import { analytics } from '@/app/config/schema';
import { eq, desc, sql } from 'drizzle-orm';

export interface Analytics {
  id: string;
  beatId: string;
  eventType: string;
  playsCount: number;
  cartAdds: number;
  createdAt: string;
  updatedAt: string;
}

export class AnalyticsRepository {
  static async getAll(): Promise<Analytics[]> {
    const result = await db.select().from(analytics).orderBy(desc(analytics.createdAt));
    return result.map((row) => ({
      id: row.id,
      beatId: row.beatId,
      eventType: row.eventType,
      playsCount: row.playsCount ?? 0,
      cartAdds: row.cartAdds ?? 0,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  static async getById(id: string): Promise<Analytics | null> {
    const result = await db.select().from(analytics).where(eq(analytics.id, id)).limit(1);
    if (!result[0]) return null;
    const row = result[0];
    return {
      id: row.id,
      beatId: row.beatId,
      eventType: row.eventType,
      playsCount: row.playsCount ?? 0,
      cartAdds: row.cartAdds ?? 0,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  static async getByBeatId(beatId: string): Promise<Analytics[]> {
    const result = await db.select().from(analytics).where(eq(analytics.beatId, beatId));
    return result.map((row) => ({
      id: row.id,
      beatId: row.beatId,
      eventType: row.eventType,
      playsCount: row.playsCount ?? 0,
      cartAdds: row.cartAdds ?? 0,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  static async create(data: Omit<Analytics, 'createdAt' | 'updatedAt'>): Promise<boolean> {
    try {
      const now = new Date();
      await db.insert(analytics).values({
        id: data.id,
        beatId: data.beatId,
        eventType: data.eventType,
        playsCount: data.playsCount ?? 0,
        cartAdds: data.cartAdds ?? 0,
        createdAt: now,
        updatedAt: now,
      });
      return true;
    } catch {
      return false;
    }
  }

  static async update(id: string, data: Partial<Analytics>): Promise<boolean> {
    try {
      await db
        .update(analytics)
        .set({
          ...(data.eventType !== undefined && { eventType: data.eventType }),
          ...(data.playsCount !== undefined && { playsCount: data.playsCount }),
          ...(data.cartAdds !== undefined && { cartAdds: data.cartAdds }),
          updatedAt: new Date(),
        })
        .where(eq(analytics.id, id));
      return true;
    } catch {
      return false;
    }
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(analytics).where(eq(analytics.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}