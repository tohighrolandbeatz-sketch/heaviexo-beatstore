import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
const TIMEOUT = 8000;

// Cache en mémoire (valable jusqu'au redéploiement)
let cachedPayload: any = null;
let lastFetch = 0;
const CACHE_TTL = 30000; // 30 secondes

export async function GET() {
  const now = Date.now();
  
  // Retourner le cache s'il est frais
  if (cachedPayload && (now - lastFetch) < CACHE_TTL) {
    return NextResponse.json(cachedPayload, {
      headers: { 'Cache-Control': 'public, max-age=30, s-maxage=30', 'X-Cache': 'HIT' },
    });
  }

  try {
    const result = await Promise.race([
      db.execute(sql`SELECT * FROM design_config LIMIT 1`),
      new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT)),
    ]) as any;

    const row = result?.rows?.[0];

    cachedPayload = {
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
        servicesConfig: (() => { try { return JSON.parse(row.services_config as string || '{}'); } catch { return {}; } })(),
        showFooterLogo: row.show_footer_logo !== false,
        social: row.social_links ? JSON.parse(row.social_links as string) : {},
        theme: row.theme_config ? JSON.parse(row.theme_config as string) : null,
      } : {}
    };
    lastFetch = now;

    return NextResponse.json(cachedPayload, {
      headers: { 'Cache-Control': 'public, max-age=30, s-maxage=30', 'X-Cache': 'MISS' },
    });
  } catch (error) {
    // Si timeout, renvoyer le vieux cache s'il existe
    if (cachedPayload) {
      return NextResponse.json(cachedPayload, {
        headers: { 'Cache-Control': 'public, max-age=10', 'X-Cache': 'STALE' },
      });
    }
    return NextResponse.json({ branding: {} }, { status: 200 });
  }
}

export async function POST(request: Request) {
  const { branding, theme } = await request.json();
  try {
    const social = branding?.social ? JSON.stringify(branding.social) : '{}';
    const themeConfig = theme ? JSON.stringify(theme) : '{}';
    const servicesConfig = branding?.servicesConfig ? JSON.stringify(branding.servicesConfig) : '{}';

    await db.execute(sql`
      INSERT INTO design_config (id, site_name, description, logo, favicon, footer_text, copyright, whatsapp, email, hero_title, hero_subtitle, hero_badge, spotify_playlist, services_config, show_footer_logo, social_links, theme_config, updated_at)
      VALUES ('default', ${branding?.siteName || ''}, ${branding?.description || ''}, ${branding?.logo || ''}, ${branding?.favicon || ''}, ${branding?.footerText || ''}, ${branding?.copyright || ''}, ${branding?.whatsapp || ''}, ${branding?.email || ''}, ${branding?.heroTitle || ''}, ${branding?.heroSubtitle || ''}, ${branding?.heroBadge || ''}, ${branding?.spotifyPlaylist || ''}, ${servicesConfig}, ${branding?.showFooterLogo !== false}, ${social}, ${themeConfig}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        site_name = EXCLUDED.site_name, description = EXCLUDED.description, logo = EXCLUDED.logo, favicon = EXCLUDED.favicon,
        footer_text = EXCLUDED.footer_text, copyright = EXCLUDED.copyright, whatsapp = EXCLUDED.whatsapp, email = EXCLUDED.email,
        hero_title = EXCLUDED.hero_title, hero_subtitle = EXCLUDED.hero_subtitle, hero_badge = EXCLUDED.hero_badge,
        spotify_playlist = EXCLUDED.spotify_playlist, services_config = EXCLUDED.services_config,
        show_footer_logo = EXCLUDED.show_footer_logo, social_links = EXCLUDED.social_links, theme_config = EXCLUDED.theme_config, updated_at = NOW()
    `);

    // Invalider le cache après sauvegarde
    cachedPayload = null;
    lastFetch = 0;

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 });
  }
}
