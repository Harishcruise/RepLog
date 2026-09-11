# RepLog — Design System

Status: draft for review
Companion to [`SPEC.md`](SPEC.md) and [`UX.md`](UX.md).
Visual reference: the Claude Design canvas in [`../design/`](../design/) (Colour, Typography, Space/Radius/Motion, Components artboards) — the single visual source of truth, kept in sync with this doc. (An earlier Figma exploration exists but is no longer maintained.)
Implementation target: Tailwind CSS 4 (CSS-first `@theme`) + shadcn/ui + Recharts.

---

## 1. Principles

1. **Thumb-first.** Everything reachable one-handed. Primary actions in the bottom
   third. Minimum 44px hit targets, 48px+ for anything used mid-set.
2. **Numbers are the interface.** Weight, reps, volume, 1RM. Give them size,
   weight, and alignment. Chrome recedes; data leads.
3. **Two taps to log a set.** Speed beats richness. Defaults pre-filled from last
   time. No modal between the user and a completed set.
4. **One theme.** A single **Obsidian & Volt** theme — no light mode, no toggle.
   Designed for a dim gym and an evening couch, and committed to fully.
5. **Progress is the emotion.** The one moment we celebrate is a PR. Volt green is
   reserved for "you moved forward" — primary actions, success, and personal records.
6. **Calm by default, loud on achievement.** No gradients, no motion for its own
   sake. Colour spikes only where it means something.

---

## 2. Colour

Single theme — **Obsidian & Volt**. No light mode, no theme toggle. OKLCH
throughout; values are starting points, tune against a real screen. Token names
follow the shadcn/ui contract so components map 1:1.

### 2.1 Brand — Volt

| Token | Value | Meaning |
|---|---|---|
| `--primary` | `oklch(0.82 0.17 137)` | primary action, success, PR highlight |
| `--primary-foreground` | `oklch(0.18 0.04 137)` | text/icon on volt — near-black green |
| `--primary-hover` | `oklch(0.86 0.16 137)` | hover / pressed on primary surfaces |
| `--primary-subtle` | `oklch(0.30 0.06 141)` | volt-tinted fill: completed set-row wash, selected chip |
| `--ring` | `= --primary` | focus ring, 2px + 2px offset |

Volt is the **only** identity colour. It carries primary actions, success
confirmations, and the PR moment (which also gets a brighter glow + trophy icon).
Nothing else in the app is green. Semantic warning/destructive stay separate
(§2.3) so meaning is never colour-alone — a warmup has a **W**, a failed set a
label, RPE shows the number.

Prefer volt as a **fill with dark text**. Volt as text reads fine on the obsidian
ground (high contrast); never put volt text on a light surface.

### 2.2 Neutrals & surfaces — warm obsidian ramp

Warm near-black, hue ~150 at minimal chroma. Raise elevation by **lightening the
surface one step + a 1px translucent border**; shadows barely read on obsidian, so
don't lean on them. Ramp lifted after on-screen review (2026-09-07) — the original
`0.150 / 0.195 / 0.230` steps read as one flat black; these give a visible
`background → card` step without a border.

| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.165 0.007 150)` | page plane |
| `--foreground` | `oklch(0.950 0.008 150)` | primary text — warm white |
| `--card` | `oklch(0.228 0.009 152)` | raised surface — cards, sheets |
| `--card-foreground` | `= --foreground` | |
| `--popover` | `oklch(0.268 0.010 152)` | menus, tooltips, timer sheet |
| `--popover-foreground` | `= --foreground` | |
| `--muted` | `oklch(0.300 0.011 152)` | input fills, inert chips, table zebra |
| `--muted-foreground` | `oklch(0.665 0.012 150)` | captions, "last time" line, axis labels |
| `--secondary` | `oklch(0.300 0.011 152)` | secondary button fill |
| `--secondary-foreground` | `oklch(0.950 0.008 150)` | text on secondary |
| `--accent` | `oklch(0.310 0.055 141)` | volt-tinted hover wash on ghost / menu items |
| `--accent-foreground` | `oklch(0.860 0.150 137)` | text on `--accent` |
| `--border` | `oklch(1 0 0 / 10%)` | hairline dividers, card edges |
| `--border-strong` | `oklch(1 0 0 / 16%)` | pressed edges, timer-pill ring |
| `--input` | `oklch(1 0 0 / 14%)` | input borders |

### 2.3 Semantic (fixed — never themed, always icon + label)

| Token | Value | Use |
|---|---|---|
| `--success` | `oklch(0.80 0.16 148)` | confirmations where volt-primary would be ambiguous — otherwise just use `--primary` |
| `--warning` | `oklch(0.80 0.13 78)` | RPE ≥ 9, approaching MRV, unsynced-offline banner |
| `--destructive` | `oklch(0.64 0.19 25)` | delete, discard session, failed-set marker |
| `--destructive-foreground` | `oklch(0.99 0 0)` | text on destructive |

For **charts**, use the data-viz status palette so app and charts agree:
good `#0ca30c` · warning `#fab219` · serious `#ec835a` · critical `#d03b3b`
— each shipped with an icon + label, never colour-alone.

### 2.4 Data-viz palette

Categorical — the validated reference order, stepped for a dark surface. Mapped to
`--chart-1..8`:

| Slot | Value | | Slot | Value |
|---|---|---|---|---|
| `--chart-1` | `#3987e5` | | `--chart-5` | `#d55181` |
| `--chart-2` | `#d95926` | | `--chart-6` | `#008300` |
| `--chart-3` | `#199e70` | | `--chart-7` | `#9085e9` |
| `--chart-4` | `#c98500` | | `--chart-8` | `#e66767` |

Rules (non-negotiable): assign in fixed order, never cycled; **one y-axis ever**
(est. 1RM and volume are separate cards, not dual-axis); colour follows the
entity, not its rank; ≥2 series always gets a legend, ≤4 also direct-labelled; a
table view always exists; hover crosshair+tooltip on by default. `--chart-3`
(aqua-green) sits near volt — it only ever appears as a labelled chart series,
never beside a volt primary control, so context disambiguates.

**Muscle heatmap ramp** — single-hue volt, so "more volume = more RepLog green."
6 ordinal steps; step 0 recedes toward the surface.

| Step | Value |
|---|---|
| 0 (≈none) | `oklch(0.240 0.030 145)` |
| 1 | `oklch(0.380 0.080 141)` |
| 2 | `oklch(0.520 0.130 139)` |
| 3 | `oklch(0.650 0.160 138)` |
| 4 | `oklch(0.780 0.170 137)` |
| 5 (max) | `oklch(0.870 0.170 136)` |

> **TODO before building any chart:** run the validator, don't eyeball.
> `node scripts/validate_palette.js "#3987e5,#d95926,#199e70,#c98500,#d55181,#008300,#9085e9,#e66767" --mode dark --surface "#181a17"`
> and the heatmap ramp with `--ordinal`. Fix any FAIL before implementation.
> (Script lives in the dataviz skill.)

Chart chrome: gridlines `oklch(1 0 0 / 8%)`; axis/label ink `--muted-foreground`;
marks thin, 2px lines, 4px rounded data-ends on the baseline, ≥8px markers, 2px
surface gap between fills.

---

## 3. Typography

Three roles, all Google Fonts — add via `next/font/google` (no manual install):

- **Space Grotesk** — screen titles, section headers, buttons, chips, table headers.
  Weights 500 / 600. Tighten tracking at title sizes. Fallback `system-ui, sans-serif`.
- **Geist** — body copy, all inputs, captions, helper text, exercise names.
  Weights 400 / 500 / 600. Already wired via `next/font`. Fallback
  `system-ui, -apple-system, "Segoe UI", sans-serif`.
- **Geist Mono** — every number the user reads as data: weight, reps, RPE, est. 1RM,
  volume, timers, timestamps, axis ticks. Weights 500 / 600, always `tabular-nums`.
  Fallback `ui-monospace, monospace`.

