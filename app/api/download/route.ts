import db from '@/lib/db';

export type LicenseModel = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string;
  created_at: string;
};

class LicenseRepository {
  findAll(): LicenseModel[] {
    return db.prepare('SELECT * FROM licenses ORDER BY price ASC').all() as LicenseModel[];
  }

  findById(id: string): LicenseModel | undefined {
    return db.prepare('SELECT * FROM licenses WHERE id = ?').get(id) as LicenseModel | undefined;
  }

  create(data: Omit<LicenseModel, 'created_at'>): LicenseModel {
    const createdAt = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO licenses (id, name, price, description, features, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(data.id, data.name, data.price, data.description, data.features, createdAt);

    return { ...data, created_at: createdAt };
  }

  update(id: string, data: Partial<LicenseModel>): LicenseModel | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...data };

    const stmt = db.prepare(`
      UPDATE licenses SET name = ?, price = ?, description = ?, features = ?
      WHERE id = ?
    `);

    stmt.run(updated.name, updated.price, updated.description, updated.features, id);

    return updated;
  }

  delete(id: string): boolean {
    const result = db.prepare('DELETE FROM licenses WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export const licenseRepository = new LicenseRepository();