import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";

import type { Database } from "./database.types";

/**
 * Refreshes the Supabase auth session on every request and keeps the auth
 * cookies in sync between the browser and the server. Called from `src/proxy.ts`.
 *
 * Returns the `NextResponse` that must be returned from the proxy so the
 * refreshed cookies reach the browser.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // IMPORTANT: do not run code between createServerClient and getUser() — it can
  // cause hard-to-debug logout bugs (see @supabase/ssr docs).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate the app behind auth. Public paths: auth pages, the marketing root.
  const { pathname } = request.nextUrl;
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    // component gallery — dev only; guarded to non-production below
    (pathname.startsWith("/dev") && env.NODE_ENV !== "production");

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
