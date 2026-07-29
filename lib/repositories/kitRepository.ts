import { db } from '@/lib/db';
import { pgTable, text, integer, real, timestamp } from 'drizzle-orm/pg-core';
import { eq, desc, asc, ilike, or, and, sql } from 'drizzle-orm';

export const kits = pgTable('kits', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique(),
  category: text('category'),
  description: text('description'),
  cover: text('cover'),
  previewMp3: text('preview_mp3'),
  fileUrl: text('file_url'),
  itemCount: text('item_count'),
  fileSize: text('file_size'),
  price: real('price'),
  visible: integer('visible').default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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

function mapKit(kit: typeof kits.$inferSelect): Kit {
  return {
    id: kit.id,
    title: kit.title,
    slug: kit.slug ?? undefined,
    category: kit.category ?? undefined,
    description: kit.description ?? undefined,
    cover: kit.cover ?? undefined,
    previewMp3: kit.previewMp3 ?? undefined,
    fileUrl: kit.fileUrl ?? undefined,
    itemCount: kit.itemCount ?? undefined,
    fileSize: kit.fileSize ?? undefined,
    price: kit.price ?? undefined,
    visible: kit.visible ?? undefined,
    createdAt: kit.createdAt.toISOString(),
  };
}

export class KitRepository {
  static async getAll(): Promise<Kit[]> {
    const result = await db.select().from(kits).orderBy(desc(kits.createdAt));
    return result.map(mapKit);
  }

  static async getVisible(): Promise<Kit[]> {
    const result = await db.select().from(kits).where(eq(kits.visible, 1)).orderBy(desc(kits.createdAt));
    return result.map(mapKit);
  }

  static async getById(id: string): Promise<Kit | null> {
    const result = await db.select().from(kits).where(eq(kits.id, id)).limit(1);
    if (!result[0]) return null;
    return mapKit(result[0]);
  }

  static async getBySlug(slug: string): Promise<Kit | null> {
    const result = await db.select().from(kits).where(eq(kits.slug, slug)).limit(1);
    if (!result[0]) return null;
    return mapKit(result[0]);
  }

  static async getByCategory(category: string): Promise<Kit[]> {
    const result = await db
      .select()
      .from(kits)
      .where(and(eq(kits.category, category), eq(kits.visible, 1)))
      .orderBy(desc(kits.createdAt));
    return result.map(mapKit);
  }

  static async search(query: string): Promise<Kit[]> {
    const searchTerm = `%${query}%`;
    const result = await db
      .select()
      .from(kits)
      .where(
        or(
          ilike(kits.title, searchTerm),
          ilike(kits.slug, searchTerm),
          ilike(kits.category, searchTerm),
          ilike(kits.description, searchTerm)
        )
      )
      .orderBy(desc(kits.createdAt));
    return result.map(mapKit);
  }

  static async getCategories(): Promise<string[]> {
    const result = await db
      .select({ category: kits.category })
      .from(kits)
      .where(sql`${kits.category} IS NOT NULL`)
      .orderBy(asc(kits.category));
    return Array.from(new Set(result.map((row) => row.category).filter((cat): cat is string => cat !== null)));
  }

  static async create(kit: Kit): Promise<boolean> {
    try {
      await db.insert(kits).values({
        id: kit.id,
        title: kit.title,
        slug: kit.slug ?? null,
        category: kit.category ?? null,
        description: kit.description ?? null,
        cover: kit.cover ?? null,
        previewMp3: kit.previewMp3 ?? null,
        fileUrl: kit.fileUrl ?? null,
        itemCount: kit.itemCount ?? null,
        fileSize: kit.fileSize ?? null,
        price: kit.price ?? null,
        visible: kit.visible ?? 1,
        createdAt: kit.createdAt ? new Date(kit.createdAt) : new Date(),
        updatedAt: new Date(),
      });
      return true;
    } catch {
      return false;
    }
  }

  static async update(id: string, data: Partial<Kit>): Promise<boolean> {
    try {
      const existing = await KitRepository.getById(id);
      if (!existing) return false;

      const updated = { ...existing, ...data };

      await db
        .update(kits)
        .set({
          title: updated.title,
          slug: updated.slug ?? null,
          category: updated.category ?? null,
          description: updated.description ?? null,
          cover: updated.cover ?? null,
          previewMp3: updated.previewMp3 ?? null,
          fileUrl: updated.fileUrl ?? null,
          itemCount: updated.itemCount ?? null,
          fileSize: updated.fileSize ?? null,
          price: updated.price ?? null,
          visible: updated.visible ?? 1,
          updatedAt: new Date(),
        })
        .where(eq(kits.id, id));

      return true;
    } catch {
      return false;
    }
  }

  static async exists(id: string): Promise<boolean> {
    const kit = await KitRepository.getById(id);
    return kit !== null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(kits).where(eq(kits.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}