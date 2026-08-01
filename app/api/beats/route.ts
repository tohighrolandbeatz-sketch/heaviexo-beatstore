import { NextResponse } from 'next/server';
import { beatRepository } from '@/lib/repositories/beatRepository';

export const dynamic = 'force-dynamic';
const TIMEOUT = 8000;

let cachedBeats: any = null;
let lastFetch = 0;
const CACHE_TTL = 30000;

export async function GET() {
  const now = Date.now();
  if (cachedBeats && (now - lastFetch) < CACHE_TTL) {
    return NextResponse.json(cachedBeats, { status: 200, headers: { 'X-Cache': 'HIT' } });
  }

  try {
    const beats = await Promise.race([
      beatRepository.findAll(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT)),
    ]) as any[];

    cachedBeats = beats;
    lastFetch = now;
    return NextResponse.json(beats, { status: 200, headers: { 'X-Cache': 'MISS' } });
  } catch (error) {
    if (cachedBeats) {
      return NextResponse.json(cachedBeats, { status: 200, headers: { 'X-Cache': 'STALE' } });
    }
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, genre, mood, bpm, musical_key, description, seo_tags, price, licenses_json, cover_url, preview_url, master_url, stems_url, status } = body;
    if (!title || !slug || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const id = 'beat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const newBeat = await beatRepository.create({
      id, title, slug, genre: genre ?? '', mood: mood ?? '', bpm: Number(bpm ?? 0),
      musical_key: musical_key ?? '', description: description ?? '', seo_tags: seo_tags ?? '',
      price: Number(price), licenses_json: licenses_json ?? '[]', cover_url: cover_url ?? '',
      preview_url: preview_url ?? '', master_url: master_url ?? '', stems_url: stems_url ?? '',
      status: status ?? 'draft', featured: 0,
    });
    cachedBeats = null;
    return NextResponse.json(newBeat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
