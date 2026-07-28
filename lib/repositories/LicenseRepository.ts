import db from "@/lib/db";

export interface License {
  id: string;
  name: string;
  description?: string;
  price?: number;
  allowCommercial?: number;
  allowStreaming?: number;
  allowRadio?: number;
  allowYoutube?: number;
  allowMusicVideo?: number;
  maxStreams?: number;
  maxSales?: number;
  createdAt?: string;
}

export class LicenseRepository {
  // ==========================================
  // LECTURE
  // ==========================================

  static getAll(): License[] {
    return db.prepare("SELECT * FROM licenses ORDER BY price ASC").all() as License[];
  }

  static getById(id: string): License | undefined {
    return db.prepare("SELECT * FROM licenses WHERE id = ?").get(id) as License | undefined;
  }

  // ==========================================
  // CRÉATION
  // ==========================================

  static create(license: License): boolean {
    const stmt = db.prepare(`
      INSERT INTO licenses (
        id,
        name,
        description,
        price,
        allowCommercial,
        allowStreaming,
        allowRadio,
        allowYoutube,
        allowMusicVideo,
        maxStreams,
        maxSales
      )
      VALUES (
        @id,
        @name,
        @description,
        @price,
        @allowCommercial,
        @allowStreaming,
        @allowRadio,
        @allowYoutube,
        @allowMusicVideo,
        @maxStreams,
        @maxSales
      )
    `);

    const result = stmt.run({
      ...license,
      allowCommercial: license.allowCommercial ?? 1,
      allowStreaming: license.allowStreaming ?? 1,
      allowRadio: license.allowRadio ?? 1,
      allowYoutube: license.allowYoutube ?? 1,
      allowMusicVideo: license.allowMusicVideo ?? 0,
    });

    return result.changes > 0;
  }

  // ==========================================
  // MISE À JOUR
  // ==========================================

  static update(id: string, license: Partial<License>): boolean {
    if (Object.keys(license).length === 0) return false;

    const fields = Object.keys(license)
      .map((key) => `${key} = @${key}`)
      .join(", ");

    const stmt = db.prepare(`
      UPDATE licenses
      SET ${fields}
      WHERE id = @id
    `);

    const result = stmt.run({
      ...license,
      id,
    });

    return result.changes > 0;
  }

  // ==========================================
  // SUPPRESSION
  // ==========================================

  static delete(id: string): boolean {
    const result = db.prepare("DELETE FROM licenses WHERE id = ?").run(id);
    return result.changes > 0;
  }

  // ==========================================
  // DIVERS
  // ==========================================

  static exists(id: string): boolean {
    return !!db.prepare("SELECT 1 FROM licenses WHERE id = ?").get(id);
  }

  static count(): number {
    const row = db.prepare("SELECT COUNT(*) AS count FROM licenses").get() as { count: number };
    return row.count;
  }
}