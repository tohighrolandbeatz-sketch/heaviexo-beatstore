import { pgTable, text, integer, real, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';

// ─── Users ───────────────────────────────────────────────
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  role: text('role').default('CUSTOMER').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Beats ───────────────────────────────────────────────
export const beats = pgTable('beats', {
  id: text('id').primaryKey(),
  folder: text('folder').notNull(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  genre: text('genre').notNull(),
  mood: text('mood').notNull(),
  bpm: integer('bpm').notNull(),
  musicalKey: text('musical_key').notNull(),
  description: text('description').default(''),
  seoTags: text('seo_tags').default(''),
  price: real('price').notNull(),
  licensesJson: text('licenses_json').default('[]'),
  coverUrl: text('cover_url'),
  previewUrl: text('preview_url'),
  masterUrl: text('master_url'),
  stemsUrl: text('stems_url'),
  status: text('status').default('draft').notNull(),
  visible: integer('visible').default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Licenses ────────────────────────────────────────────
export const licenses = pgTable('licenses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: real('price').notNull(),
  description: text('description'),
  features: text('features'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});


// ─── Kits ────────────────────────────────────────────────
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
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Sales ───────────────────────────────────────────────
export const sales = pgTable('sales', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  beatId: text('beat_id').notNull().references(() => beats.id, { onDelete: 'cascade' }),
  licenseId: text('license_id').notNull().references(() => licenses.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(),
  stripeSessionId: text('stripe_session_id'),
  status: text('status').default('PENDING'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Analytics ───────────────────────────────────────────
export const analytics = pgTable('analytics', {
  id: text('id').primaryKey(),
  beatId: text('beat_id').notNull().references(() => beats.id, { onDelete: 'cascade' }),
  eventType: text('event_type').notNull(),
  playsCount: integer('plays_count').default(0),
  cartAdds: integer('cart_adds').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Analytics Events ────────────────────────────────────
export const analyticsEvents = pgTable('analytics_events', {
  id: text('id').primaryKey(),
  eventType: text('event_type').notNull(),
  beatId: text('beat_id').references(() => beats.id, { onDelete: 'set null' }),
  ip: text('ip'),
  country: text('country'),
  city: text('city'),
  device: text('device'),
  browser: text('browser'),
  referrer: text('referrer'),
  path: text('path'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  eventTypeIdx: index('analytics_events_event_type_idx').on(table.eventType),
  createdAtIdx: index('analytics_events_created_at_idx').on(table.createdAt),
  beatIdIdx: index('analytics_events_beat_id_idx').on(table.beatId),
}));

// ─── Favorites ───────────────────────────────────────────
export const favorites = pgTable('favorites', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  beatId: text('beat_id').notNull().references(() => beats.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userBeatUnique: uniqueIndex('favorites_user_beat_unique').on(table.userId, table.beatId),
}));

// ─── Comments ────────────────────────────────────────────
export const comments = pgTable('comments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  beatId: text('beat_id').notNull().references(() => beats.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Downloads ───────────────────────────────────────────
export const downloads = pgTable('downloads', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  beatId: text('beat_id').notNull().references(() => beats.id, { onDelete: 'cascade' }),
  saleId: text('sale_id').references(() => sales.id, { onDelete: 'set null' }),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});