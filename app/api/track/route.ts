import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analyticsEvents } from '@/app/config/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

    await db.insert(analyticsEvents).values({
      id: 'event_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      eventType: body.eventType || 'page_view',
      beatId: body.beatId || null,
      ip,
      path: body.path || '/',
      referer: body.referer || 'direct',
      country: request.headers.get('x-vercel-ip-country') || null,
      city: request.headers.get('x-vercel-ip-city') || null,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
