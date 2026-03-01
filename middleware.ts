import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { jwtVerify } from "jose";
import { logToSentinel } from "./lib/sentinel";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/verify-code",
  "/reset-password",
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/api/auth/")) return true;
  if (pathname.startsWith("/products")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname.includes(".")) return true; // static files
  return false;
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  // Centinela: Log interaction (ensure /api is logged, skip static files)
  if (pathname.startsWith("/api") || (!pathname.startsWith("/_next") && !pathname.startsWith("/favicon") && !pathname.includes("."))) {
    event.waitUntil(logToSentinel(request));
  }

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    // Role-based route protection
    if (pathname.startsWith("/buyer") && role !== "buyer") {
      return NextResponse.redirect(new URL("/seller", request.url));
    }
    if (pathname.startsWith("/seller") && role !== "seller") {
      return NextResponse.redirect(new URL("/buyer", request.url));
    }

    return NextResponse.next();
  } catch {
    // Invalid token - redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon-light-32x32.png|icon-dark-32x32.png|icon.svg|apple-icon.png).*)",
  ],
};
