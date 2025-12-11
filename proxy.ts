import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/signup'];

export async function proxy(request: NextRequest) {
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
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    // Remove maxAge and expires to make it a session cookie
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { maxAge, expires, ...sessionOptions } = options;

                    request.cookies.set({
                        name,
                        value,
                        ...sessionOptions,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...sessionOptions,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    const {
        data: { session },
    } = await supabase.auth.getSession();

    const { pathname } = request.nextUrl;

    // Check if the route is public
    const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // If trying to access protected route without authentication, redirect to login
    if (!isPublicRoute && !session) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If authenticated and trying to access login/signup, redirect to swimmers
    if (session && (pathname === '/login' || pathname === '/signup')) {
        const swimmersUrl = new URL('/swimmers', request.url);
        return NextResponse.redirect(swimmersUrl);
    }

    return response;
}

// Configure which routes the proxy should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
