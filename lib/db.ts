import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'beatstore.db');
const db = new Database(dbPath);

// Activation du mode WAL pour de meilleures performances
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON'); // Active le support des clés étrangères pour l'intégrité des relations

// Création de toutes les tables de l'architecture
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'CUSTOMER',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS beats (
    id TEXT PRIMARY KEY,
    folder TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    genre TEXT NOT NULL,
    mood TEXT NOT NULL,
    bpm INTEGER NOT NULL,
    musicalKey TEXT NOT NULL,
    price REAL NOT NULL,
    cover TEXT NOT NULL,
    previewMp3 TEXT NOT NULL,
    masterWav TEXT,
    stemsZip TEXT,
    visible INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS licenses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    features TEXT, -- Stocké en JSON ou texte séparé par des virgules
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    beat_id TEXT NOT NULL,
    license_id TEXT NOT NULL,
    amount REAL NOT NULL,
    stripe_session_id TEXT,
    status TEXT DEFAULT 'PENDING',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (beat_id) REFERENCES beats(id) ON DELETE CASCADE,
    FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id TEXT PRIMARY KEY,
    beat_id TEXT NOT NULL,
    plays_count INTEGER DEFAULT 0,
    cart_adds INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (beat_id) REFERENCES beats(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    beat_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (beat_id) REFERENCES beats(id) ON DELETE CASCADE,
    UNIQUE(user_id, beat_id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    beat_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (beat_id) REFERENCES beats(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS downloads (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    beat_id TEXT NOT NULL,
    sale_id TEXT,
    ip_address TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (beat_id) REFERENCES beats(id) ON DELETE CASCADE,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE SET NULL
  );
`);

export default db;