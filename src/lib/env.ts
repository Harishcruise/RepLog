import { z } from "zod";

/**
 * Validated environment. Import `env` from here — never read `process.env`
 * directly (an ESLint rule enforces this). Missing/invalid vars fail the build.
 *
 * `NEXT_PUBLIC_*` vars are statically inlined by Next at build time, so they must
 * be referenced by their full name (not via a dynamic key) to be replaced.
 */

/** Treat an unset OR empty-string var as absent. */
const optional = () =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v.length > 0 ? v : undefined))
    .optional();

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: optional(),
});

const parsed = schema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

if (!parsed.success) {
  const bad = parsed.error.issues
    .map((i) => `${i.path.join(".")} (${i.message})`)
    .join(", ");
  throw new Error(`Invalid environment: ${bad}. See .env.local.example.`);
}

export const env = parsed.data;
