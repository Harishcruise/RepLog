<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# RepLog — Agent Guide

RepLog is a gym workout session tracker — personal use first, built to scale, a
future mobile client is in scope from day one. This file is the map: stack,
architecture, the patterns actually in use, and the workflow conventions this
repo runs on. The `docs/` files are the deeper reference for each area —
this file summarizes and points at them, it doesn't replace them.

| Doc | Covers |
|---|---|
| [`docs/SPEC.md`](docs/SPEC.md) | Feature scope, data model, build milestones |
| [`docs/CODE_STANDARDS.md`](docs/CODE_STANDARDS.md) | The authoritative, exhaustive coding-standards doc |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Full visual spec — colour, type, space, components |
| [`docs/UX.md`](docs/UX.md) | Route inventory, navigation model, flows |
| [`design/`](design/) | The Claude Design canvas — `.dc.html` artboards, visual source of truth |

## How we work together

Explicit, standing instruction from the user — not a default posture, binding
until they say otherwise.

- **Coding partner, not a code-vending machine.** Before implementing anything
  non-trivial — a new screen, a feature, a schema decision, a UI change that
  has no existing spec to follow exactly — propose the approach here and give
  an actual opinion (trade-offs, what you'd pick and why, what you're unsure
  about), then wait for a go-ahead. Don't just build it. Small, unambiguous
  fixes that clearly match an existing pattern (a typo, a bug with one obvious
  correct fix) don't need this pause.
- **Ask reasonable clarifying questions instead of guessing at intent** —
  especially whenever a screen or feature has no design canvas artboard or
  spec section to point at yet (see the coverage gaps noted in `SPEC.md`'s
  milestone list and `design/canvas.json`).
- **Design canvas first, for any UI work.** Check `design/*.dc.html` before
  writing component code. If the screen/element isn't there yet, say so
  explicitly and ask whether to design it together on the canvas first,
  rather than inventing a look from scratch (the floating "Add exercise"
  button, built ad hoc instead of matching `ActiveSession.dc.html`'s already-
  specified dashed-border style, is the concrete incident this rule exists
  to prevent).
- **Brainstorm each screen and feature before acting on it** — this applies
  per screen/feature as work reaches it, not just once at the start of a
  session. Reaching milestone 2 (Schema) or a new route in `UX.md` is a
  brainstorm checkpoint, not a green light to start writing code.

## Stack

Next.js 16 (App Router, Turbopack, RSC) + TypeScript · Tailwind CSS 4
(CSS-first `@theme`, no `tailwind.config.js`) · shadcn/ui ("new-york" style) ·
lucide-react · Supabase (Postgres + Auth + RLS) · framer-motion (page
transitions, drag-to-reorder) · Zod (every external-boundary validation) ·
Recharts and a Dexie/IndexedDB offline mirror are planned but not yet added
(see `docs/SPEC.md` milestones 8 and 13).

Single theme: **Obsidian & Volt**. No light mode, no theme toggle, no `.dark`
class, no `next-themes`. Mobile-first single responsive layout — a centred
column capped at `max-width: 480px` in the actual implementation (`max-w-sm`,
384px, is the convention every real screen uses today), full-bleed on phones,
desktop shows the same UI centred rather than a distinct desktop layout. The
**one** deliberate exception in the codebase is chrome that's meant to reach
the true screen edge on desktop (`BackLink` pinning to the viewport corner,
`SessionHeader` stretching full width like `TabHeader` does) — content itself
never gets a desktop-only layout.

## Architecture

```
src/
  app/<route>/            page.tsx (server) + route-local components (kebab-case)
  app/api/<x>/route.ts    route handlers
  components/ui/          shadcn primitives — restyle here, never fork upstream
  components/<domain>/    shared feature components (app-shell/, brand/, session/, reorder/, …)
  lib/                    framework-free helpers, clients, pure logic
  lib/<feature>/          grouped logic: auth/, validation/, supabase/, …
  server/<feature>/       "use server" Server Actions (web write path)
  hooks/                  shared hooks
  styles/                 tokens.css · typography.css · base.css
```

**Logic layering** (web today, a future mobile client shares the same core):
Supabase's SDK *is* the API, so share **code**, not an HTTP layer.
- `src/lib/<feature>/` — framework-free. No React, no Next. Functions take a
  Supabase client as an argument, return `{ ok: true; data } | { ok: false; code }`,
  never throw. See `src/lib/auth/operations.ts`.
