import { NextRequest, NextResponse } from 'next/server';
import { commentRepository } from '@/lib/repositories/commentRepository';

// Stockage temporaire (en mémoire, se vide au redémarrage)
const ipTracker = new Map<string, Map<string, number>>();

export async function GET(request: NextRequest) {
  const beatId = request.nextUrl.searchParams.get('beatId');
  if (!beatId) return NextResponse.json({ error: 'beatId requis' }, { status: 400 });
  const comments = await commentRepository.findByBeatId(beatId);
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { beat_id, user_id, content } = body;
  
  if (!beat_id || !content) return NextResponse.json({ error: 'Champs requis' }, { status: 400 });
  if (content.length < 3) return NextResponse.json({ error: 'Commentaire trop court (min 3 caractères)' }, { status: 400 });
  if (content.length > 500) return NextResponse.json({ error: 'Commentaire trop long (max 500 caractères)' }, { status: 400 });

  // Récupérer l'IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

  // Vérifier le délai
  const now = Date.now();
  const beatTracker = ipTracker.get(beat_id) || new Map();
  const lastPost = beatTracker.get(ip);
  
  if (lastPost && now - lastPost < 300000) { // 5 minutes
    const minutesLeft = Math.ceil((300000 - (now - lastPost)) / 60000);
    return NextResponse.json({ error: `Veuillez attendre ${minutesLeft} minute(s) avant de reposter.` }, { status: 429 });
  }

  beatTracker.set(ip, now);
  ipTracker.set(beat_id, beatTracker);

  const comment = await commentRepository.create({
    id: 'comment_' + Date.now(),
    user_id: (user_id || 'anonymous').substring(0, 30),
    beat_id,
    content: content.substring(0, 500),
  });
  
  return NextResponse.json(comment, { status: 201 });
}