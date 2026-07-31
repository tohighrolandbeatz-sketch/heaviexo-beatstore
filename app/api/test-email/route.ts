import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const result = await resend.emails.send({
      from: 'HeavieXo Beats <onboarding@resend.dev>',
      to: 'tohighrolandbeatz@gmail.com',
      subject: 'Test Email - HeavieXo Beats',
      html: `
        <div style="background:#0F0D0C; color:#F4F0EB; padding:40px; font-family:sans-serif; text-align:center;">
          <h1 style="color:#C66B3D;">Email fonctionne !</h1>
          <p style="color:#888;">Si tu vois cet email, Resend est configuré correctement.</p>
        </div>
      `,
    });
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