- `src/lib/validation/` — Zod schemas shared by forms and any RPC payloads.
- `src/server/<feature>/actions.ts` (`"use server"`) — the web write path.
  Thin: parse with a `lib/validation` schema → call a `lib/<feature>` function
  with the server client → `redirect()` / `revalidatePath()`. No logic here.
- Multi-table atomic writes → a Postgres function via `supabase.rpc(...)`, not
  application-level transactions.
- **Auth is the exception** — client-side-direct on every platform: no Server
  Action, the component calls `lib/auth` ops with the browser client, then
  `router.replace()` + `router.refresh()`.

**Feature-screen pattern** — any non-trivial screen (a flow, a form with
steps, several modes) is built the same way. Reference: `src/app/login/`,
`src/app/app/workout/[id]/`.

```
app/<route>/
  page.tsx            Server Component — read data, gate, render the client entry
  use-<feature>.ts    the state machine + calls to lib/ ops. NO JSX. Returns a
                      controller object (export its type: FooController = ReturnType<typeof useFoo>)
  <feature>-form.tsx  thin orchestrator — picks which sub-view to render, ~30 lines
  <sub-view>.tsx      one concern each (~100–150 lines), takes { controller } or explicit props
  use-<small>.ts      a focused helper hook (a timer, a countdown)
```

Rules: logic leaves the JSX (goes in the `use-<feature>` hook); cross-view
state lives in the hook, not the URL or `sessionStorage`; local state that
only one sub-view uses stays in that sub-view; a screen file is one screen,
no `mode × step` matrix in a single file.

**Route groups**: `(tabs)` scopes `AppShell` (floating nav) + `TabHeader` to
just the 4 main tabs (Home/History/Exercises/Progress). Any pushed/immersive
screen (Profile, Body, `/app/workout/[id]`) lives **outside** `(tabs)`, gets
no floating nav/tab bar, and owns its own header/back-navigation instead. The
outer `app/app/layout.tsx` does the auth gate only — chrome belongs in
`(tabs)/layout.tsx`, not the outer layout (a floating-nav-leaking-onto-Profile
bug earlier in this project is exactly the mistake this split prevents).

## Coding standards (the essentials — `docs/CODE_STANDARDS.md` is exhaustive)

- `npm run check` (typecheck + lint + format:check) must pass before pushing;
  pre-commit hooks (husky + lint-staged) block a bad commit automatically —
  never `--no-verify` around a failure, fix the underlying issue.
- **No `any`.** `unknown` + narrow. Type-only imports are
  `import type { X }` / `import { type X }`, enforced by lint.
- Validate every external boundary (form input, route params, env) with Zod —
  never trust a shape you didn't parse. `env.ts` centralizes env access;
  reading `process.env` directly elsewhere is a lint error.
- Server Component by default; `"use client"` only for interactivity, pushed
  to the leaf.
- Props typed with `type`, not `interface`. Class names via `cn(...)`
  (`src/lib/utils.ts`), never string concatenation. Component variants via
  `cva`. No inline `style={{}}` except genuinely dynamic values, commented why.
- Tailwind utilities only, **use design tokens** (`bg-primary`, `text-h1`,
  `font-display`, `rounded-xl`, `border-border`) — never raw colours or px.
  Arbitrary values (`text-[15px]`) only when no token fits, kept rare.
- No barrel files (`index.ts` re-export hubs) — `import/no-cycle` is an error.
- Named exports everywhere except Next's magic files (`page`, `layout`,
  `route`, `default` config) which require `export default`.
- Naming: files/folders `kebab-case`, components/types `PascalCase`,
  functions/vars `camelCase`, hooks `useX`, booleans `isX`/`hasX`/`canX`.
- Comments explain **why**, not what — no restating what well-named code
  already says, no commented-out code.
- Accessibility: every input has a `<Label htmlFor>`, icon-only controls get
  `aria-label`, focus states stay visible (`:focus-visible` ring in
  `base.css` — never remove), semantic elements over `<div onClick>`.
- Don't add abstractions, error handling, or validation for scenarios that
  can't happen — trust internal code and framework guarantees, validate only
  at real boundaries. Three similar lines beat a premature abstraction.

