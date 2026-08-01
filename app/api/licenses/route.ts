import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { licenses } from '@/app/config/schema';
import { asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
const TIMEOUT = 5000; // 5 secondes max

export async function GET() {
  try {
    const result = await Promise.race([
      db.select().from(licenses).orderBy(asc(licenses.price)),
      new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT)),
    ]) as any[];

    const data = result.map((l: any) => ({
      ...l,
      features: (() => { try { return JSON.parse(l.features || '[]'); } catch { return []; } })(),
    }));
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Licenses API error:', error.message);
    return NextResponse.json([], { status: 200 }); // Renvoie tableau vide au lieu d'erreur
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, price, description, features } = body;
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    const featuresStr = typeof features === 'string' ? features : JSON.stringify(features || []);

    await Promise.race([
      db.insert(licenses).values({
        id, name: name || '', price: price || 0, description: description || '', features: featuresStr,
        createdAt: new Date(), updatedAt: new Date(),
      }).onConflictDoUpdate({
        target: licenses.id,
        set: { name: name || '', price: price || 0, description: description || '', features: featuresStr, updatedAt: new Date() },
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT)),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 });
  }
}
