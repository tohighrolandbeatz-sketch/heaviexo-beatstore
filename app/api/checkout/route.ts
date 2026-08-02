import { NextResponse } from 'next/server';
import { userRepository } from '@/lib/repositories/userRepository';
import { saleRepository } from '@/lib/repositories/saleRepository';

export async function POST(request: Request) {
  try {
    const { customerName, customerEmail, items } = await request.json();

    if (!customerEmail || !items?.length) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Retrouve ou crée le client, identifié par son email (pas de mot de passe)
    let user = await userRepository.findByEmail(customerEmail);
    if (!user) {
      const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      user = await userRepository.create({ id, name: customerName || '', email: customerEmail, role: 'customer' });
    }

    const createdSales = [];
    for (const item of items) {
      // Seuls les beats génèrent une vente suivie (masters/stems) pour le moment
      if (item.itemType !== 'beat' || !item.beat?.id || !item.license?.id) continue;

      const saleId = 'sale_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      const sale = await saleRepository.create({
        id: saleId,
        user_id: user.id,
        beat_id: item.beat.id,
        license_id: item.license.id,
        amount: Number(item.price) || 0,
        status: 'PENDING',
      });
      createdSales.push(sale);
    }

    return NextResponse.json({ success: true, sales: createdSales });
  } catch (error) {
    console.error('Erreur création vente:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}