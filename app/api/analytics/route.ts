import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analyticsEvents } from '@/app/config/schema';
import { gte, and, eq, sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, beat_id, url, referrer, country, city, region, device, browser, amount } = body;

    if (!event_type) {
      return NextResponse.json({ success: false, error: 'event_type requis' }, { status: 400 });
    }

    await db.insert(analyticsEvents).values({
      eventType: event_type,
      beatId: beat_id || null,
      amount: amount || null,
      country: country || 'Bénin',
      city: city || 'Cotonou',
      region: region || 'Littoral',
      device: device || 'Desktop',
      browser: browser || 'Chrome',
      referer: referrer || 'Direct',
      url: url || '/',
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Erreur insertion analytics:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

// GET avec agrégation par période : /api/analytics?range=7j
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7j';

    const days = { '24h': 1, '7j': 7, '30j': 30, '12m': 365, 'all': 36500 }[range] ?? 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await db
      .select()
      .from(analyticsEvents)
      .where(gte(analyticsEvents.createdAt, since));

    // Agrégations calculées côté serveur
    const count = (type: string) => rows.filter(r => r.eventType === type).length;

    const ca = rows
      .filter(r => r.eventType === 'purchase')
      .reduce((sum, r) => sum + (parseFloat(r.amount || '0') || 0), 0);

    const uniqueVisitors = new Set(rows.filter(r => r.eventType === 'page_view').map(r => r.url)).size;

    const countryCounts: Record<string, number> = {};
    rows.forEach(r => {
      if (r.country) countryCounts[r.country] = (countryCounts[r.country] || 0) + 1;
    });
    const totalWithCountry = Object.values(countryCounts).reduce((a, b) => a + b, 0) || 1;
    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([country, n]) => ({ country, pct: Math.round((n / totalWithCountry) * 100) }));

    return NextResponse.json({
      success: true,
      data: {
        ca: ca.toFixed(2),
        ventes: count('purchase'),
        visiteurs: count('page_view'),
        visiteursUniques: uniqueVisitors,
        ecoutes: count('beat_play'),
        ecoutesCompletes: count('finish'),
        likes: count('favorite'),
        ajoutsPanier: count('add_to_cart'),
        tauxConversion: count('page_view') > 0 ? ((count('purchase') / count('page_view')) * 100).toFixed(2) : '0.00',
        topCountries,
      },
    });
  } catch (error) {
    console.error('Erreur lecture analytics:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}