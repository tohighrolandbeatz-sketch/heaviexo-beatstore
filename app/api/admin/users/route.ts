import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/app/config/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select().from(users).orderBy(desc(users.createdAt));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  
  try {
    await db.delete(users).where(eq(users.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 });
  }
}
