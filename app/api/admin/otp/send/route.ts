import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
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

  try {
    await resend.emails.send({
      from: 'HeavieXo Beats <onboarding@resend.dev>',
      to: email,
      subject: 'Code d\'accès Admin - HeavieXo Beats',
      html: `<div style="background:#0F0D0C;color:#F4F0EB;padding:40px;font-family:sans-serif;text-align:center;"><h1 style="color:#C66B3D;font-size:24px;">🔐 Accès Admin</h1><p style="font-size:14px;color:#888;">Votre code :</p><div style="background:#1A1311;border:1px solid #C66B3D;border-radius:12px;padding:20px;margin:20px 0;"><span style="font-size:36px;font-weight:bold;color:#C66B3D;letter-spacing:8px;">${code}</span></div><p style="font-size:12px;color:#666;">Expire dans 10 minutes.</p></div>`,
    });
  } catch (e) {
    console.log('Resend non disponible, fallback code visible');
  }

  return NextResponse.json({ success: true, code: process.env.NODE_ENV === 'production' ? undefined : code });
}

export { otpStore };