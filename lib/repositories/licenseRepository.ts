import db from '@/lib/db';

export type LicenseModel = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  created_at: string;
};

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
  async findAll(): Promise<LicenseModel[]> {
    const rows = await db.prepare('SELECT * FROM licenses ORDER BY price ASC').all() as LicenseRow[];
    return (rows || []).map(rowToModel);
  }

  async findById(id: string): Promise<LicenseModel | undefined> {
    const row = await db.prepare('SELECT * FROM licenses WHERE id = ?').get(id) as LicenseRow | undefined;
    return row ? rowToModel(row) : undefined;
  }

  async create(data: Omit<LicenseModel, 'created_at'>): Promise<LicenseModel> {
    const createdAt = new Date().toISOString();
    const featuresJson = JSON.stringify(data.features || []);

    await db.prepare(`
      INSERT INTO licenses (id, name, price, description, features, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(data.id, data.name, data.price, data.description, featuresJson, createdAt);

    return { ...data, created_at: createdAt };
  }

  async update(id: string, data: Partial<LicenseModel>): Promise<LicenseModel | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const updated: LicenseModel = { ...existing, ...data };
    const featuresJson = JSON.stringify(updated.features || []);

    await db.prepare(`
      UPDATE licenses SET name = ?, price = ?, description = ?, features = ?
      WHERE id = ?
    `).run(updated.name, updated.price, updated.description, featuresJson, id);

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.prepare('DELETE FROM licenses WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export const licenseRepository = new LicenseRepository();