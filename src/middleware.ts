import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect dashboard routes
  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  // Read the Supabase session cookie
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookieHeader = req.headers.get("cookie") ?? "";

  // Extract auth token from cookie (Supabase v2 stores it as sb-<ref>-auth-token)
  const tokenMatch = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/);
  const rawToken = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

  if (!rawToken) {
    // No session cookie — redirect to auth
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  try {
    const parsed = JSON.parse(rawToken);
    const accessToken = parsed?.access_token ?? parsed?.[0]?.access_token ?? null;

    if (!accessToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }

    // Verify token with Supabase
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
