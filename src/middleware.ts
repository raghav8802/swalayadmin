import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    if (path.startsWith("/_next")) {
        return NextResponse.next();
    }

    const isPublicPath = path === '/register' || path === '/signin' || path === '/verifyemail' || path === '/forgotpassword';

    const token = request.cookies.get('authtoken')?.value || '';
 
    // Allow API routes to bypass the token check
    if (path.startsWith('/api')) {
        return NextResponse.next();
    }

    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/signin',
        '/register',
        '/verifyemail',
        '/forgotpassword',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        '/:path*',
    ]
};
