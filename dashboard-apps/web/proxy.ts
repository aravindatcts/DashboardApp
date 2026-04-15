import { NextRequest } from 'next/server';
import { authMiddleware } from '@descope/nextjs-sdk/server';

const descopeAuth = authMiddleware({
  projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID!,
  redirectUrl: '/login',
  publicRoutes: ['/login'],
});

export function proxy(request: NextRequest) {
  return descopeAuth(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)'],
};
