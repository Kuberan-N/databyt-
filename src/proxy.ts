import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Supabase v2 stores auth in localStorage, not cookies.
// Route protection is handled client-side in DashboardShell and admin layout.
// This proxy handles only static-asset exclusions and future server-side needs.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block direct access to internal Next.js paths (safety net)
  if (pathname.startsWith("/_next") || pathname.startsWith("/api/_")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
