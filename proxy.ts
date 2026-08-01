import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_VALUE = 'heaviexo2026';

// Routes API toujours réservées à l'admin, quelle que soit la méthode HTTP
const ALWAYS_PROTECTED_API_PREFIXES = [
  '/api/sales',
  '/api/upload',
  '/api/blob/delete',
  '/api/featured',
];

function requiresAdminAuth(pathname: string, method: string): boolean {
  // Toute écriture (POST/PATCH/DELETE/PUT) sur /api/beats ou /api/design est réservée à l'admin.
  // Les GET restent publics (nécessaires pour afficher le site), la donnée sensible
  // est filtrée directement dans la route elle-même.
  if ((pathname.startsWith('/api/beats') || pathname.startsWith('/api/design')) && method !== 'GET') {
    return true;
  }
  return ALWAYS_PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = request.cookies.get('admin_auth');
  const isAuthenticated = auth?.value === ADMIN_COOKIE_VALUE;

  // Protection des pages admin (déjà existante)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protection des routes API sensibles
  if (pathname.startsWith('/api') && requiresAdminAuth(pathname, request.method)) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};