import { db } from '@/lib/db';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

export const designs = pgTable('designs', {
  id: text('id').primaryKey(),
  themeName: text('theme_name').default('default'),
  primaryColor: text('primary_color').default('#ff0055'),
  accentColor: text('accent_color').default('#00ffff'),
  bannerUrl: text('banner_url').default(''),
  logoUrl: text('logo_url').default(''),
  customCss: text('custom_css').default(''),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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

  static async getConfig(): Promise<DesignConfig | undefined> {
    const result = await db.select().from(designs).limit(1);
    if (!result[0]) return undefined;
    const row = result[0];
    return {
      id: row.id,
      themeName: row.themeName ?? undefined,
      primaryColor: row.primaryColor ?? undefined,
      accentColor: row.accentColor ?? undefined,
      bannerUrl: row.bannerUrl ?? undefined,
      logoUrl: row.logoUrl ?? undefined,
      customCss: row.customCss ?? undefined,
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  // ==========================================
  // CRÉATION / MISE À JOUR (UPSERT)
  // ==========================================

  static async saveConfig(config: DesignConfig): Promise<boolean> {
    try {
      const targetId = config.id ?? 'main';
      const existing = await DesignRepository.getConfig();

      if (!existing) {
        await db.insert(designs).values({
          id: targetId,
          themeName: config.themeName ?? 'default',
          primaryColor: config.primaryColor ?? '#ff0055',
          accentColor: config.accentColor ?? '#00ffff',
          bannerUrl: config.bannerUrl ?? '',
          logoUrl: config.logoUrl ?? '',
          customCss: config.customCss ?? '',
          updatedAt: new Date(),
        });
        return true;
      } else {
        await db
          .update(designs)
          .set({
            ...(config.themeName !== undefined && { themeName: config.themeName }),
            ...(config.primaryColor !== undefined && { primaryColor: config.primaryColor }),
            ...(config.accentColor !== undefined && { accentColor: config.accentColor }),
            ...(config.bannerUrl !== undefined && { bannerUrl: config.bannerUrl }),
            ...(config.logoUrl !== undefined && { logoUrl: config.logoUrl }),
            ...(config.customCss !== undefined && { customCss: config.customCss }),
            updatedAt: new Date(),
          })
          .where(eq(designs.id, targetId));

        return true;
      }
    } catch {
      return false;
    }
  }
}