## Patterns established in practice (not yet written up elsewhere)

- **Stub-data pattern.** Sessions/sets/exercises have no schema yet
  (`docs/SPEC.md` milestone 2). Screens that need that data use a
  `stub-<thing>.ts` file (e.g. `app/app/workout/[id]/stub-session.ts`)
  returning realistic placeholder data, called only from `page.tsx`. A
  one-line comment marks the future swap point. Never fake data inside a
  hook or component — the stub boundary stays at the server-component edge
  so swapping in a real Supabase fetch later touches one file.
- **shadcn CLI's known `cn` bug.** `npx shadcn@latest add <x>` reliably
  generates `import { cn } from "cn"` (a bogus npm package, not
  `@/lib/utils`) and un-quotes the file to single-quote/no-semicolon style.
  Every time: fix the import to `@/lib/utils`, reformat to the project's
  style, restyle the component to the design tokens (drop dark-mode variants
  — single theme), then `npm uninstall cn` if it landed in `package.json`.
  Hit and fixed for `dialog`, `alert-dialog`, `dropdown-menu`, `badge`,
  `table` — expect it on every future `shadcn add`.
- **Drag-to-reorder** is generic, not exercise-specific:
  `src/components/reorder/reorderable-list.tsx` exports `ReorderList`
  (wraps Framer Motion's `Reorder.Group`), `DraggableItem` (one row, owns
  its drag controls), and `DragHandle` (reads those controls from context,
  placed anywhere inside a `DraggableItem`). Drag is handle-only
  (`dragListener={false}` + `useDragControls`) so taps elsewhere on the row
  are never mistaken for a reorder gesture — and the handle needs
  `e.preventDefault()` in its `onPointerDown` plus `select-none` on the
  item, or a mouse drag that drifts onto sibling text falls back to native
  text selection instead of continuing the drag.
- **Radix DropdownMenu auto-focus.** Closing a Radix dropdown moves focus
  back to the trigger via a programmatic `.focus()` call, which browsers
  treat as keyboard-driven — so a plain tap-to-select leaves a
  `:focus-visible` ring sitting on the trigger. Fix: `onCloseAutoFocus={(e)
  => e.preventDefault()}` on `DropdownMenuContent` when the trigger is a
  small/icon-like control where that ring reads as a bug (see
  `components/session/set-type-picker.tsx`).
- **`overflow-x-auto` alone is a trap.** CSS: once one axis is set to
  something other than `visible`, the browser computes the other axis as
  `auto` too — so a container with only `overflow-x-auto` can pop a
  vertical scrollbar from a sub-pixel content-height change. Set both axes
  explicitly (`overflow-x-auto overflow-y-hidden`) on any scroll container
  that should only ever scroll one direction (see `components/ui/table.tsx`).
- **This project's `--radius` is 12px**, not Tailwind's default 8px
  (`docs/DESIGN_SYSTEM.md §4`). `rounded-lg` therefore resolves to 12px here
  — on a small square control that reads as near-circular instead of a
  rounded square. Check `tokens.css`'s radius scale before picking a
  `rounded-*` class for anything compact; `rounded-sm` = 8px in this
  project's scale, matching most of the design's small controls.
- **Don't guess a component's visual spec from a CSS class name alone** —
  grep whether it's actually *used* in the `.dc.html` design file first. A
  design file can carry dead CSS from a superseded pass (`.check.on`, a
  filled-square treatment, was never referenced by any element — the real
  completed-state look was `.done-check`, a small icon-only checkmark).
  Confirm usage (`grep 'class="foo'`, not just `grep '\.foo {'`) before
  matching a style in code.
- **Keep interactive elements' box size constant across states.** Sizing a
  control (e.g. a check/toggle button) differently for its two states makes
  it the tallest thing in its row for one state and not the other — any
  layout that sizes to content (a table row, a flex row with no fixed
  height) will visibly resize when the state flips. Vary the fill/border/
  icon inside a fixed-size box instead.
- **`Date.now()` / `new Date()` can't be called during render** — the
  `react-hooks/purity` lint rule flags it even in a Server Component or a
  prop expression (`startedAt={new Date(Date.now() - …)}` fails). Either
  compute it in a `useState(() => …)` lazy initializer (client) or a plain
  helper function in a separate module that the render call doesn't
  directly show `Date.now()` inside of (server) — see
  `app/app/workout/[id]/stub-session.ts`'s `getStubStartedAt()`.
