import { pgTable, text, timestamp, real, integer } from 'drizzle-orm/pg-core';

// --- Analytics (logs bruts d'événements, utilisé par la page /admin/analytics) ---
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

// --- Analytics (compteurs agrégés par beat, utilisé par analyticsRepository.ts) ---
export const analytics = pgTable('analytics', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  beatId: text('beat_id').notNull(),
  eventType: text('event_type').notNull(),
  playsCount: integer('plays_count').default(0),
  cartAdds: integer('cart_adds').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// --- Beats ---
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
  status: text('status').notNull().default('draft'),
  visible: integer('visible').default(1),
  featured: integer('featured').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// --- Users ---
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  role: text('role').notNull().default('customer'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// --- Sales ---
export const sales = pgTable('sales', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id'),
  beatId: text('beat_id').notNull(),
  licenseId: text('license_id').notNull(),
  amount: real('amount').notNull().default(0),
  stripeSessionId: text('stripe_session_id'),
  status: text('status').notNull().default('PENDING'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// --- Favorites ---
export const favorites = pgTable('favorites', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull(),
  beatId: text('beat_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// --- Comments ---
export const comments = pgTable('comments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull(),
  beatId: text('beat_id').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// --- Downloads ---
export const downloads = pgTable('downloads', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id'),
  beatId: text('beat_id').notNull(),
  saleId: text('sale_id'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
// --- Licenses ---
export const licenses = pgTable('licenses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: real('price').notNull(),
  description: text('description').notNull(),
  features: text('features').default('[]').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});// --- Kits ---
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
  featured: integer('featured').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});