import { pgTable, text, timestamp, real, integer } from 'drizzle-orm/pg-core';

export const analyticsEvents = pgTable('analytics_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  eventType: text('event_type').notNull(),
  beatId: text('beat_id'),
  amount: text('amount'),
  country: text('country').default('Bénin'),
  city: text('city').default('Cotonou'),
  region: text('region').default('Littoral'),
  device: text('device').default('Desktop'),
  browser: text('browser').default('Chrome'),
  referer: text('referer').default('Direct'),
  url: text('url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const beats = pgTable('beats', {
  id: text('id').primaryKey(),
  folder: text('folder'),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  genre: text('genre'),
  mood: text('mood'),
  bpm: integer('bpm').default(140),
  musicalKey: text('musical_key'),
  description: text('description').default(''),
  seoTags: text('seo_tags').default(''),
  price: real('price').notNull().default(29),
  licensesJson: text('licenses_json').default('[]'),
  coverUrl: text('cover_url'),
  previewUrl: text('preview_url'),
  masterUrl: text('master_url'),
  stemsUrl: text('stems_url'),
  status: text('status').notNull().default('draft'), // 'published' | 'draft' | 'archived'
  visible: integer('visible').default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});