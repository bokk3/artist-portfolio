import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify session validity
    const payload = await decrypt(session);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect /login to /admin if already logged in
  if (request.nextUrl.pathname === "/login" && session) {
    const payload = await decrypt(session);
    if (payload) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
