import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { beats } from '@/app/config/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { mode, beatId } = await request.json();
    
    // Reset all featured to 0
    await db.update(beats).set({ featured: 0 } as any);
    
    if (mode === 'manual' && beatId) {
      await db.update(beats).set({ featured: 1 } as any).where(eq(beats.id, beatId));
    } else {
      // Auto : dernier beat créé
      const last = await db.select({ id: beats.id }).from(beats).orderBy(sql`created_at DESC`).limit(1);
      if (last[0]) {
        await db.update(beats).set({ featured: 1 } as any).where(eq(beats.id, last[0].id));
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
