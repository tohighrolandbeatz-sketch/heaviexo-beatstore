import { db } from '@/lib/db';

export interface Kit {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  description?: string;
  cover?: string;
  previewMp3?: string;
  fileUrl?: string;
  itemCount?: string;
  fileSize?: string;
  price?: number;
  visible?: number;
  createdAt?: string;
}

export class KitRepository {
  static async getAll(): Promise<Kit[]> {
    const rows = await db.prepare('SELECT * FROM kits ORDER BY createdAt DESC').all();
    return (rows || []) as Kit[];
  }

  static async getVisible(): Promise<Kit[]> {
    const rows = await db.prepare('SELECT * FROM kits WHERE visible = 1 ORDER BY createdAt DESC').all();
    return (rows || []) as Kit[];
  }

  static async getById(id: string): Promise<Kit | null> {
    const row = await db.prepare('SELECT * FROM kits WHERE id = ?').get(id);
    return (row as Kit) || null;
  }

  static async getBySlug(slug: string): Promise<Kit | null> {
    const row = await db.prepare('SELECT * FROM kits WHERE slug = ?').get(slug);
    return (row as Kit) || null;
  }

  static async getByCategory(category: string): Promise<Kit[]> {
    const rows = await db.prepare('SELECT * FROM kits WHERE category = ? AND visible = 1 ORDER BY createdAt DESC').all(category);
    return (rows || []) as Kit[];
  }

  static async search(query: string): Promise<Kit[]> {
    const searchTerm = `%${query}%`;
    const rows = await db.prepare(`
      SELECT * FROM kits
      WHERE title LIKE ? OR slug LIKE ? OR category LIKE ? OR description LIKE ?
      ORDER BY createdAt DESC
    `).all(searchTerm, searchTerm, searchTerm, searchTerm);
    return (rows || []) as Kit[];
  }

  static async getCategories(): Promise<string[]> {
    const rows = await db.prepare('SELECT DISTINCT category FROM kits WHERE category IS NOT NULL ORDER BY category ASC').all();
    return ((rows || []) as { category: string }[]).map(row => row.category);
  }

  static async create(kit: Kit): Promise<boolean> {
    const result = await db.prepare(`
      INSERT INTO kits (id, title, slug, category, description, cover, previewMp3, fileUrl, itemCount, fileSize, price, visible, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      kit.id, kit.title, kit.slug ?? null, kit.category ?? null,
      kit.description ?? null, kit.cover ?? null, kit.previewMp3 ?? null,
      kit.fileUrl ?? null, kit.itemCount ?? null, kit.fileSize ?? null,
      kit.price ?? null, kit.visible ?? 1, kit.createdAt ?? new Date().toISOString()
    );
    return result.changes > 0;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.prepare('DELETE FROM kits WHERE id = ?').run(id);
    return result.changes > 0;
  }
}