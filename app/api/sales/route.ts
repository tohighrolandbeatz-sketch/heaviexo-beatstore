import { NextResponse } from 'next/server';
import { saleRepository } from '@/lib/repositories/saleRepository';

export async function GET() {
  try {
    const result = await saleRepository.findAll();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}