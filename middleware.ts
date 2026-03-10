import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSessionTokenEdge } from '@/lib/adminAuthEdge';

const ADMIN_AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'dev-admin-secret-change-me';

function isProtectedApiRoute(pathname: string, method: string): boolean {
  const alwaysProtected = [
    '/api/admin/dashboard',
    '/api/customers',
    '/api/finance',
  ];

  if (alwaysProtected.includes(pathname)) {
    return true;
  }

  const mutationProtected = [
    '/api/settings',
    '/api/staff',
    '/api/services',
    '/api/inventory',
    '/api/campaigns',
    '/api/gallery',
    '/api/appointments',
  ];

  if (mutationProtected.includes(pathname) && method !== 'GET' && method !== 'POST') {
    return true;
  }

  if (pathname === '/api/settings' && method !== 'GET') {
    return true;
  }

  if (pathname === '/api/staff' && method !== 'GET') {
    return true;
  }

  if (pathname === '/api/services' && method !== 'GET') {
    return true;
  }

  if (pathname === '/api/inventory' && method !== 'GET') {
    return true;
  }

  if (pathname === '/api/campaigns' && method !== 'GET') {
    return true;
  }

  if (pathname === '/api/gallery' && method !== 'GET') {
    return true;
  }

  if (pathname === '/api/appointments' && method === 'PATCH') {
    return true;
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  
  let response: NextResponse;
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isProtectedApi = pathname.startsWith('/api') && isProtectedApiRoute(pathname, method);
  const needsAdminAuth = isAdminPage || isProtectedApi;

  if (needsAdminAuth) {
    const token = request.cookies.get('adminAuth')?.value;
    const session = await verifyAdminSessionTokenEdge(token, ADMIN_AUTH_SECRET);

    if (!session) {
      if (isProtectedApi) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
      }

      const loginUrl = new URL('/admin/login', request.url);
      response = NextResponse.redirect(loginUrl);
    } else {
      response = NextResponse.next();
    }
  } else {
    response = NextResponse.next();
  }

  // Security Headers
  const headers = response.headers;

  // Content Security Policy (CSP)
  headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://demir-beauty.vercel.app https://*.vercel.app https://*.neon.tech; " +
    "frame-ancestors 'none';"
  );

  // Strict Transport Security (HTTPS only)
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // XSS Protection
  headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy (formerly Feature-Policy)
  headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
