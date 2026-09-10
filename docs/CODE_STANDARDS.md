# RepLog — Code Standards

Strict, mostly auto-enforced. If a rule here isn't caught by tooling, treat it as a
review blocker anyway.

## Tooling

| Command | Does |
|---|---|
| `npm run format` | Prettier — formats everything, sorts imports, sorts Tailwind classes |
| `npm run lint` / `lint:fix` | ESLint (type-aware on `src/**`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check` | all three — run before pushing |

**Pre-commit** (`husky` + `lint-staged`): auto-formats + lint-fixes staged files,
then runs `typecheck`. A type or lint error **blocks the commit** — don't
`--no-verify` around it.

Prettier: 80 cols, semicolons, double quotes, trailing commas. Not configurable
per-file. `docs/**` and `design/**` are excluded (hand-formatted).

## TypeScript

- `strict` + `noUncheckedIndexedAccess` + `noImplicitOverride` +
  `noFallthroughCasesInSwitch` + `verbatimModuleSyntax`.
- **No `any`** (ESLint error). Use `unknown` and narrow.
- Type-only imports are `import type { X }` / `import { type X }` — enforced.
- Validate every external boundary (form input, route params, API responses, env)
  with **Zod**. Don't trust a shape you didn't parse.
- Env: import `env` from `src/lib/env.ts`. Reading `process.env` anywhere else is
  an ESLint error.

## React / Next

- **Server Component by default.** Add `"use client"` only for interactivity
  (state, effects, event handlers, browser APIs) and push it to the **leaf** —
  a page stays a Server Component; the interactive bit is a small client child.
- Data fetching lives on the server (Server Components, Route Handlers). Never
  fetch app data from a client component's `useEffect`.
- Supabase: `@/lib/supabase/server` in Server Components / Route Handlers / Server
  Actions; `@/lib/supabase/client` only in client components; `@/lib/supabase/proxy`
  only in `src/proxy.ts`.

## Logic layering (web + a future mobile client)

Supabase's SDK *is* the API — a mobile app calls it directly, not through Next. So
share **code**, not an HTTP layer:

- **`src/lib/<feature>/`** — framework-free. No React, no Next. Prefer functions
  that **take a Supabase client as an argument** and return a normalized result
  (`{ ok: true; data } | { ok: false; code }`) — they never throw. This is what a
  future `packages/core` is carved from. See `src/lib/auth/operations.ts`.
- **`src/lib/validation/`** — Zod schemas shared by forms and any RPC payloads.
- **`src/server/<feature>/actions.ts`** (`"use server"`) — the **web** write path.
  Thin: parse input with a `lib/validation` schema → call a `lib/<feature>`
  function with the **server** client → `redirect()` / `revalidatePath()`. No
  logic in the action.
- **Multi-table atomic writes** (finish session → sets + PRs + streak) → a
  Postgres function in a migration, called `supabase.rpc(...)`. Same call from web
  and mobile; RLS + integrity enforced server-side.
- **Auth is the exception** — client-side-direct on every platform. No Server
  Action; the login component calls `lib/auth` ops with the browser client, then
  `router.replace()` + `router.refresh()`.
- `await` every promise (`no-floating-promises`). In a JSX handler that calls an
  async fn and ignores the result: `onClick={() => void doThing()}`.
- Hooks: stable deps; don't disable `exhaustive-deps` without a one-line why.

## Files & structure

```
src/
  app/<route>/            page.tsx (server) + route-local components (kebab-case)
  app/api/<x>/route.ts    route handlers
  components/ui/          shadcn primitives — restyle here, never fork upstream
  components/<domain>/    shared feature components (brand/, session/, …)
  lib/                    framework-free helpers, clients, pure logic
  lib/<feature>/          grouped logic: auth/, metrics/, supabase/, validation/, …
  server/<feature>/       "use server" Server Actions (web write path)
  hooks/                  shared hooks
  styles/                 tokens.css · typography.css · base.css
```

See **Logic layering** above for what goes in `lib/` vs `server/`.

- One primary export per file. Tiny co-located helpers (a local `Field`,
  `ErrorLine`) are fine in the same file.
- **Named exports everywhere** except Next's magic files (`page`, `layout`,
  `route`, `loading`, `error`, `not-found`, `middleware`/`proxy`, `default` config)
  which require `export default`.
- **No barrel files** (`index.ts` re-export hubs) — they cause cycles and defeat
  tree-shaking. `import/no-cycle` is an error.
- Imports: `@/…` across directories, `./…` for same-directory siblings. Prettier
  groups them: builtin → third-party → `@/` → relative, blank line between groups.

## Naming

| Thing | Style | Example |
|---|---|---|
| Files / folders | `kebab-case` | `login-form.tsx`, `sign-out-button.tsx` |
| Components / types | `PascalCase` | `LoginForm`, `type Mode` |
| Functions / vars | `camelCase` | `friendlyError`, `resendIn` |
| Hooks | `useX` | `useResendTimer` |
| Event handlers | `handleX` (impl) / `onX` (prop) | `handleSubmit`, `onValueChange` |
| Booleans | `isX` / `hasX` / `canX` | `isPending`, `hasSession` |
| Constants | `SCREAMING_SNAKE` for true consts | `DEFAULT_DEST` |

## Components

- Props typed with a `type` (not `interface`), inline or named. Always accept and
  forward `className` on anything visual.
- Class names via `cn(...)` — never string concatenation or template literals for
  conditional classes.
- Component variants via `cva` (see `components/ui/button.tsx`).
- No inline `style={{…}}` except for genuinely dynamic values (a computed
  `background: var(--color-heat-${i})`), and comment why.

## Styling

- Tailwind utilities only. **Use design tokens** — `bg-primary`, `text-h1`,
  `font-display`, `rounded-xl`, `border-border` — never raw colours or px.
- Type: pair a `font-*` class with a `text-*` class (`font-display text-h1`).
  Data numerals: `font-mono tabular-nums text-stat`.
- Arbitrary values (`text-[15px]`, `tracking-[-0.014em]`) only when no token fits,
  and keep them rare. Class order is Prettier's job — don't hand-sort.
- Mobile-first; the app is a centred ≤480px column (`DESIGN_SYSTEM.md §5`).

## Errors & async

- User-facing errors are short, friendly strings (`friendlyError()` pattern) —
  never a raw SDK message or a stack.
- Wrap every `await` on an external call (Supabase, fetch) in `try/catch`; set a
  `pending` flag in `finally`.
- Never swallow an error silently. If it's truly ignorable, `catch {/* why */}`.

## Accessibility

- Every input has a `<Label htmlFor>`. Icon-only controls have `aria-label`.
  Decorative icons get `aria-hidden`.
- Errors render in a `role="alert"` region.
- Semantic elements (`<main>`, `<nav>`, `<button>`, `<h1>`…), not `<div onClick>`.
- Focus states stay visible (`:focus-visible` ring in `base.css`) — don't remove.

## Comments & commits

- JSDoc on exported functions/components whose purpose isn't obvious from the
  name. Comments explain **why**, not what. No commented-out code.
- Commits: imperative subject ≤ ~65 chars, blank line, body explaining the *why*
  and any trade-offs. Group related changes; don't mix a refactor with a feature.
