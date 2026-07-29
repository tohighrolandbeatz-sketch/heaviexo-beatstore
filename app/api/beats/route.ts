import { NextResponse } from 'next/server';
import { beatRepository } from '@/lib/repositories/beatRepository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const beats = beatRepository.findAll();
    return NextResponse.json(beats, { status: 200 });
  } catch (error) {
    console.error('Erreur GET /api/beats:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title, slug, genre, mood, bpm, musical_key, description,
      seo_tags, price, licenses_json, cover_url, preview_url, master_url, stems_url, status
    } = body;

    if (!title || !slug || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = 'beat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newBeat = beatRepository.create({
      id,
      title,
      slug,
      genre: genre || '',
      mood: mood || '',
      bpm: bpm || 0,
      musical_key: musical_key || '',
      description: description || '',
      seo_tags: seo_tags || '',
      price,
      licenses_json: licenses_json || '[]',
      cover_url,
      preview_url,
      master_url,
      stems_url,
      status: status || 'draft',
    });

    return NextResponse.json(newBeat, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/beats:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
  }
}