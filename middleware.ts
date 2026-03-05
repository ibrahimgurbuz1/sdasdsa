import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes (login hariç)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for auth cookie
    const authCookie = request.cookies.get('adminAuth');
    
    if (!authCookie) {
      // Redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
