import { NextResponse } from 'next/server';

// Codes promo valides (à remplacer par une table en base plus tard)
const PROMO_CODES: Record<string, { discount: number; type: 'percent' | 'fixed'; maxUses: number; uses: number }> = {
  'WELCOME10': { discount: 10, type: 'percent', maxUses: 100, uses: 0 },
  'HEAVIEXO20': { discount: 20, type: 'percent', maxUses: 50, uses: 0 },
  'BEAT5': { discount: 5, type: 'fixed', maxUses: 200, uses: 0 },
  'ARTIST': { discount: 15, type: 'percent', maxUses: 30, uses: 0 },
};

export async function POST(request: Request) {
  const { code } = await request.json();
  
  if (!code) {
    return NextResponse.json({ error: 'Code requis' }, { status: 400 });
  }

  const promo = PROMO_CODES[code.toUpperCase().trim()];

  if (!promo) {
    return NextResponse.json({ valid: false, error: 'Code promo invalide' });
  }

  if (promo.uses >= promo.maxUses) {
    return NextResponse.json({ valid: false, error: 'Code promo épuisé' });
  }

  return NextResponse.json({
    valid: true,
    discount: promo.discount,
    type: promo.type,
    message: promo.type === 'percent' 
      ? `-${promo.discount}% de réduction appliquée !` 
      : `-$${promo.discount} de réduction appliquée !`,
  });
}
