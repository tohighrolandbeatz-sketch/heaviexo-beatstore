import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analyticsEvents, beats } from '@/app/config/schema';
import { count, eq, desc, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const totalVisits = await db.select({ count: count() }).from(analyticsEvents);
    const uniqueIps = await db.select({ count: count() }).from(analyticsEvents);
    const beatPlays = await db.select({ count: count() }).from(analyticsEvents).where(eq(analyticsEvents.eventType, 'beat_play'));
    const purchases = await db.select({ count: count() }).from(analyticsEvents).where(eq(analyticsEvents.eventType, 'purchase'));
    const addToCart = await db.select({ count: count() }).from(analyticsEvents).where(eq(analyticsEvents.eventType, 'add_to_cart'));

    const topBeats: any[] = [];
    const topCountries: any[] = [];
    const topReferrers: any[] = [];
    const recentEvents: any[] = [];

    try {
      const beatsData = await db.select({ title: beats.title, count: count() })
        .from(analyticsEvents)
        .innerJoin(beats, eq(analyticsEvents.beatId, beats.id))
        .where(eq(analyticsEvents.eventType, 'beat_play'))
        .groupBy(beats.title)
        .orderBy(desc(count()))
        .limit(5);
      topBeats.push(...beatsData);
    } catch (e) {}

    try {
      const countriesData = await db.select({ country: analyticsEvents.country, count: count() })
        .from(analyticsEvents).groupBy(analyticsEvents.country).orderBy(desc(count())).limit(5);
      topCountries.push(...countriesData);
    } catch (e) {}

    try {
      const referrersData = await db.select({ referrer: analyticsEvents.referer, count: count() })
        .from(analyticsEvents).groupBy(analyticsEvents.referer).orderBy(desc(count())).limit(5);
      topReferrers.push(...referrersData);
    } catch (e) {}

    try {
      const eventsData = await db.select().from(analyticsEvents).orderBy(desc(analyticsEvents.createdAt)).limit(10);
      recentEvents.push(...eventsData);
    } catch (e) {}

    return NextResponse.json({
      kpis: {
        totalVisits: totalVisits[0]?.count || 0,
        uniqueIps: uniqueIps[0]?.count || 0,
        beatPlays: beatPlays[0]?.count || 0,
        purchases: purchases[0]?.count || 0,
        addToCart: addToCart[0]?.count || 0,
      },
      topBeats,
      topCountries,
      topReferrers,
      recentEvents,
    });
  } catch (error) {
    console.error('Erreur analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
