import { neon } from '@neondatabase/serverless';

export type AnalyticsEventType = 'page_view' | 'beat_play' | 'finish' | 'favorite' | 'add_to_cart' | 'purchase';

export type AnalyticsEvent = {
  eventType: AnalyticsEventType;
  beatId: string | null;
  ip: string | null;
  country: string | null;
  city: string | null;
  device: string;
  browser: string;
  referrer: string | null;
  path: string;
};

type QueryRow = Record<string, unknown>;

let schemaPromise: Promise<void> | undefined;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to store Analytics data.');
  }

  return neon(databaseUrl);
}

async function ensureSchema() {
  if (!schemaPromise) {
    const sql = getSql();
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id UUID PRIMARY KEY,
          event_type TEXT NOT NULL,
          beat_id TEXT,
          ip TEXT,
          country TEXT,
          city TEXT,
          device TEXT NOT NULL,
          browser TEXT NOT NULL,
          referrer TEXT,
          path TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS analytics_events_event_type_idx ON analytics_events(event_type)`;
      await sql`CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON analytics_events(created_at DESC)`;
      await sql`CREATE INDEX IF NOT EXISTS analytics_events_beat_id_idx ON analytics_events(beat_id)`;
    })().catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }

  await schemaPromise;
}

const toCount = (row: QueryRow | undefined) => Number(row?.count ?? 0);
const toRanked = (rows: QueryRow[]) => rows.map((row) => ({ name: typeof row.name === 'string' ? row.name : 'Inconnu', count: toCount(row) }));

export async function recordAnalyticsEvent(event: AnalyticsEvent) {
  await ensureSchema();
  const sql = getSql();

  await sql`
    INSERT INTO analytics_events
      (id, event_type, beat_id, ip, country, city, device, browser, referrer, path)
    VALUES
      (gen_random_uuid(), ${event.eventType}, ${event.beatId}, ${event.ip}, ${event.country}, ${event.city}, ${event.device}, ${event.browser}, ${event.referrer}, ${event.path})
  `;
}

export async function getAnalyticsDashboard() {
  await ensureSchema();
  const sql = getSql();

  const [visitors, uniqueVisitors, plays, finishes, favorites, cartAdds, purchases, countries, cities, devices, trafficSources, topBeats] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM analytics_events WHERE event_type = 'page_view'`,
    sql`SELECT COUNT(DISTINCT ip)::int AS count FROM analytics_events WHERE ip IS NOT NULL AND ip <> ''`,
    sql`SELECT COUNT(*)::int AS count FROM analytics_events WHERE event_type = 'beat_play'`,
    sql`SELECT COUNT(*)::int AS count FROM analytics_events WHERE event_type = 'finish'`,
    sql`SELECT COUNT(*)::int AS count FROM analytics_events WHERE event_type = 'favorite'`,
    sql`SELECT COUNT(*)::int AS count FROM analytics_events WHERE event_type = 'add_to_cart'`,
    sql`SELECT COUNT(*)::int AS count FROM analytics_events WHERE event_type = 'purchase'`,
    sql`SELECT country AS name, COUNT(*)::int AS count FROM analytics_events WHERE country IS NOT NULL GROUP BY country ORDER BY count DESC LIMIT 5`,
    sql`SELECT city AS name, COUNT(*)::int AS count FROM analytics_events WHERE city IS NOT NULL GROUP BY city ORDER BY count DESC LIMIT 5`,
    sql`SELECT device AS name, COUNT(*)::int AS count FROM analytics_events GROUP BY device ORDER BY count DESC`,
    sql`SELECT referrer AS name, COUNT(*)::int AS count FROM analytics_events WHERE referrer IS NOT NULL GROUP BY referrer ORDER BY count DESC LIMIT 5`,
    sql`SELECT COALESCE(beat_id, 'Beat inconnu') AS name, COUNT(*)::int AS count FROM analytics_events WHERE event_type = 'beat_play' GROUP BY beat_id ORDER BY count DESC LIMIT 5`,
  ]);

  const totalPurchases = toCount(purchases[0]);
  const totalVisitors = toCount(uniqueVisitors[0]);

  return {
    visitors: toCount(visitors[0]),
    uniqueVisitors: totalVisitors,
    plays: toCount(plays[0]),
    finishes: toCount(finishes[0]),
    favorites: toCount(favorites[0]),
    cartAdds: toCount(cartAdds[0]),
    purchases: totalPurchases,
    conversionRate: totalVisitors ? ((totalPurchases / totalVisitors) * 100).toFixed(2) : '0.00',
    countries: toRanked(countries),
    cities: toRanked(cities),
    devices: toRanked(devices),
    trafficSources: toRanked(trafficSources),
    topBeats: toRanked(topBeats),
  };
}
