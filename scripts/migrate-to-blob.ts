import { config } from 'dotenv';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

config({ path: '.env.local' });

const db = new Database(path.join(process.cwd(), 'data', 'beatstore.db'));

async function migrate() {
  const beats = db.prepare(
    "SELECT * FROM beats WHERE cover LIKE '/uploads/%' OR previewMp3 LIKE '/uploads/%'"
  ).all() as any[];

  for (const beat of beats) {
    console.log(`Migration de : ${beat.title}`);

    // Migrer cover
    if (beat.cover && beat.cover.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', beat.cover);
      if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath);
        const blob = await put(path.basename(beat.cover), file, { access: 'public' });
        db.prepare('UPDATE beats SET cover = ? WHERE id = ?').run(blob.url, beat.id);
        console.log(`  Cover migré : ${blob.url}`);
      }
    }

    // Migrer previewMp3
    if (beat.previewMp3 && beat.previewMp3.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', beat.previewMp3);
      if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath);
        const blob = await put(path.basename(beat.previewMp3), file, { access: 'public' });
        db.prepare('UPDATE beats SET previewMp3 = ? WHERE id = ?').run(blob.url, beat.id);
        console.log(`  Audio migré : ${blob.url}`);
      }
    }

    // Migrer wavFile
    if (beat.wavFile && beat.wavFile.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', beat.wavFile);
      if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath);
        const blob = await put(path.basename(beat.wavFile), file, { access: 'public' });
        db.prepare('UPDATE beats SET wavFile = ? WHERE id = ?').run(blob.url, beat.id);
        console.log(`  WAV migré : ${blob.url}`);
      }
    }

    // Migrer stemsFile
    if (beat.stemsFile && beat.stemsFile.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', beat.stemsFile);
      if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath);
        const blob = await put(path.basename(beat.stemsFile), file, { access: 'public' });
        db.prepare('UPDATE beats SET stemsFile = ? WHERE id = ?').run(blob.url, beat.id);
        console.log(`  Stems migrés : ${blob.url}`);
      }
    }

    // Migrer trackoutFile
    if (beat.trackoutFile && beat.trackoutFile.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', beat.trackoutFile);
      if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath);
        const blob = await put(path.basename(beat.trackoutFile), file, { access: 'public' });
        db.prepare('UPDATE beats SET trackoutFile = ? WHERE id = ?').run(blob.url, beat.id);
        console.log(`  Trackout migré : ${blob.url}`);
      }
    }
  }

  console.log('Migration terminée !');
}

migrate().catch(console.error);