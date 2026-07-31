import { NextResponse } from 'next/server';
import { otpStore } from '../send/route';

export async function POST(request: Request) {
  const { email, otp } = await request.json();
  if (!email || !otp) return NextResponse.json({ error: 'Champs requis' }, { status: 400 });

  const stored = otpStore.get(email);
  if (!stored) return NextResponse.json({ error: 'Aucun code trouvé' }, { status: 401 });
  if (Date.now() > stored.expires) {
    otpStore.delete(email);
    return NextResponse.json({ error: 'Code expiré' }, { status: 401 });
  }
  if (stored.code !== otp) return NextResponse.json({ error: 'Code incorrect' }, { status: 401 });

  otpStore.delete(email);

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_auth', 'heaviexo2026', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}