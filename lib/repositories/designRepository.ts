import db from "@/lib/db";

export interface DesignConfig {
  id?: string;
  themeName?: string;
  primaryColor?: string;
  accentColor?: string;
  bannerUrl?: string;
  logoUrl?: string;
  customCss?: string;
  updatedAt?: string;
}

export class DesignRepository {
  // ==========================================
  // LECTURE
  // ==========================================

  static getConfig(): DesignConfig | undefined {
    // On suppose une configuration unique stockée avec l'id "main" ou la première ligne
    return await db.prepare("SELECT * FROM designs LIMIT 1").get() as DesignConfig | undefined;
  }

  // ==========================================
  // CRÉATION / MISE À JOUR (UPSERT)
  // ==========================================

  static saveConfig(config: DesignConfig): boolean {
    // Vérifions d'abord si une table designs existe ou créons-la dynamiquement si besoin, 
    // mais supposons qu'elle est gérée ou qu'on utilise une table clé/valeur ou une table dédiée.
    // Faisons une approche robuste avec une table simple id/data ou des colonnes dédiées.
    
    const existing = this.getConfig();

    if (!existing) {
      const stmt = await db.prepare(`
        INSERT INTO designs (id, themeName, primaryColor, accentColor, bannerUrl, logoUrl, customCss, updatedAt)
        VALUES (@id, @themeName, @primaryColor, @accentColor, @bannerUrl, @logoUrl, @customCss, CURRENT_TIMESTAMP)
      `);
      const result = await stmt.run({
        id: "main",
        themeName: config.themeName ?? "default",
        primaryColor: config.primaryColor ?? "#ff0055",
        accentColor: config.accentColor ?? "#00ffff",
        bannerUrl: config.bannerUrl ?? "",
        logoUrl: config.logoUrl ?? "",
        customCss: config.customCss ?? "",
      });
      return result.changes > 0;
    } else {
      const fields = Object.keys(config)
        .map((key) => `${key} = @${key}`)
        .join(", ");

      if (!fields) return false;

      const stmt = await db.prepare(`
        UPDATE designs
        SET ${fields}, updatedAt = CURRENT_TIMESTAMP
        WHERE id = COALESCE(@id, 'main')
      `);

      const result = await stmt.run({
        ...config,
        id: config.id ?? "main",
      });

      return result.changes > 0;
    }
  }
}