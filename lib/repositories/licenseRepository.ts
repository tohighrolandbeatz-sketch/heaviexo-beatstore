import { db } from '@/lib/db';
import { licenses } from '@/app/config/schema';
import { eq, asc } from 'drizzle-orm';

export type LicenseModel = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
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

function rowToModel(row: typeof licenses.$inferSelect): LicenseModel {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    description: row.description,
    features: parseFeatures(row.features),
    created_at: row.createdAt.toISOString(),
  };
}

class LicenseRepository {
  async findAll(): Promise<LicenseModel[]> {
    const rows = await db.select().from(licenses).orderBy(asc(licenses.price));
    return (rows || []).map(rowToModel);
  }

  async findById(id: string): Promise<LicenseModel | undefined> {
    const result = await db.select().from(licenses).where(eq(licenses.id, id)).limit(1);
    const row = result[0];
    return row ? rowToModel(row) : undefined;
  }

  async create(data: Omit<LicenseModel, 'created_at'>): Promise<LicenseModel> {
    const now = new Date();
    const featuresJson = JSON.stringify(data.features || []);

    await db.insert(licenses).values({
      id: data.id,
      name: data.name,
      price: data.price,
      description: data.description,
      features: featuresJson,
      createdAt: now,
      updatedAt: now,
    });

    return { ...data, created_at: now.toISOString() };
  }

  async update(id: string, data: Partial<LicenseModel>): Promise<LicenseModel | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const updated: LicenseModel = { ...existing, ...data };
    const featuresJson = JSON.stringify(updated.features || []);

    await db
      .update(licenses)
      .set({
        name: updated.name,
        price: updated.price,
        description: updated.description,
        features: featuresJson,
        updatedAt: new Date(),
      })
      .where(eq(licenses.id, id));

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(licenses).where(eq(licenses.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const licenseRepository = new LicenseRepository();