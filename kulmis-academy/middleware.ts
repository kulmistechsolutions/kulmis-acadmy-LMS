import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/sign-in", "/sign-up", "/verify", "/api/health", "/api/verify"];
const authPrefix = "/api/auth";

function isPublic(pathname: string): boolean {
  if (pathname.startsWith("/verify")) return true;
  if (pathname.startsWith("/api/verify")) return true;
  if (pathname.startsWith("/api/health")) return true;
  if (pathname.startsWith(authPrefix)) return true;
  if (pathname === "/" || pathname === "/sign-in" || pathname === "/sign-up") return true;
  return false;
}

/** Lightweight check: only look for session cookie to keep Edge bundle under 1 MB. Real auth still runs in getServerSession() in pages. */
function hasSessionCookie(req: NextRequest): boolean {
  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ??
    req.cookies.get("__Secure-next-auth.session-token")?.value ??
    req.cookies.get("authjs.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value;
  return Boolean(sessionToken);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();
  if (!hasSessionCookie(req)) {
    const signIn = new URL("/sign-in", req.nextUrl.origin);
    signIn.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signIn);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?:on)?|ico|svg|png|webp)).*)", "/"],
};
