import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments } from '@/app/config/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select().from(comments).orderBy(desc(comments.createdAt));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
