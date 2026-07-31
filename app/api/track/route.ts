import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analyticsEvents } from '@/app/config/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await db.insert(analyticsEvents).values({
      eventType: body.eventType || 'page_view',
      beatId: body.beatId || null,
      referer: body.referer || 'direct',
      url: body.path || '/',
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
