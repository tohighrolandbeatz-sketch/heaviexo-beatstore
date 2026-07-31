import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT * FROM design_config LIMIT 1`);
    const row = result.rows?.[0];

    const payload = {
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
        spotifyPlaylist: row.spotify_playlist || '',
        showFooterLogo: row.show_footer_logo !== false,
        social: row.social_links ? JSON.parse(row.social_links as string) : {},
        theme: row.theme_config ? JSON.parse(row.theme_config as string) : null,
      } : {}
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('GET /api/design error:', error);
    return NextResponse.json({ branding: {} }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { branding, theme } = await request.json();

  try {
    const social = branding?.social ? JSON.stringify(branding.social) : '{}';
    const themeConfig = theme ? JSON.stringify(theme) : '{}';

    await db.execute(sql`
      INSERT INTO design_config (
        id, site_name, description, logo, favicon, footer_text, copyright,
        whatsapp, email, hero_title, hero_subtitle, hero_badge, spotify_playlist,
        show_footer_logo, social_links, theme_config, updated_at
      )
      VALUES (
        'default', ${branding?.siteName || ''}, ${branding?.description || ''},
        ${branding?.logo || ''}, ${branding?.favicon || ''}, ${branding?.footerText || ''},
        ${branding?.copyright || ''}, ${branding?.whatsapp || ''}, ${branding?.email || ''},
        ${branding?.heroTitle || ''}, ${branding?.heroSubtitle || ''}, ${branding?.heroBadge || ''},
        ${branding?.spotifyPlaylist || ''},
        ${branding?.showFooterLogo !== false}, ${social}, ${themeConfig}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        site_name = EXCLUDED.site_name,
        description = EXCLUDED.description,
        logo = EXCLUDED.logo,
        favicon = EXCLUDED.favicon,
        footer_text = EXCLUDED.footer_text,
        copyright = EXCLUDED.copyright,
        whatsapp = EXCLUDED.whatsapp,
        email = EXCLUDED.email,
        hero_title = EXCLUDED.hero_title,
        hero_subtitle = EXCLUDED.hero_subtitle,
        hero_badge = EXCLUDED.hero_badge,
        spotify_playlist = EXCLUDED.spotify_playlist,
        show_footer_logo = EXCLUDED.show_footer_logo,
        social_links = EXCLUDED.social_links,
        theme_config = EXCLUDED.theme_config,
        updated_at = NOW()
    `);

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('POST /api/design error:', error);
    return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 });
  }
}