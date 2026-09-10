import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

import type { Database } from "./database.types";

/**
 * Supabase client for use in Server Components, Route Handlers, and Server Actions.
 * Must be awaited because `cookies()` is async in Next.js 16.
 *
 * In a Server Component the cookie `set` calls are no-ops (components can't write
 * headers) — session refresh happens in `src/proxy.ts` instead. The try/catch keeps
 * that case quiet.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component — safe to ignore.
          }
        },
      },
    },
  );
}
