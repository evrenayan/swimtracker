import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected Routes Handling
  // If user is NOT logged in and tries to access protected pages
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');
  const isSignupPage = request.nextUrl.pathname.startsWith('/signup');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth'); // if you have auth callbacks
  const isHomePage = request.nextUrl.pathname === '/';

  // Define public paths that allow unauthenticated access
  // Adjust this list as needed
  // Define public paths that allow unauthenticated access
  // Adjust this list as needed
  // Allow homepage (landing page) for unauthenticated users
  if (!user && !isLoginPage && !isSignupPage && !isAuthRoute && !isHomePage) {
    // Redirect to login if trying to access other protected routes
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user IS logged in and tries to access login/signup pages, redirect to dashboard
  // NOTE: We allow authenticated users to view the landing page (isHomePage) without redirect
  if (user && (isLoginPage || isSignupPage)) {
    const url = request.nextUrl.clone();
    url.pathname = '/swimmers'; // Redirect to default dashboard page
    return NextResponse.redirect(url);
  }

  return response;
}
