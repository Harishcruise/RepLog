# `src/server/` — the web write path

Server Actions live here, one folder per feature:

```
server/<feature>/actions.ts    "use server"
```

Keep each action **thin**:

1. Parse its input with a schema from `src/lib/validation/`.
2. Call a framework-free function in `src/lib/<feature>/` with the **server**
   Supabase client (`@/lib/supabase/server`).
3. `redirect()` / `revalidatePath()`.

No business logic in the action itself — that lives in `src/lib/` so it stays
React/Next-free and portable to a future `packages/core`.

**Multi-table atomic writes** (e.g. finish session → sets + PRs + streak) belong
in a Postgres function in a migration, called via `supabase.rpc(...)` — shared
identically by web and any mobile client.

**Auth is the exception** — it's client-side-direct on every platform, so it has
no Server Action. See `src/lib/auth/`.
