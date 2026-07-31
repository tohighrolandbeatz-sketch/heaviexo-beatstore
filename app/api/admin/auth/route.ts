import { NextResponse } from 'next/server';

const STEP1_SECRET = 'Djibril2001';
const STEP2_SECRET = 'Moony8401';
const otpStore = new Map<string, { code: string; expires: number }>();

export async function POST(request: Request) {
  const { step, identifier, code } = await request.json();

  if (step === 1) {
    if (identifier !== STEP1_SECRET) {
      return NextResponse.json({ error: 'Identifiant incorrect' }, { status: 401 });
    }
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set('admin', { code: generatedCode, expires: Date.now() + 5 * 60 * 1000 });
    return NextResponse.json({ success: true, code: generatedCode });
  }

  if (step === 2) {
    const stored = otpStore.get('admin');
    if (!stored || Date.now() > stored.expires) {
      otpStore.delete('admin');
      return NextResponse.json({ error: 'Code expiré' }, { status: 401 });
    }
    if (stored.code !== code) {
      return NextResponse.json({ error: 'Code incorrect' }, { status: 401 });
    }
    if (identifier !== STEP2_SECRET) {
      return NextResponse.json({ error: 'Second identifiant incorrect' }, { status: 401 });
    }
    otpStore.delete('admin');
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_auth', 'heaviexo2026', {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/',
    });
    return response;
  }

  return NextResponse.json({ error: 'Étape invalide' }, { status: 400 });
}
