import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export default function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/' || path === '/login' || path === '/forgot-password';
  const token = cookies().get('adminToken')?.value;

  // If it's a public path and user is logged in, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If it's a protected path and user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/login',
    '/forgot-password',
  ],
};