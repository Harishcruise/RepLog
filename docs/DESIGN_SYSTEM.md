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
4. **Dark-first.** Designed for a dim gym and an evening couch. Light mode is a
   first-class re-step of the same palette, not an auto-invert.
5. **Progress is the emotion.** The one moment we celebrate is a PR. Volt green is
   reserved for "you moved forward" — primary actions and personal records.
6. **Calm by default, loud on achievement.** No gradients, no motion for its own
   sake. Colour spikes only where it means something.

---

## 2. Colour

OKLCH throughout. Values are starting points — tune against a real screen.
Token names follow the shadcn/ui contract so components map 1:1.

### 2.1 Brand

| Role | Meaning | Light | Dark |
|---|---|---|---|
| **Primary (volt)** | primary action, PR highlight | `oklch(0.72 0.17 132)` | `oklch(0.82 0.18 130)` |
| Primary foreground | text/icon on primary | `oklch(0.19 0.03 135)` | `oklch(0.18 0.03 135)` |

Primary doubles as the success/PR colour — in this app "primary action" and
"you progressed" are the same idea. Semantic warning/destructive stay separate
(below) so meaning is never colour-alone: PRs also carry a trophy icon, failure
sets a label.

### 2.2 Neutrals & surfaces (warm charcoal ramp)

| Token | Light | Dark |
|---|---|---|
| `--background` (page plane) | `oklch(0.986 0.002 120)` | `oklch(0.160 0.004 120)` |
| `--foreground` | `oklch(0.180 0.006 120)` | `oklch(0.970 0.003 120)` |
| `--card` (raised) | `oklch(1 0 0)` | `oklch(0.196 0.004 120)` |
| `--card-foreground` | `oklch(0.180 0.006 120)` | `oklch(0.970 0.003 120)` |
| `--popover` | `oklch(1 0 0)` | `oklch(0.210 0.004 120)` |
| `--popover-foreground` | = foreground | = foreground |
| `--muted` (fill) | `oklch(0.955 0.003 120)` | `oklch(0.240 0.004 120)` |
| `--muted-foreground` | `oklch(0.500 0.006 120)` | `oklch(0.680 0.004 120)` |
| `--secondary` | `oklch(0.955 0.003 120)` | `oklch(0.260 0.004 120)` |
| `--secondary-foreground` | `oklch(0.250 0.006 120)` | `oklch(0.960 0.003 120)` |
| `--accent` (hover wash) | `oklch(0.955 0.020 132)` | `oklch(0.280 0.030 132)` |
| `--accent-foreground` | `oklch(0.250 0.020 135)` | `oklch(0.960 0.020 132)` |
| `--border` | `oklch(0.900 0.004 120)` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(0.900 0.004 120)` | `oklch(1 0 0 / 14%)` |
| `--ring` (focus) | = primary | = primary |

Elevation model:
- **Light:** white cards on warm-white page + 1px `--border` + `shadow-sm`.
- **Dark:** raise by *lightening the surface* one step + 1px translucent border.
  Shadows barely read on black — don't lean on them.

### 2.3 Semantic (fixed — never themed by hue, always paired with icon + label)

Adopted from the data-viz status palette so app and charts agree.

| Role | Hex | Use |
|---|---|---|
| good | `#0ca30c` | confirmations (distinct from volt primary; use when primary would be ambiguous) |
| warning | `#fab219` | high RPE (≥9), approaching MRV, unsynced-offline banner |
| serious | `#ec835a` | destructive-adjacent warnings |
| critical / destructive | `#d03b3b` | delete, discard session, failed set marker |

shadcn tokens: `--destructive: oklch(0.58 0.20 25)` (light) / `oklch(0.64 0.19 25)`
(dark); `--destructive-foreground: oklch(0.99 0 0)`.

### 2.4 Data-viz palette

