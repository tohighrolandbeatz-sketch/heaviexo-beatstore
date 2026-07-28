import db from "@/lib/db";

export interface Beat {
  id: string;
  title: string;
  slug?: string;
  producer?: string;
  genre?: string;
  type?: string;
  bpm?: number;
  musicalKey?: string;
  mood?: string;
  duration?: string;
  description?: string;
  tags?: string;
  cover?: string;
  previewMp3?: string;
  wavFile?: string;
  stemsFile?: string;
  trackoutFile?: string;
  waveform?: string;
  basicPrice?: number;
  wavPrice?: number;
  stemsPrice?: number;
  exclusivePrice?: number;
  visible?: number;
  featured?: number;
  exclusive?: number;
  plays?: number;
  downloads?: number;
  likes?: number;
  cartAdds?: number;
  purchases?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class BeatRepository {
  // ==========================================
  // LECTURE
  // ==========================================
  static getAll(): Beat[] {
    return db.prepare("SELECT * FROM beats ORDER BY createdAt DESC").all() as Beat[];
  }

  static getVisible(): Beat[] {
    return db.prepare("SELECT * FROM beats WHERE visible = 1 ORDER BY createdAt DESC").all() as Beat[];
  }

  static getFeatured(): Beat[] {
    return db.prepare("SELECT * FROM beats WHERE featured = 1 AND visible = 1 ORDER BY createdAt DESC").all() as Beat[];
  }

  static getById(id: string): Beat | undefined {
    return db.prepare("SELECT * FROM beats WHERE id = ?").get(id) as Beat | undefined;
  }

  static getBySlug(slug: string): Beat | undefined {
    return db.prepare("SELECT * FROM beats WHERE slug = ?").get(slug) as Beat | undefined;
  }

  static search(query: string): Beat[] {
    const searchTerm = `%${query}%`;
    return db.prepare(
      "SELECT * FROM beats WHERE title LIKE ? OR genre LIKE ? OR producer LIKE ? OR tags LIKE ? ORDER BY createdAt DESC"
    ).all(searchTerm, searchTerm, searchTerm, searchTerm) as Beat[];
  }

  static getByGenre(genre: string): Beat[] {
    return db.prepare("SELECT * FROM beats WHERE genre = ? AND visible = 1 ORDER BY createdAt DESC").all(genre) as Beat[];
  }

  static getByProducer(producer: string): Beat[] {
    return db.prepare("SELECT * FROM beats WHERE producer = ? AND visible = 1 ORDER BY createdAt DESC").all(producer) as Beat[];
  }

  // ==========================================
  // CRÉATION & DUPLICATION
  // ==========================================
  static create(beat: Beat): void {
    const stmt = db.prepare(`
      INSERT INTO beats (
        id, title, slug, producer, genre, type, bpm, musicalKey, mood, duration, 
        description, tags, cover, previewMp3, wavFile, stemsFile, trackoutFile, 
        waveform, basicPrice, wavPrice, stemsPrice, exclusivePrice, visible, 
        featured, exclusive, seoTitle, seoDescription
      ) VALUES (
        @id, @title, @slug, @producer, @genre, @type, @bpm, @musicalKey, @mood, @duration, 
        @description, @tags, @cover, @previewMp3, @wavFile, @stemsFile, @trackoutFile, 
        @waveform, @basicPrice, @wavPrice, @stemsPrice, @exclusivePrice, @visible, 
        @featured, @exclusive, @seoTitle, @seoDescription
      )
    `);
    stmt.run(beat);
  }

  static duplicate(id: string, newId: string, newSlug: string): Beat | null {
    const original = this.getById(id);
    if (!original) return null;

    const duplicated: Beat = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      slug: newSlug,
      plays: 0,
      downloads: 0,
      likes: 0,
      cartAdds: 0,
      purchases: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.create(duplicated);
    return duplicated;
  }

  // ==========================================
  // MISE À JOUR
  // ==========================================
  static update(id: string, beat: Partial<Beat>): void {
    const fields = Object.keys(beat)
      .map((key) => `${key} = @${key}`)
      .join(", ");
    
    const stmt = db.prepare(`UPDATE beats SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = @id`);
    stmt.run({ ...beat, id });
  }

  static updateVisibility(id: string, visible: number): void {
    db.prepare("UPDATE beats SET visible = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?").run(visible, id);
  }

  static updateFeatured(id: string, featured: number): void {
    db.prepare("UPDATE beats SET featured = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?").run(featured, id);
  }

  static updatePrices(id: string, prices: { basicPrice?: number; wavPrice?: number; stemsPrice?: number; exclusivePrice?: number }): void {
    db.prepare(`
      UPDATE beats SET 
        basicPrice = COALESCE(?, basicPrice), 
        wavPrice = COALESCE(?, wavPrice), 
        stemsPrice = COALESCE(?, stemsPrice), 
        exclusivePrice = COALESCE(?, exclusivePrice),
        updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(prices.basicPrice, prices.wavPrice, prices.stemsPrice, prices.exclusivePrice, id);
  }

  static updateFiles(id: string, files: { previewMp3?: string; wavFile?: string; stemsFile?: string; cover?: string }): void {
    db.prepare(`
      UPDATE beats SET 
        previewMp3 = COALESCE(?, previewMp3), 
        wavFile = COALESCE(?, wavFile), 
        stemsFile = COALESCE(?, stemsFile), 
        cover = COALESCE(?, cover),
        updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(files.previewMp3, files.wavFile, files.stemsFile, files.cover, id);
  }

  // ==========================================
  // OPÉRATIONS EN MASSE (BULK)
  // ==========================================
  static bulkUpdate(ids: string[], data: Partial<Beat>): void {
    const transaction = db.transaction((beatIds: string[]) => {
      for (const id of beatIds) {
        this.update(id, data);
      }
    });
    transaction(ids);
  }

  static bulkDelete(ids: string[]): void {
    const placeholders = ids.map(() => "?").join(",");
    db.prepare(`DELETE FROM beats WHERE id IN (${placeholders})`).run(...ids);
  }

  static bulkVisibility(ids: string[], visible: number): void {
    const placeholders = ids.map(() => "?").join(",");
    db.prepare(`UPDATE beats SET visible = ?, updatedAt = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`).run(visible, ...ids);
  }

  // ==========================================
  // SUPPRESSION
  // ==========================================
  static delete(id: string): void {
    db.prepare("DELETE FROM beats WHERE id = ?").run(id);
  }

  // ==========================================
  // STATISTIQUES & COMPTEURS
  // ==========================================
  static incrementPlays(id: string): void {
    db.prepare("UPDATE beats SET plays = plays + 1 WHERE id = ?").run(id);
  }

  static incrementDownloads(id: string): void {
    db.prepare("UPDATE beats SET downloads = downloads + 1 WHERE id = ?").run(id);
  }

  static incrementLikes(id: string): void {
    db.prepare("UPDATE beats SET likes = likes + 1 WHERE id = ?").run(id);
  }

  static incrementCartAdds(id: string): void {
    db.prepare("UPDATE beats SET cartAdds = cartAdds + 1 WHERE id = ?").run(id);
  }

  static incrementPurchases(id: string): void {
    db.prepare("UPDATE beats SET purchases = purchases + 1 WHERE id = ?").run(id);
  }

  // ==========================================
  // LICENCES ASSOCIÉES
  // ==========================================
  static getLicenses(beatId: string) {
    return db.prepare(`
      bl.*, l.name, l.description 
      FROM beat_licenses bl 
      JOIN licenses l ON bl.licenseId = l.id 
      WHERE bl.beatId = ?
    `).all(beatId);
  }

  static attachLicense(beatId: string, licenseId: string, customPrice: number): void {
    db.prepare(`
      INSERT INTO beat_licenses (beatId, licenseId, customPrice) 
      VALUES (?, ?, ?) 
      ON CONFLICT(beatId, licenseId) DO UPDATE SET customPrice = ?
    `).run(beatId, licenseId, customPrice, customPrice);
  }

  static detachLicense(beatId: string, licenseId: string): void {
    db.prepare("DELETE FROM beat_licenses WHERE beatId = ? AND licenseId = ?").run(beatId, licenseId);
  }

  // ==========================================
  // COMMENTAIRES
  // ==========================================
  static getComments(beatId: string) {
    return db.prepare("SELECT * FROM comments WHERE beatId = ? ORDER BY createdAt DESC").all(beatId);
  }

  static addComment(comment: { id: string; beatId: string; author: string; rating: number; message: string }): void {
    db.prepare(`
      INSERT INTO comments (id, beatId, author, rating, message) 
      VALUES (@id, @beatId, @author, @rating, @message)
    `).run(comment);
  }

  static deleteComment(commentId: string): void {
    db.prepare("DELETE FROM comments WHERE id = ?").run(commentId);
  }

  // ==========================================
  // DIVERS
  // ==========================================
  static exists(id: string): boolean {
    const row = db.prepare("SELECT 1 FROM beats WHERE id = ?").get(id);
    return !!row;
  }

  static count(): number {
    const row = db.prepare("SELECT COUNT(*) as count FROM beats").get() as { count: number };
    return row.count;
  }
}