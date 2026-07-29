import db from '@/lib/db';

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
  async findAll(): Sale[] {
    return await db.prepare('SELECT * FROM sales ORDER BY created_at DESC').all() as Sale[];
  },

  async findById(id: string): Sale | null {
    const row = await db.prepare('SELECT * FROM sales WHERE id = ?').get(id) as Sale;
    return row || null;
  },

  findByUserId(userId: string): Sale[] {
    return await db.prepare('SELECT * FROM sales WHERE user_id = ? ORDER BY created_at DESC').all() as Sale[];
  },

  create(sale: Omit<Sale, 'created_at' | 'updated_at'>): Sale {
    const now = new Date().toISOString();
    const newSale: Sale = {
      ...sale,
      created_at: now,
      updated_at: now,
    };

    db.prepare(`
      INSERT INTO sales (id, user_id, beat_id, license_id, amount, stripe_session_id, status, created_at, updated_at)
      VALUES (@id, @user_id, @beat_id, @license_id, @amount, @stripe_session_id, @status, @created_at, @updated_at)
    `).run(newSale);

    return newSale;
  },

  updateStatus(id: string, status: string): void {
    const updatedAt = new Date().toISOString();
    db.prepare('UPDATE sales SET status = ?, updated_at = ? WHERE id = ?').run(status, updatedAt, id);
  },

  delete(id: string): void {
    db.prepare('DELETE FROM sales WHERE id = ?').run(id);
  }
};