| Token | Size / line-height | Face / weight | Use |
|---|---|---|---|
| `text-display` | 40 / 44 | Geist Mono 600, tabular | summary hero number, PR value |
| `text-stat` | 32 / 34 | Geist Mono 500, tabular | stat-tile values |
| `text-h1` | 28 / 34 | Space Grotesk 600, −0.012em | screen title |
| `text-h2` | 22 / 28 | Space Grotesk 600, −0.008em | section header |
| `text-h3` | 18 / 24 | Geist 600 | card title, exercise name |
| `text-body` | 16 / 24 | Geist 400 | body, **all inputs** (≥16 prevents iOS zoom) |
| `text-label` | 14 / 20 | Space Grotesk 500 | buttons, chips, table headers |
| `text-caption` | 13 / 18 | Geist 500 | "last time" line, stat labels |
| `text-micro` | 12 / 16 | Geist Mono 500 | timestamps, axis ticks |

- Large standalone numbers use Geist Mono, tabular — locks the hero/stat digits.
- Any vertically-aligned column (set tables, axis ticks, history rows) is
  `tabular-nums`, which the Geist Mono roles carry inherently.
- Never below 13px except `text-micro`. Never below 16px for interactive text.
- Optional harder sci-fi read: swap the Geist Mono role for **Martian Mono**.

---

## 4. Space, radius, elevation, motion

**Spacing** — 4px base: `1`=4 `2`=8 `3`=12 `4`=16 `5`=20 `6`=24 `8`=32 `10`=40
`12`=48 `16`=64. Screen gutter **16**. Card padding **16**. Gap between cards **12**.

**Radius** — `--radius: 0.75rem` (12).
`sm` 8 · `md` 10 · `lg` 12 · `xl` 16 (cards, sheets-inner) · `2xl` 20 (bottom sheet top) · `full` (chips, avatars, timer ring).
Buttons & inputs 12. Set-row cells 8.

**Elevation** — shadows barely read on obsidian, so lean on surface steps + a 1px
translucent border. Where a shadow is used (sheets, toasts, the timer pill):
`shadow-md` 0 4 14 rgb(0 0 0/.28); `shadow-lg` 0 12 32 rgb(0 0 0/.40).

**Motion** — durations `fast` 120ms · `base` 180ms · `slow` 240ms.
Easing `standard` `cubic-bezier(0.2, 0, 0, 1)`; sheets use a soft spring.
`prefers-reduced-motion`: no transforms/slide, opacity only, timer ring still animates.

---

## 5. Layout

**Mobile-first, one responsive layout, no desktop block.** The app is a single
column that is full-bleed on phones and caps at `max-width: 480px` centred on the
obsidian ground (with faint side rules) on anything wider. Desktop users get the
same phone UI in the middle of the window — deliberate, not broken. Design and QA
target phone widths only (**360–430px**); no tablet/desktop breakpoints, no
two-column views in v1. A wider desktop layout for History / Progress is a
possible v2, never a v1 concern.

- **Viewport:** `width=device-width, initial-scale=1`. **Never** `user-scalable=no`
  or `maximum-scale=1` — pinch-zoom stays available.
- **Safe areas:** respect `env(safe-area-inset-*)`. Bottom nav height `56 + inset`.
  No fake status bar or keyboard — the OS draws those on top.
- **Install:** PWA add-to-home-screen prompt targets mobile only.
- **Sticky regions:** screen header (title + primary action) top; bottom nav bottom;
  active-session screen also pins the elapsed timer + Finish.
- **Resume bar:** when a session is `in_progress`, a 44px volt-tinted bar sits
  directly above the bottom nav on every other screen → tap to return.
- **Scroll:** content only; header and nav fixed. Long tables scroll inside their
  own container, never the page horizontally.

---

## 6. Components

Only RepLog-specific notes; anything unlisted is stock shadcn/ui with the tokens above.

