import { NextRequest, NextResponse } from 'next/server';
import { commentRepository } from '@/lib/repositories/commentRepository';

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
  const comment = await commentRepository.create({
    id: 'comment_' + Date.now(),
    user_id: user_id || 'anonymous',
    beat_id,
    content,
  });
  return NextResponse.json(comment, { status: 201 });
}