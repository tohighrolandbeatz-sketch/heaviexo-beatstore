import db from '@/lib/db';

export type BeatModel = {
  id: string;
  title: string;
  slug: string;
  genre: string;
  mood: string;
  bpm: number;
  musical_key: string;
  description: string;
  seo_tags: string;
  price: number;
  licenses_json: string;
  cover_url?: string;
  preview_url?: string;
  master_url?: string;
  stems_url?: string;
  status: 'published' | 'draft' | 'archived';
  created_at: string;
};

class BeatRepository {
  constructor() {
    this.initTable();
  }

  private initTable() {
    db.exec(`
      CREATE TABLE IF NOT EXISTS beats (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        genre TEXT,
        mood TEXT,
        bpm INTEGER,
        musical_key TEXT,
        description TEXT,
        seo_tags TEXT,
        price REAL NOT NULL,
        licenses_json TEXT,
        cover_url TEXT,
        preview_url TEXT,
        master_url TEXT,
        stems_url TEXT,
        status TEXT DEFAULT 'draft',
        created_at TEXT NOT NULL
      )
    `);
  }

  findAll(): BeatModel[] {
    const tableInfo = db.prepare("PRAGMA table_info(beats)").all() as { name: string }[];
    const hasCreatedAt = tableInfo.some(col => col.name === 'created_at');

    if (!hasCreatedAt) {
      db.exec("ALTER TABLE beats ADD COLUMN created_at TEXT DEFAULT ''");
    }

    return db.prepare('SELECT * FROM beats ORDER BY rowid DESC').all() as BeatModel[];
  }

  findById(id: string): BeatModel | undefined {
    return db.prepare('SELECT * FROM beats WHERE id = ?').get(id) as BeatModel | undefined;
  }

  create(data: Omit<BeatModel, 'created_at'>): BeatModel {
    const createdAt = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO beats (
        id, title, slug, genre, mood, bpm, musical_key, description, 
        seo_tags, price, licenses_json, cover_url, preview_url, master_url, stems_url, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.id,
      data.title,
      data.slug,
      data.genre || '',
      data.mood || '',
      data.bpm || 0,
      data.musical_key || '',
      data.description || '',
      data.seo_tags || '',
      data.price,
      data.licenses_json || '[]',
      data.cover_url || null,
      data.preview_url || null,
      data.master_url || null,
      data.stems_url || null,
      data.status || 'draft',
      createdAt
    );

    return { ...data, created_at: createdAt };
  }

  update(id: string, data: Partial<BeatModel>): BeatModel | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...data };

    const stmt = db.prepare(`
      UPDATE beats SET 
        title = ?, slug = ?, genre = ?, mood = ?, bpm = ?, musical_key = ?, 
        description = ?, seo_tags = ?, price = ?, licenses_json = ?, 
        cover_url = ?, preview_url = ?, master_url = ?, stems_url = ?, status = ?
      WHERE id = ?
    `);

    stmt.run(
      updated.title,
      updated.slug,
      updated.genre,
      updated.mood,
      updated.bpm,
      updated.musical_key,
      updated.description,
      updated.seo_tags,
      updated.price,
      updated.licenses_json,
      updated.cover_url || null,
      updated.preview_url || null,
      updated.master_url || null,
      updated.stems_url || null,
      updated.status,
      id
    );

    return updated;
  }

  delete(id: string): boolean {
    const result = db.prepare('DELETE FROM beats WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export const beatRepository = new BeatRepository();