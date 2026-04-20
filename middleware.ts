import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // If env vars aren't configured yet, pass all traffic through
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — keeps access tokens alive
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── /dashboard — must be logged in AND email-verified ──────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (!user.email_confirmed_at) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/verify-email";
      return NextResponse.redirect(url);
    }
  }

  // ── /admin — must be logged in AND match ADMIN_EMAIL env var ────────────
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ── /api/requests — must be logged in + verified ────────────────────────
  if (pathname.startsWith("/api/requests")) {
    if (!user || !user.email_confirmed_at) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // ── /api/admin — must be admin ──────────────────────────────────────────
  if (pathname.startsWith("/api/admin")) {
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/requests/:path*",
    "/api/admin/:path*",
  ],
};