### Button
Variants: `primary` (volt, dark text) · `secondary` (muted fill) · `ghost` ·
`destructive` · `link`. Sizes: `sm` 36 · `md` 44 (default) · `lg` 52.
Forms on mobile use **full-width `lg`**. Icon-only buttons are 44×44 minimum.
Loading = spinner replaces label, width held.

### Input / number field
Height 48, `text-body` (16). Numeric fields: `inputmode="decimal"`,
`enterkeyhint="next"`, select-all on focus. Weight & reps get optional **−/＋
steppers** (44×44) flanking the field for glove-friendly entry. Unit suffix (`kg`)
shown as muted adornment, never a separate control.

### Chip / filter toggle
Height 34, `full` radius, `text-label`. Off = `--secondary`; on = volt outline +
volt-tint fill. Used for muscle/equipment filters and chart ranges.

### Set row  *(core component)*
Grid: `[ set# · prev · weight · reps · RPE · ✓ ]`.
- `set#` — muted; warmup shows a **W** badge (amber) instead of a number.
- `prev` — last session's matching set, `text-caption` muted, tabular. Tapping it
  fills the row.
- `weight` / `reps` — editable cells, tabular, 16px.
- `RPE` — optional, compact select 6–10; ≥9 tints the cell amber.
- `✓` — 44×44 toggle. Incomplete = outline; **complete = filled volt, row gets a
  faint volt wash**. Completing a set starts the rest timer.
- Swipe left → Delete (destructive). Drag handle appears in reorder mode.
- Failure set = small red dot on `set#` + `set_type` label in the row menu.

### Exercise card
Header: exercise name (`h3`) · muscle tag (muted pill) · overflow menu
(reorder, notes, replace, remove). Below header: **"Last time — 80×8, 8, 7 · 12 Jul"**
in `text-caption` muted. Then set rows. Footer: full-width ghost **＋ Add set**.
Superset grouping is **out of v1** — no group affordance for now.

### Stat tile
`label` (`text-caption` muted, uppercase tracking) over `value` (`text-stat`,
tabular if in a row of tiles) with optional **delta** (`good`/`critical` colour +
▲/▼ icon + text, e.g. "▲ 5 kg"). Used in 2- or 4-up rows on Home, Exercise detail,
Session summary. A lone tile with no plot is fine — not everything needs a chart.

### Rest timer
Default = **pill** above the bottom nav: circular progress ring + `m:ss` (tabular,
`text-h3`) + skip (✕). Tap → expands to a sheet: big countdown, −15s / +15s,
target-rest editor, Skip. Fires a local notification + short vibration at 0.
Not a full-screen takeover.

### Muscle heatmap
Front & back body SVG, one visible at a time (toggle). Each muscle region filled
from the §2.4 green ramp by its trailing-7-day volume, bucketed to the 6 steps.
Legend: "less → more" swatch strip. Tap a region → filters Progress / lists
exercises hitting it. Mini version (Home) = read-only, non-interactive.

### Bottom navigation
5 slots: **Home · History · ＋Start · Exercises · Progress**. `＋Start` is a raised
volt pill breaking the top edge of the bar. Active item = volt icon + label + 2px
top indicator; inactive = `--muted-foreground`. Labels always shown
(icons-only is an open question — assume labels for now).

### Bottom sheet / dialog
Bottom sheet is the default overlay: `2xl` top radius, 4px drag handle, backdrop
`oklch(0 0 0 / 50%)`, spring in. Full-screen dialog only for the exercise picker.
Destructive confirms (discard session, delete) = centred alert dialog.

### Toast
Bottom, above the nav, 4s auto-dismiss, one at a time. **PR toast** is special:
volt border, trophy icon, "New PR — Bench 1RM 102 kg", tap to view.

### Empty states
Centred: line icon (muted) · one line of copy · one primary CTA. E.g. History
empty → "No sessions yet" · **Start your first workout**.

---

## 7. Iconography & imagery

