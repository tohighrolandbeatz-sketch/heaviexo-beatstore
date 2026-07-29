import { db } from '@/lib/db';
import { downloads } from '@/app/config/schema';
import { eq, desc } from 'drizzle-orm';

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
  async findByUserId(userId: string): Promise<Download[]> {
    const result = await db.select().from(downloads).where(eq(downloads.userId, userId)).orderBy(desc(downloads.createdAt));
    return result.map((row) => ({
      id: row.id,
      user_id: row.userId ?? undefined,
      beat_id: row.beatId,
      sale_id: row.saleId ?? undefined,
      ip_address: row.ipAddress ?? undefined,
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
    }));
  },

  async create(download: Omit<Download, 'created_at' | 'updated_at'>): Promise<Download> {
    const now = new Date();
    const newDownload: Download = {
      ...download,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    await db.insert(downloads).values({
      id: download.id,
      userId: download.user_id ?? null,
      beatId: download.beat_id,
      saleId: download.sale_id ?? null,
      ipAddress: download.ip_address ?? null,
      createdAt: now,
      updatedAt: now,
    });

    return newDownload;
  }
};