Categorical — the validated reference order (blue → orange → aqua → yellow →
magenta → green → violet → red). Mapped to `--chart-1..8`, both modes:

| Slot | Light | Dark |
|---|---|---|
| `--chart-1` | `#2a78d6` | `#3987e5` |
| `--chart-2` | `#eb6834` | `#d95926` |
| `--chart-3` | `#1baf7a` | `#199e70` |
| `--chart-4` | `#eda100` | `#c98500` |
| `--chart-5` | `#e87ba4` | `#d55181` |
| `--chart-6` | `#008300` | `#008300` |
| `--chart-7` | `#4a3aa7` | `#9085e9` |
| `--chart-8` | `#e34948` | `#e66767` |

Rules (non-negotiable): assign in fixed order, never cycled; **one y-axis ever**
(est. 1RM and volume are separate cards, not a dual-axis chart); colour follows
the entity, not its rank; ≥2 series always gets a legend, ≤4 also direct-labelled;
a table view always exists; hover crosshair+tooltip is on by default.

**Muscle heatmap ramp** — single-hue, brand green, so "more volume = more RepLog
green." 6 ordinal steps; the step nearest the surface recedes.

| Step | Light | Dark |
|---|---|---|
| 0 (≈none) | `oklch(0.950 0.030 132)` | `oklch(0.260 0.030 132)` |
| 1 | `oklch(0.880 0.070 132)` | `oklch(0.360 0.070 132)` |
| 2 | `oklch(0.800 0.110 132)` | `oklch(0.480 0.110 132)` |
| 3 | `oklch(0.720 0.150 132)` | `oklch(0.600 0.150 132)` |
| 4 | `oklch(0.630 0.160 138)` | `oklch(0.720 0.170 130)` |
| 5 (max) | `oklch(0.520 0.150 142)` | `oklch(0.830 0.180 128)` |

> **TODO before building any chart:** run the validator, don't eyeball.
> `node scripts/validate_palette.js "#2a78d6,#eb6834,#1baf7a,#eda100,#e87ba4,#008300,#4a3aa7,#e34948" --mode light --surface "#ffffff"`
> then `--mode dark --surface "#191918"`, and the heatmap ramp with `--ordinal`.
> Fix any FAIL before implementation. (Script lives in the dataviz skill.)

Chart chrome: gridlines `oklch(0.900 0.004 120)` / `oklch(1 0 0 / 8%)`; axis/label
ink `--muted-foreground`; marks thin, 2px lines, 4px rounded data-ends on the
baseline, ≥8px markers, 2px surface gap between fills.

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

**Elevation** — `shadow-sm` 0 1 2 rgb(0 0 0/.06); `shadow-md` 0 4 12 rgb(0 0 0/.10);
`shadow-lg` 0 12 32 rgb(0 0 0/.16). Dark mode: halve opacity, rely on surface + border.

**Motion** — durations `fast` 120ms · `base` 180ms · `slow` 240ms.
Easing `standard` `cubic-bezier(0.2, 0, 0, 1)`; sheets use a soft spring.
`prefers-reduced-motion`: no transforms/slide, opacity only, timer ring still animates.

---

## 5. Layout

- **App frame:** full-bleed on phone; `max-width: 480px` centred with side rules on
  larger screens (this is a phone app first).
- **Safe areas:** respect `env(safe-area-inset-*)`. Bottom nav height `56 + inset`.
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

- **Icons:** `lucide-react` (ships with shadcn). 20px in-line, 24px nav, 1.75px
  stroke. Key set: `dumbbell`, `plus`, `check`, `timer`, `trophy`, `trending-up`,
  `history`, `pencil`, `trash-2`, `grip-vertical`, `chevron-*`.
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
- Dark mode is a designed re-step, validated against the dark surface.
- `prefers-reduced-motion` honoured everywhere.
- Every icon-only control has an `aria-label`.

---

## 9. Tokens — `globals.css` (paste target)

