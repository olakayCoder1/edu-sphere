import { NextRequest, NextResponse } from 'next/server';

const protectedPaths: string[] = [
  // '/dashboard',
  '/dashboard/admin',
  '/dashboard/tutor',
  '/dashboard/student',
];

const roleBasedPaths: Record<string, string[]> = {
  '/dashboard/admin': ['admin'],
  '/dashboard/tutor': ['tutor'],
  '/dashboard/student': ['student'],
};

const publicPaths: string[] = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/',
];

interface UserData {
  tokens: string;
  role?: string;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const userDataCookie = request.cookies.get('userData')?.value;
  let userData: UserData | null = null;

  try {
    userData = userDataCookie ? JSON.parse(userDataCookie) : null;
  } catch (e) {
    console.error('Error parsing user data cookie', e);
  }

  const isAuthenticated = !!userData?.tokens;
  const userRole = userData?.role;

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  console.log(
    `isAuthenticated: ${isAuthenticated}, userRole: ${userRole}, isProtectedPath:`
  )
  console.log(
    `${isProtectedPath}, pathname: ${pathname}, roleBasedPaths:`
  )

  if (isProtectedPath && !isAuthenticated) {
    const redirectUrl = new URL(`/auth/sign-in?redirectTo=${encodeURIComponent(pathname)}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  for (const [path, roles] of Object.entries(roleBasedPaths)) {
    if (pathname.startsWith(path) && !roles.includes(userRole || '')) {
      if (isAuthenticated) {
        const dashboardUrl = new URL(`/dashboard/${userRole}`, request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  if (publicPaths.includes(pathname) && isAuthenticated) {
    const dashboardUrl = new URL(`/dashboard/${userRole || ''}`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};
