import { NextResponse } from 'next/server';
import { saleRepository } from '@/lib/repositories/saleRepository';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const sale = await saleRepository.findById(id);
    if (!sale) {
      return NextResponse.json({ error: 'Vente introuvable' }, { status: 404 });
    }
    await saleRepository.updateStatus(id, 'REJECTED');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}