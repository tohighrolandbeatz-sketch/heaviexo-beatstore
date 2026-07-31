import { NextResponse } from 'next/server';

const ADMIN_EMAILS = ['prodbyheaviexo@gmail.com', 'tohighrolandbeatz@gmail.com'];
const otpStore = new Map<string, { code: string; expires: number }>();

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 });

  if (!ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
    return NextResponse.json({ error: 'Email non autorisé' }, { status: 403 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { code, expires: Date.now() + 10 * 60 * 1000 });

  console.log(`🔐 OTP pour ${email}: ${code}`);

  return NextResponse.json({ success: true, code });
}

export { otpStore };
