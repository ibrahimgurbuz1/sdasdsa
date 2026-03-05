import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  let response: NextResponse;

  // Admin routes (login hariç)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for auth cookie
    const authCookie = request.cookies.get('adminAuth');
    
    if (!authCookie) {
      // Redirect to login
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
  matcher: ['/admin/:path*'],
};
