import { db } from '@/lib/db';
import { sales } from '@/app/config/schema';
import { eq, desc } from 'drizzle-orm';

export interface Sale {
  id: string;
  user_id?: string;
  beat_id: string;
  license_id: string;
  amount: number;
  stripe_session_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const saleRepository = {
  async findAll(): Promise<Sale[]> {
    const result = await db.select().from(sales).orderBy(desc(sales.createdAt));
    return result.map((row) => ({
      id: row.id,
      user_id: row.userId ?? undefined,
      beat_id: row.beatId,
      license_id: row.licenseId,
      amount: row.amount,
      stripe_session_id: row.stripeSessionId ?? undefined,
      status: row.status ?? 'PENDING',
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
    }));
  },

  async findById(id: string): Promise<Sale | null> {
    const result = await db.select().from(sales).where(eq(sales.id, id)).limit(1);
    if (!result[0]) return null;
    const row = result[0];
    return {
      id: row.id,
      user_id: row.userId ?? undefined,
      beat_id: row.beatId,
      license_id: row.licenseId,
      amount: row.amount,
      stripe_session_id: row.stripeSessionId ?? undefined,
      status: row.status ?? 'PENDING',
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
    };
  },

  async findByUserId(userId: string): Promise<Sale[]> {
    const result = await db.select().from(sales).where(eq(sales.userId, userId)).orderBy(desc(sales.createdAt));
    return result.map((row) => ({
      id: row.id,
      user_id: row.userId ?? undefined,
      beat_id: row.beatId,
      license_id: row.licenseId,
      amount: row.amount,
      stripe_session_id: row.stripeSessionId ?? undefined,
      status: row.status ?? 'PENDING',
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
    }));
  },

  async create(sale: Omit<Sale, 'created_at' | 'updated_at'>): Promise<Sale> {
    const now = new Date();
    const newSale: Sale = {
      ...sale,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    await db.insert(sales).values({
      id: sale.id,
      userId: sale.user_id ?? null,
      beatId: sale.beat_id,
      licenseId: sale.license_id,
      amount: sale.amount,
      stripeSessionId: sale.stripe_session_id ?? null,
      status: sale.status ?? 'PENDING',
      createdAt: now,
      updatedAt: now,
    });

    return newSale;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const now = new Date();
    await db
      .update(sales)
      .set({
        status,
        updatedAt: now,
      })
      .where(eq(sales.id, id));
  },

  async delete(id: string): Promise<void> {
    await db.delete(sales).where(eq(sales.id, id));
  }
};