- **Screen headers are sticky.** `TabHeader` (`components/app-shell/tab-header.tsx`)
  and `SessionHeader` (`app/app/workout/[id]/session-header.tsx`) both use
  `sticky top-0 z-20 bg-background` so the header stays pinned while its
  screen's content scrolls underneath. Apply the same treatment to any new
  screen header going forward — `sticky top-0`, a solid `bg-background` (or
  `bg-card`/whatever the header's actual surface is) so content doesn't show
  through while scrolled, and `z-20` to stay above page content but below
  `NavShell`'s `z-50` floating nav.

## Verification workflow

- No test suite yet — verification is `npm run check` (must be clean) plus
  driving the actual UI in the Browser pane before calling a UI change done.
- **Auth-gated routes** (`/app/*`) can't be reached without a real session in
  this environment. The established workaround: temporarily import the
  route-local component(s) into `src/app/dev/ui/page.tsx` (which is public),
  wire up a small stub-data demo, verify interactively (screenshots,
  `getBoundingClientRect()` / `getComputedStyle()` checks via
  `javascript_tool` for anything a screenshot can't prove — pixel widths,
  focus/selection state, computed CSS), then **remove the temp import and
  section before committing**. Confirm with `git diff --stat
  src/app/dev/ui/page.tsx` that it's back to no diff (or only the intended
  permanent change) before staging.
- A handful of shared components (`TabHeader`, `NavShell`, `RestTimer`,
  `SetTypePicker`, `Badge`, the reorder primitives) have **permanent** demo
  sections in `/dev/ui` — that's the living style-guide gallery. Route-local,
  screen-specific components (`ExerciseCard`, `SessionHeader`, …) stay
  temporary-only imports, removed each time.
- When testing responsive/desktop-width behaviour, `resize_window` a real
  pixel size and re-check with `getComputedStyle`/`getBoundingClientRect` —
  the Browser pane's screenshot can be visibly downscaled from the actual
  layout viewport at wide sizes, which reads as a false layout bug if you
  trust the screenshot's pixel coordinates directly instead of the reported
  coordinate frame.

## Design canvas workflow

Artboards are `.dc.html` files in `design/`, registered in
`design/canvas.json`, and synced into the single published payload file
`design/replog-design-system.html` (an ~11000-line file with a
`<script type="application/json" id="appifact-doc">` blob holding every
artboard's source as a JSON string value), published via the `Artifact`
tool to the existing canvas URL — **always pass the existing `url`**, never
publish without it (that creates a duplicate artifact).

**Critical, must be reapplied on every sync**: artboard files contain literal
`<script>` tags (e.g. `<script data-dc-script>`). JSON-encoding them does
**not** escape `</script`, so the browser's HTML tokenizer prematurely closes
the outer `<script type="application/json">` when the payload is embedded
raw. Fix, every time, after `json.dumps()`:

```python
payload = re.sub(r'</(script)', r'<\\/\1', payload, flags=re.I)
assert json.loads(payload) == original_data   # round-trip check before writing
```

Then verify: `head -c 60` shows `<meta charset="utf-8">` (no `<!doctype>`
wrapper — the Artifact tool auto-wraps), `tail -c 30` shows `</script>`, and
`grep -c "</script"` is exactly 2 (the payload's own closing tag + the final
app-bundle closing tag).

## Git & deploy

- Branches: `main` (production, Vercel's connected production branch),
  `develop` (active work happens here), `staging`. Work on `develop` unless
  told otherwise.
- Commit messages end with `Co-Authored-By: Claude Sonnet 5
  <noreply@anthropic.com>`; PR descriptions end with `🤖 Generated with
  [Claude Code](https://claude.com/claude-code)`.
- Vercel project **`rep-log`** (team `harishcruises-projects`) is linked to
  this GitHub repo. It needs `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` set for **Production, Preview, and
  Development** environments in the dashboard, or every build fails at the
  `env.ts` Zod parse with `invalid_env_var` — this has bitten every fresh
  environment set up so far. `SUPABASE_SERVICE_ROLE_KEY` is optional
  (needed once server-only Supabase calls exist) and must stay server-only.
