import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  // Rutas protegidas
  const protectedRoutes = ['/dashboard', '/facturacion'];

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) && !token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configuración de las rutas protegidas
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/facturacion/:path*',
  ], 
};
