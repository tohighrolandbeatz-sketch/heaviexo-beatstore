import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "beatstore.db");

const db = new Database(DB_PATH);

// ======================================================
// SQLite Optimisations
// ======================================================

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.pragma("synchronous = NORMAL");
db.pragma("cache_size = 10000");
db.pragma("temp_store = MEMORY");

// ======================================================
// Tables
// ======================================================

db.exec(`

CREATE TABLE IF NOT EXISTS beats (

    id TEXT PRIMARY KEY,

    title TEXT NOT NULL,
    slug TEXT UNIQUE,

    producer TEXT,

    genre TEXT,
    type TEXT,

    bpm INTEGER,
    musicalKey TEXT,

    duration TEXT,

    description TEXT,
    tags TEXT,

    cover TEXT,

    previewMp3 TEXT,
    wavFile TEXT,
    stemsFile TEXT,
    trackoutFile TEXT,

    waveform TEXT,

    basicPrice REAL,
    wavPrice REAL,
    stemsPrice REAL,
    exclusivePrice REAL,

    visible INTEGER DEFAULT 1,
    featured INTEGER DEFAULT 0,
    exclusive INTEGER DEFAULT 0,

    plays INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    cartAdds INTEGER DEFAULT 0,
    purchases INTEGER DEFAULT 0,

    seoTitle TEXT,
    seoDescription TEXT,

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS kits (

    id TEXT PRIMARY KEY,

    title TEXT NOT NULL,
    slug TEXT UNIQUE,

    category TEXT,

    description TEXT,

    cover TEXT,

    previewMp3 TEXT,

    fileUrl TEXT,

    itemCount TEXT,

    fileSize TEXT,

    price REAL,

    visible INTEGER DEFAULT 1,

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS licenses (

    id TEXT PRIMARY KEY,

    name TEXT NOT NULL,

    description TEXT,

    price REAL,

    allowCommercial INTEGER DEFAULT 1,

    allowStreaming INTEGER DEFAULT 1,

    allowRadio INTEGER DEFAULT 1,

    allowYoutube INTEGER DEFAULT 1,

    allowMusicVideo INTEGER DEFAULT 0,

    maxStreams INTEGER,

    maxSales INTEGER,

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS beat_licenses (

    beatId TEXT,

    licenseId TEXT,

    customPrice REAL,

    PRIMARY KEY (beatId, licenseId),

    FOREIGN KEY (beatId) REFERENCES beats(id) ON DELETE CASCADE,

    FOREIGN KEY (licenseId) REFERENCES licenses(id) ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS comments (

    id TEXT PRIMARY KEY,

    beatId TEXT NOT NULL,

    author TEXT,

    rating INTEGER,

    message TEXT,

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (beatId) REFERENCES beats(id) ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS orders (

    id TEXT PRIMARY KEY,

    customerName TEXT,

    customerEmail TEXT,

    customerPhone TEXT,

    paymentMethod TEXT,

    paymentReference TEXT,

    currency TEXT,

    items TEXT,

    totalAmount REAL,

    downloadLinks TEXT,

    status TEXT,

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    paidAt DATETIME

);

CREATE TABLE IF NOT EXISTS statistics (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    date TEXT,

    pageViews INTEGER DEFAULT 0,

    beatPlays INTEGER DEFAULT 0,

    downloads INTEGER DEFAULT 0,

    cartAdds INTEGER DEFAULT 0,

    purchases INTEGER DEFAULT 0

);

-- Ajout de la table designs pour la configuration visuelle
CREATE TABLE IF NOT EXISTS designs (
    id TEXT PRIMARY KEY,
    themeName TEXT,
    primaryColor TEXT,
    accentColor TEXT,
    bannerUrl TEXT,
    logoUrl TEXT,
    customCss TEXT,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

`);

// ======================================================
// Migrations (ajout de colonnes sur tables déjà existantes)
// ======================================================

const beatColumns = db.prepare("PRAGMA table_info(beats)").all() as { name: string }[];
const hasMoodColumn = beatColumns.some((col) => col.name === "mood");
if (!hasMoodColumn) {
  db.exec("ALTER TABLE beats ADD COLUMN mood TEXT");
}

// ======================================================
// Indexes
// ======================================================

db.exec(`

CREATE INDEX IF NOT EXISTS idx_beats_title
ON beats(title);

CREATE INDEX IF NOT EXISTS idx_beats_slug
ON beats(slug);

CREATE INDEX IF NOT EXISTS idx_beats_visible
ON beats(visible);

CREATE INDEX IF NOT EXISTS idx_beats_featured
ON beats(featured);

CREATE INDEX IF NOT EXISTS idx_kits_category
ON kits(category);

CREATE INDEX IF NOT EXISTS idx_orders_status
ON orders(status);

CREATE INDEX IF NOT EXISTS idx_comments_beat
ON comments(beatId);

`);

export default db;