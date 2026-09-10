import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";

import type { Database } from "./database.types";

/**
 * Supabase client for use in Client Components / browser code.
 * Reads the session from cookies set by the server.
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
