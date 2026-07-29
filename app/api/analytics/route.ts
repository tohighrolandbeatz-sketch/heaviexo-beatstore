import { NextResponse } from 'next/server';

// Simulation de stockage en mémoire (ou à connecter à ta base de données Prisma / MongoDB / SQLite)
const analyticsEvents: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, ip, country, city, region, browser, os, device, referer, url } = body;

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event name is required' }, { status: 400 });
    }

    const eventData = {
      event,
      ip: ip || '127.0.0.1',
      country: country || 'Bénin',
      city: city || 'Cotonou',
      region: region || 'Littoral',
      browser: browser || 'Chrome',
      os: os || 'Mac OS',
      device: device || 'Desktop',
      referer: referer || 'Direct',
      url: url || '/',
      date: new Date().toISOString().split('T')[0],
      heure: new Date().toLocaleTimeString(),
    };

    analyticsEvents.push(eventData);

    return NextResponse.json({ success: true, data: eventData }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, total: analyticsEvents.length, events: analyticsEvents });
}