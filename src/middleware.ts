import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

// Routes that strictly require authenticated user sessions
const STRICT_PROTECTED_ROUTES = [
  '/home',
  '/goals',
  '/messages',
  '/profile',
  '/settings',
  '/admin',
];

// Public routes accessible without authentication (SSR preview and crawler friendly)
const PUBLIC_OR_OPTIONAL_ROUTES = [
  '/',
  '/discover',
  '/communities',
  '/challenges',
  '/activity',
  '/onboarding',
];

// Routes only accessible when NOT authenticated
const AUTH_ROUTES = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Defensive fallback if Supabase credentials are missing at edge runtime
  if (!supabaseUrl || !supabaseKey) {
    // If not configured, allow public navigation in demo mode
    return NextResponse.next();
  }

  try {
    // Refresh the session (keeps auth tokens alive)
    const response = await updateSession(request);

    // Re-create a lightweight client to read the user from cookies
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {
            // Handled by updateSession
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isStrictlyProtected = STRICT_PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    );
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    // Redirect unauthenticated users away from strict protected routes
    if (isStrictlyProtected && !user) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect already-authenticated users away from login/signup
    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    return response;
  } catch (err) {
    console.error('Middleware auth check error:', err);
    // On unexpected edge errors, allow public routes or fallback gracefully
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets
     * - auth callback (must be reachable unauthenticated)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$|auth/callback).*)',
  ],
};

