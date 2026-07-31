import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger toutes les routes /admin
  if (pathname.startsWith('/admin')) {
    // Permettre l'accès à la page de login
    if (pathname === '/admin/login') return NextResponse.next();

    const authCookie = request.cookies.get('admin_auth');
    if (authCookie?.value !== 'heaviexo2026') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
