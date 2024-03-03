import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublicPath = path === "/login" || path === "/signup" || path === '/verifyemail';

  const token = req.cookies.get("token")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (path.startsWith('/profile') && !token) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
}

export const config = {
  matcher: ["/", "/profile/:path*", "/login", "/signup" , '/verifyemail', '/change-password'],
};
