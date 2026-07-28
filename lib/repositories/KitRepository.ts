import db from "@/lib/db";

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
  // ==========================================
  // LECTURE
  // ==========================================

  static getAll(): Kit[] {
    return db.prepare("SELECT * FROM kits ORDER BY createdAt DESC").all() as Kit[];
  }

  static getVisible(): Kit[] {
    return db
      .prepare("SELECT * FROM kits WHERE visible = 1 ORDER BY createdAt DESC")
      .all() as Kit[];
  }

  static getById(id: string): Kit | undefined {
    return db.prepare("SELECT * FROM kits WHERE id = ?").get(id) as Kit | undefined;
  }

  static getBySlug(slug: string): Kit | undefined {
    return db.prepare("SELECT * FROM kits WHERE slug = ?").get(slug) as Kit | undefined;
  }

  static getByCategory(category: string): Kit[] {
    return db
      .prepare(
        "SELECT * FROM kits WHERE category = ? AND visible = 1 ORDER BY createdAt DESC"
      )
      .all(category) as Kit[];
  }

  static search(query: string): Kit[] {
    const searchTerm = `%${query}%`;

    return db
      .prepare(
        `
        SELECT *
        FROM kits
        WHERE
          title LIKE ?
          OR slug LIKE ?
          OR category LIKE ?
          OR description LIKE ?
        ORDER BY createdAt DESC
      `
      )
      .all(searchTerm, searchTerm, searchTerm, searchTerm) as Kit[];
  }

  static getCategories(): string[] {
    const rows = db
      .prepare(
        `
        SELECT DISTINCT category
        FROM kits
        WHERE category IS NOT NULL
        ORDER BY category ASC
      `
      )
      .all() as { category: string }[];

    return rows.map((row) => row.category);
  }

  // ==========================================
  // CRÉATION
  // ==========================================

  static create(kit: Kit): boolean {
    const stmt = db.prepare(`
      INSERT INTO kits (
        id,
        title,
        slug,
        category,
        description,
        cover,
        previewMp3,
        fileUrl,
        itemCount,
        fileSize,
        price,
        visible
      )
      VALUES (
        @id,
        @title,
        @slug,
        @category,
        @description,
        @cover,
        @previewMp3,
        @fileUrl,
        @itemCount,
        @fileSize,
        @price,
        @visible
      )
    `);

    const result = stmt.run({
      ...kit,
      visible: kit.visible ?? 1,
    });

    return result.changes > 0;
  }

  static duplicate(id: string, newId: string, newSlug: string): Kit | null {
    const original = this.getById(id);

    if (!original) return null;

    const duplicated: Kit = {
      ...original,
      id: newId,
      slug: newSlug,
      title: `${original.title} (Copy)`,
    };

    this.create(duplicated);

    return duplicated;
  }

  // ==========================================
  // MISE À JOUR
  // ==========================================

  static update(id: string, kit: Partial<Kit>): boolean {
    if (Object.keys(kit).length === 0) return false;

    const fields = Object.keys(kit)
      .map((key) => `${key} = @${key}`)
      .join(", ");

    const stmt = db.prepare(`
      UPDATE kits
      SET ${fields}
      WHERE id = @id
    `);

    const result = stmt.run({
      ...kit,
      id,
    });

    return result.changes > 0;
  }

  static updateVisibility(id: string, visible: number): boolean {
    const result = db
      .prepare("UPDATE kits SET visible = ? WHERE id = ?")
      .run(visible, id);

    return result.changes > 0;
  }

  // ==========================================
  // BULK
  // ==========================================

  static bulkUpdate(ids: string[], data: Partial<Kit>): boolean {
    if (ids.length === 0) return false;

    const transaction = db.transaction((kitIds: string[]) => {
      for (const id of kitIds) {
        this.update(id, data);
      }
    });

    transaction(ids);

    return true;
  }

  static bulkDelete(ids: string[]): boolean {
    if (ids.length === 0) return false;

    const placeholders = ids.map(() => "?").join(",");

    const result = db
      .prepare(`DELETE FROM kits WHERE id IN (${placeholders})`)
      .run(...ids);

    return result.changes > 0;
  }

  static bulkVisibility(ids: string[], visible: number): boolean {
    if (ids.length === 0) return false;

    const placeholders = ids.map(() => "?").join(",");

    const result = db
      .prepare(
        `UPDATE kits SET visible = ? WHERE id IN (${placeholders})`
      )
      .run(visible, ...ids);

    return result.changes > 0;
  }

  // ==========================================
  // SUPPRESSION
  // ==========================================

  static delete(id: string): boolean {
    const result = db
      .prepare("DELETE FROM kits WHERE id = ?")
      .run(id);

    return result.changes > 0;
  }

  // ==========================================
  // STATISTIQUES
  // ==========================================

  static count(): number {
    const row = db
      .prepare("SELECT COUNT(*) AS count FROM kits")
      .get() as { count: number };

    return row.count;
  }

  static getStatistics() {
    const total = this.count();

    const visible = (
      db.prepare(
        "SELECT COUNT(*) AS count FROM kits WHERE visible = 1"
      ).get() as { count: number }
    ).count;

    const hidden = total - visible;

    const averagePrice = (
      db.prepare(
        "SELECT AVG(price) AS avgPrice FROM kits"
      ).get() as { avgPrice: number | null }
    ).avgPrice ?? 0;

    const categories = db
      .prepare(`
        SELECT category, COUNT(*) as total
        FROM kits
        GROUP BY category
        ORDER BY total DESC
      `)
      .all();

    return {
      total,
      visible,
      hidden,
      averagePrice,
      categories,
    };
  }

  // ==========================================
  // DIVERS
  // ==========================================

  static exists(id: string): boolean {
    return !!db.prepare("SELECT 1 FROM kits WHERE id = ?").get(id);
  }
}