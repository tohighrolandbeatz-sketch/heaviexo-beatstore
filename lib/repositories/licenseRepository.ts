import db from '@/lib/db';

export type LicenseModel = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  created_at: string;
};

// Format brut tel que stocké en base (features en JSON string, pas en tableau)
type LicenseRow = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string;
  created_at: string;
};

function parseFeatures(raw: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [String(raw)];
  } catch {
    // Ancien format (texte simple séparé par virgules) : on le convertit à la volée
    return raw.split(',').map((f) => f.trim()).filter(Boolean);
  }
}

function rowToModel(row: LicenseRow): LicenseModel {
  return {
    ...row,
    features: parseFeatures(row.features),
  };
}

class LicenseRepository {
  findAll(): LicenseModel[] {
    const rows = db.prepare('SELECT * FROM licenses ORDER BY price ASC').all() as LicenseRow[];
    return rows.map(rowToModel);
  }

  findById(id: string): LicenseModel | undefined {
    const row = db.prepare('SELECT * FROM licenses WHERE id = ?').get(id) as LicenseRow | undefined;
    return row ? rowToModel(row) : undefined;
  }

  create(data: Omit<LicenseModel, 'created_at'>): LicenseModel {
    const createdAt = new Date().toISOString();
    const featuresJson = JSON.stringify(data.features || []);

    const stmt = db.prepare(`
      INSERT INTO licenses (id, name, price, description, features, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(data.id, data.name, data.price, data.description, featuresJson, createdAt);

    return { ...data, created_at: createdAt };
  }

  update(id: string, data: Partial<LicenseModel>): LicenseModel | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;

    const updated: LicenseModel = { ...existing, ...data };
    const featuresJson = JSON.stringify(updated.features || []);

    const stmt = db.prepare(`
      UPDATE licenses SET name = ?, price = ?, description = ?, features = ?
      WHERE id = ?
    `);

    stmt.run(updated.name, updated.price, updated.description, featuresJson, id);

    return updated;
  }

  delete(id: string): boolean {
    const result = db.prepare('DELETE FROM licenses WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export const licenseRepository = new LicenseRepository();