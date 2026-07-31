import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = 'heaviexo2026';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_auth', 'heaviexo2026', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
}
