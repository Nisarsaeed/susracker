
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1) Skip middleware for public routes:
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  // 2) Check session cookie:
  const sessionCookie = request.cookies.get("session")?.value;
  if (!sessionCookie) {
    // Not logged in → redirect to /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3) Try to parse and verify loggedIn flag:
  let session;
  try {
    session = JSON.parse(sessionCookie);
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (!session.loggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4) All good—proceed:
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",             // the dashboard
    "/criminals/:path*", 
    "/alerts/:path*",
    "/settings/:path*",
  ],
};