- **Icons:** `lucide-react`, single set (rules + fallback in §10). 20px inline, 24px
  nav, 1.75px stroke. Common glyphs: `dumbbell`, `plus`, `check`, `timer`, `trophy`,
  `trending-up`, `history`, `pencil`, `trash-2`, `grip-vertical`, `chevron-*`,
  `mail`, `lock`, `eye` / `eye-off`, `arrow-right`, `loader-2`.
- **Body diagram:** custom 2-view anatomical SVG, regions = `id` per muscle in the
  `muscles` table (`svg_key`). Flat fills only, no illustration detail.
- **No photography** in v1. No exercise animation/GIFs (later).

---

## 8. Accessibility (enforced)

- Contrast AA: 4.5:1 body text, 3:1 large text & UI boundaries. Volt-on-dark and
  dark-on-volt both pass; verify volt-on-white for text use (prefer volt as *fill*
  with dark text, not volt text on white).
- Hit target ≥44px; spacing ≥8px between adjacent targets.
- `:focus-visible` = 2px `--ring`, 2px offset. Never remove focus outlines.
- Interactive text ≥16px (iOS zoom); inputs never smaller.
- Colour is never the only signal: warmup has a **W**, PR has a **trophy**, RPE
  shows the **number**, failed set has a **label**, chart series ≤4 are
  **direct-labelled** and always have a legend + table view.
- Single theme — the obsidian ground and warm-white text are the contrast baseline;
  every token pair above is checked against it, not against a light surface.
- `prefers-reduced-motion` honoured everywhere.
- Every icon-only control has an `aria-label`.

---

## 9. Tokens — `globals.css` (paste target)

Drop into `src/app/globals.css` under `@import "tailwindcss";`. One theme, so a
bare `:root` — no `.dark`, no `@custom-variant`, no `next-themes`. Chart hexes stay
hex per the data-viz method; everything else OKLCH.

```css
@import "tailwindcss";

:root {
  --radius: 0.75rem;

  --background: oklch(0.165 0.007 150);
  --foreground: oklch(0.950 0.008 150);
  --card: oklch(0.228 0.009 152);
  --card-foreground: oklch(0.950 0.008 150);
  --popover: oklch(0.268 0.010 152);
  --popover-foreground: oklch(0.950 0.008 150);
  --primary: oklch(0.820 0.170 137);
  --primary-foreground: oklch(0.180 0.040 137);
  --primary-hover: oklch(0.860 0.160 137);
  --primary-subtle: oklch(0.300 0.060 141);
  --secondary: oklch(0.300 0.011 152);
  --secondary-foreground: oklch(0.950 0.008 150);
  --muted: oklch(0.300 0.011 152);
  --muted-foreground: oklch(0.665 0.012 150);
  --accent: oklch(0.310 0.055 141);
  --accent-foreground: oklch(0.860 0.150 137);
  --destructive: oklch(0.640 0.190 25);
  --destructive-foreground: oklch(0.990 0 0);
  --success: oklch(0.800 0.160 148);
  --warning: oklch(0.800 0.130 78);
  --border: oklch(1 0 0 / 10%);
  --border-strong: oklch(1 0 0 / 16%);
  --input: oklch(1 0 0 / 14%);
  --ring: oklch(0.820 0.170 137);

  --chart-1: #3987e5;
  --chart-2: #d95926;
  --chart-3: #199e70;
  --chart-4: #c98500;
  --chart-5: #d55181;
  --chart-6: #008300;
  --chart-7: #9085e9;
  --chart-8: #e66767;

  --heat-0: oklch(0.240 0.030 145);
  --heat-1: oklch(0.380 0.080 141);
  --heat-2: oklch(0.520 0.130 139);
  --heat-3: oklch(0.650 0.160 138);
  --heat-4: oklch(0.780 0.170 137);
  --heat-5: oklch(0.870 0.170 136);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-hover: var(--primary-hover);
  --color-primary-subtle: var(--primary-subtle);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-chart-6: var(--chart-6);
  --color-chart-7: var(--chart-7);
  --color-chart-8: var(--chart-8);

  --color-heat-0: var(--heat-0);
  --color-heat-1: var(--heat-1);
  --color-heat-2: var(--heat-2);
  --color-heat-3: var(--heat-3);
  --color-heat-4: var(--heat-4);
  --color-heat-5: var(--heat-5);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);

  --font-display: var(--font-space-grotesk), system-ui, sans-serif;                        /* titles, headers, buttons, chips */
  --font-sans: var(--font-geist-sans), system-ui, -apple-system, "Segoe UI", sans-serif;   /* body, inputs, captions */
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;                            /* all data numerals, tabular */
}

@layer base {
  * { border-color: var(--color-border); }
  body {
    background: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
}
```

