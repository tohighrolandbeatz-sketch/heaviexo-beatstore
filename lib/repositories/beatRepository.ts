import { db } from '@/lib/db';
import { beats } from '@/app/config/schema';
import { eq, desc } from 'drizzle-orm';

export interface BeatModel {
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
}

class BeatRepository {
  async findAll(): Promise<BeatModel[]> {
    const result = await db
      .select()
      .from(beats)
      .orderBy(desc(beats.createdAt));

    return result.map((beat) => ({
      id: beat.id,
      title: beat.title,
      slug: beat.slug,
      genre: beat.genre ?? '',
      mood: beat.mood ?? '',
      bpm: beat.bpm ?? 140,
      musical_key: beat.musicalKey ?? '',
      description: beat.description ?? '',
      seo_tags: beat.seoTags ?? '',
      price: beat.price,
      licenses_json: beat.licensesJson ?? '[]',
      cover_url: beat.coverUrl ?? undefined,
      preview_url: beat.previewUrl ?? undefined,
      master_url: beat.masterUrl ?? undefined,
      stems_url: beat.stemsUrl ?? undefined,
      status: beat.status as BeatModel['status'],
      created_at: beat.createdAt.toISOString(),
    }));
  }

  async findById(id: string): Promise<BeatModel | undefined> {
    const result = await db
      .select()
      .from(beats)
      .where(eq(beats.id, id))
      .limit(1);

    if (!result.length) return undefined;

    const beat = result[0];

    return {
      id: beat.id,
      title: beat.title,
      slug: beat.slug,
      genre: beat.genre ?? '',
      mood: beat.mood ?? '',
      bpm: beat.bpm ?? 140,
      musical_key: beat.musicalKey ?? '',
      description: beat.description ?? '',
      seo_tags: beat.seoTags ?? '',
      price: beat.price,
      licenses_json: beat.licensesJson ?? '[]',
      cover_url: beat.coverUrl ?? undefined,
      preview_url: beat.previewUrl ?? undefined,
      master_url: beat.masterUrl ?? undefined,
      stems_url: beat.stemsUrl ?? undefined,
      status: beat.status as BeatModel['status'],
      created_at: beat.createdAt.toISOString(),
    };
  }

  async create(data: Omit<BeatModel, 'created_at'>): Promise<BeatModel> {
    const now = new Date();

    await db.insert(beats).values({
      id: data.id,
      folder: data.slug,
      title: data.title,
      slug: data.slug,
      genre: data.genre,
      mood: data.mood,
      bpm: data.bpm,
      musicalKey: data.musical_key,
      description: data.description ?? '',
      seoTags: data.seo_tags ?? '',
      price: data.price,
      licensesJson: data.licenses_json ?? '[]',
      coverUrl: data.cover_url ?? null,
      previewUrl: data.preview_url ?? null,
      masterUrl: data.master_url ?? null,
      stemsUrl: data.stems_url ?? null,
      status: data.status,
      visible: 1,
      createdAt: now,
      updatedAt: now,
    });

    return {
      ...data,
      created_at: now.toISOString(),
    };
  }

  async update(
    id: string,
    data: Partial<BeatModel>
  ): Promise<BeatModel | undefined> {
    const existing = await this.findById(id);

    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...data,
    };

    await db
      .update(beats)
      .set({
        title: updated.title,
        slug: updated.slug,
        genre: updated.genre,
        mood: updated.mood,
        bpm: updated.bpm,
        musicalKey: updated.musical_key,
        description: updated.description,
        seoTags: updated.seo_tags,
        price: updated.price,
        licensesJson: updated.licenses_json,
        coverUrl: updated.cover_url ?? null,
        previewUrl: updated.preview_url ?? null,
        masterUrl: updated.master_url ?? null,
        stemsUrl: updated.stems_url ?? null,
        status: updated.status,
        updatedAt: new Date(),
      })
      .where(eq(beats.id, id));

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(beats)
      .where(eq(beats.id, id));

    return (result.rowCount ?? 0) > 0;
  }
}

export const beatRepository = new BeatRepository();