Drop into `src/app/globals.css` under `@import "tailwindcss";`. Dark mode via a
`.dark` class on `<html>` (next-themes). Chart hexes stay hex per the data-viz
method; everything else OKLCH.

```css
@import "tailwindcss";
@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.75rem;

  --background: oklch(0.986 0.002 120);
  --foreground: oklch(0.180 0.006 120);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.180 0.006 120);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.180 0.006 120);
  --primary: oklch(0.720 0.170 132);
  --primary-foreground: oklch(0.190 0.030 135);
  --secondary: oklch(0.955 0.003 120);
  --secondary-foreground: oklch(0.250 0.006 120);
  --muted: oklch(0.955 0.003 120);
  --muted-foreground: oklch(0.500 0.006 120);
  --accent: oklch(0.955 0.020 132);
  --accent-foreground: oklch(0.250 0.020 135);
  --destructive: oklch(0.580 0.200 25);
  --destructive-foreground: oklch(0.990 0 0);
  --border: oklch(0.900 0.004 120);
  --input: oklch(0.900 0.004 120);
  --ring: oklch(0.720 0.170 132);

  --success: oklch(0.600 0.150 145);
  --warning: oklch(0.750 0.140 78);

  --chart-1: #2a78d6;
  --chart-2: #eb6834;
  --chart-3: #1baf7a;
  --chart-4: #eda100;
  --chart-5: #e87ba4;
  --chart-6: #008300;
  --chart-7: #4a3aa7;
  --chart-8: #e34948;

  --heat-0: oklch(0.950 0.030 132);
  --heat-1: oklch(0.880 0.070 132);
  --heat-2: oklch(0.800 0.110 132);
  --heat-3: oklch(0.720 0.150 132);
  --heat-4: oklch(0.630 0.160 138);
  --heat-5: oklch(0.520 0.150 142);
}

.dark {
  --background: oklch(0.160 0.004 120);
  --foreground: oklch(0.970 0.003 120);
  --card: oklch(0.196 0.004 120);
  --card-foreground: oklch(0.970 0.003 120);
  --popover: oklch(0.210 0.004 120);
  --popover-foreground: oklch(0.970 0.003 120);
  --primary: oklch(0.820 0.180 130);
  --primary-foreground: oklch(0.180 0.030 135);
  --secondary: oklch(0.260 0.004 120);
  --secondary-foreground: oklch(0.960 0.003 120);
  --muted: oklch(0.240 0.004 120);
  --muted-foreground: oklch(0.680 0.004 120);
  --accent: oklch(0.280 0.030 132);
  --accent-foreground: oklch(0.960 0.020 132);
  --destructive: oklch(0.640 0.190 25);
  --destructive-foreground: oklch(0.980 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 14%);
  --ring: oklch(0.820 0.180 130);

  --success: oklch(0.720 0.160 145);
  --warning: oklch(0.800 0.140 80);

  --chart-1: #3987e5;
  --chart-2: #d95926;
  --chart-3: #199e70;
  --chart-4: #c98500;
  --chart-5: #d55181;
  --chart-6: #008300;
  --chart-7: #9085e9;
  --chart-8: #e66767;

  --heat-0: oklch(0.260 0.030 132);
  --heat-1: oklch(0.360 0.070 132);
  --heat-2: oklch(0.480 0.110 132);
  --heat-3: oklch(0.600 0.150 132);
  --heat-4: oklch(0.720 0.170 130);
  --heat-5: oklch(0.830 0.180 128);
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

## 10. Open questions (carried from UX.md)

1. Landing page for v1, or straight to `/login`?
2. Bottom-nav labels — icons only, or icons + text? *(system assumes labels)*
3. Rest timer full-screen vs pill. *(system assumes pill)*
4. Volt hue final call — this draft uses `~132°` green. Alternatives on the table:
   electric indigo `~275°` (keeps green free for "success" only) or amber `~70°`.
