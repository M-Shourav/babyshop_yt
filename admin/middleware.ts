import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const currentPath = request.nextUrl.pathname;

  // Protected routes: require login
  const protectRoutes = ["/", "/user", "/product"];

  const isProtect = protectRoutes.some(
    (route) => currentPath === route || currentPath.startsWith(`${route}/`)
  );

  // Public routes that should NOT be accessible if logged in
  const restrictedAuthRoutes = ["/login", "/signup"];
  const isRestrictedAuthRoute = restrictedAuthRoutes.includes(currentPath);

  // If visiting protected route without token → redirect to login
  if (isProtect && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If visiting login/signup while already logged in → redirect to home or dashboard
  if (isRestrictedAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/user/:path*", "/product/:path*", "/login", "/signup"],
};