---

## 10. Implementation setup

### Stack

Next.js (App Router, RSC) + TypeScript · **Tailwind CSS 4** (CSS-first `@theme`, no
`tailwind.config.js`) · **shadcn/ui** · **lucide-react** · Recharts · Supabase.

### shadcn/ui — `components.json`

Run `npx shadcn@latest init` with:

```jsonc
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",                 // empty — Tailwind v4 is CSS-first
    "css": "src/app/globals.css",
    "baseColor": "neutral",       // only seeds init CSS; we replace it (see below)
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "utils": "@/lib/utils",
    "hooks": "@/hooks"
  }
}
```

**After `init`:** it writes a default palette into `globals.css` — **delete that and
paste the Obsidian & Volt block from §9**. Keep shadcn's `@layer base` reset and the
`@theme inline` var mapping; our block already includes both. `--radius` lives in the
token block (`0.75rem`); v4 reads it from the CSS var, so `components.json` needs no
radius.

### Fonts

Wire the three roles via `next/font/google` in `layout.tsx`, exposing CSS variables
the `@theme inline` block maps:

```ts
import { Space_Grotesk, Geist, Geist_Mono } from "next/font/google";
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["500","600"] });
const sans    = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono    = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", weight: ["500","600"] });
// <html class={`${display.variable} ${sans.variable} ${mono.variable}`}>
```

### `cn()` helper — `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

Deps: `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`.

### Components to pull (v1)

Add on demand with `npx shadcn@latest add <name>` — do **not** vendor the whole set:

`button` · `input` · `label` · `form` · `field` · `dialog` · `drawer` (bottom sheet) ·
`tabs` (segmented toggle) · `sonner` (toasts) · `skeleton` · `badge` · `separator` ·
`dropdown-menu` · `checkbox` · `switch` · `select` · `tooltip` · `alert` ·
`input-otp` (the 6-digit code field) · `avatar`.

Each lands in `src/components/ui/` as editable source — restyle to the tokens there,
never fork upstream.

### Icons — rules

- **One set: `lucide-react`.** Import per-icon (`import { Dumbbell } from "lucide-react"`).
- Default `size={20}` inline, `size={24}` nav, `strokeWidth={1.75}`.
- Decorative icons `aria-hidden`; icon-only controls need an `aria-label` (§8).
- Missing an icon? Take that **one** glyph from `@tabler/icons-react` (matching stroke
  style) or hand-draw an inline SVG on the 24px grid. Never add a third icon set.
- The muscle-heatmap body diagram and equipment glyphs are custom inline SVG regardless.

---

## 11. Resolved / open questions

1. ~~Landing page~~ — resolved: none, `/login` is the entry.
2. ~~Bottom-nav labels~~ — resolved: **icon-only at rest, active tab expands**
   to icon + label (floating pill nav, see `UX.md` Navigation model).
3. ~~Rest timer~~ — resolved: **pill** (expands to a sheet), not a full-screen takeover.
4. ~~Volt hue / light-vs-dark~~ — resolved: single **Obsidian & Volt** theme; ground
   `oklch(0.165 0.007 150)`, primary `oklch(0.82 0.17 137)`.
5. ~~Auth Terms / Privacy links~~ — resolved: kept; needs real `/terms` + `/privacy`.
6. Open — supersets are out of v1: omit the reorder-into-group affordance entirely for now?
