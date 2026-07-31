import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT * FROM design_config LIMIT 1`);
    const row = result.rows?.[0];
    return NextResponse.json({
      branding: row ? {
        logo: row.logo,
        footerText: row.footer_text,
        copyright: row.copyright,
        whatsapp: row.whatsapp,
        social: row.social_links ? JSON.parse(row.social_links as string) : {},
      } : {}
    });
  } catch {
    return NextResponse.json({ branding: {} });
  }
}

export async function POST(request: Request) {
  const { branding } = await request.json();
  
  try {
    await db.execute(sql`
      INSERT INTO design_config (id, logo, footer_text, copyright, whatsapp, social_links, updated_at)
      VALUES ('default', ${branding.logo || ''}, ${branding.footerText || ''}, ${branding.copyright || ''}, ${branding.whatsapp || ''}, ${JSON.stringify(branding.social || {})}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        logo = EXCLUDED.logo,
        footer_text = EXCLUDED.footer_text,
        copyright = EXCLUDED.copyright,
        whatsapp = EXCLUDED.whatsapp,
        social_links = EXCLUDED.social_links,
        updated_at = NOW()
    `);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 });
  }
}
