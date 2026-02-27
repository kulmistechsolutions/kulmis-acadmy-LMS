import { auth } from "@/auth";

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

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (isPublic(pathname)) return;
  if (!req.auth) {
    const signIn = new URL("/sign-in", req.nextUrl.origin);
    signIn.searchParams.set("callbackUrl", pathname);
    return Response.redirect(signIn);
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?:on)?|ico|svg|png|webp)).*)", "/"],
};
