import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT * FROM design_config LIMIT 1`);
    const row = result.rows?.[0];
    return NextResponse.json({
      branding: row ? {
        siteName: row.site_name,
        description: row.description,
        logo: row.logo,
        favicon: row.favicon,
        footerText: row.footer_text,
        copyright: row.copyright,
        whatsapp: row.whatsapp,
        email: row.email,
        heroTitle: row.hero_title,
        heroSubtitle: row.hero_subtitle,
        heroBadge: row.hero_badge,
        social: row.social_links ? JSON.parse(row.social_links as string) : {},
        theme: row.theme_config ? JSON.parse(row.theme_config as string) : null,
      } : {}
    });
  } catch {
    return NextResponse.json({ branding: {} });
  }
}

export async function POST(request: Request) {
  const { branding, theme } = await request.json();
  
  try {
    const social = branding?.social ? JSON.stringify(branding.social) : '{}';
    const themeConfig = theme ? JSON.stringify(theme) : '{}';
    
    await db.execute(sql`
      INSERT INTO design_config (id, site_name, description, logo, favicon, footer_text, copyright, whatsapp, email, hero_title, hero_subtitle, hero_badge, social_links, theme_config, updated_at)
      VALUES ('default', ${branding?.siteName || ''}, ${branding?.description || ''}, ${branding?.logo || ''}, ${branding?.favicon || ''}, ${branding?.footerText || ''}, ${branding?.copyright || ''}, ${branding?.whatsapp || ''}, ${branding?.email || ''}, ${branding?.heroTitle || ''}, ${branding?.heroSubtitle || ''}, ${branding?.heroBadge || ''}, ${social}, ${themeConfig}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        site_name = EXCLUDED.site_name, description = EXCLUDED.description, logo = EXCLUDED.logo,
        favicon = EXCLUDED.favicon, footer_text = EXCLUDED.footer_text, copyright = EXCLUDED.copyright,
        whatsapp = EXCLUDED.whatsapp, email = EXCLUDED.email, hero_title = EXCLUDED.hero_title,
        hero_subtitle = EXCLUDED.hero_subtitle, hero_badge = EXCLUDED.hero_badge,
        social_links = EXCLUDED.social_links, theme_config = EXCLUDED.theme_config, updated_at = NOW()
    `);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 });
  }
}
