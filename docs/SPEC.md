# Gym Workout Tracker — v1 Spec

Status: locked for build
Date: 2026-09-06

## Stack decisions

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| DB / Auth / Storage | Supabase (Postgres + Supabase Auth + Row Level Security) |
| ORM / DB access | Supabase JS client + SQL migrations (no heavy ORM) |
| Offline | IndexedDB mirror via Dexie + sync queue (added last) |
| Hosting | Vercel (app) + Supabase cloud (data) |
| PWA | Installable, offline logging, sync on reconnect |

## v1 feature set (locked)

### Auth & users
- Supabase Auth: email + password (primary) and 6-digit email OTP code (passwordless
  fallback + password recovery). No magic link (avoids the cross-device link problem).
- `profiles` row auto-created on signup.
- Every user-owned table scoped by `user_id` with RLS. Single user today, multi-user safe.

### Exercise library
- ~80 seeded global exercises: name, primary + secondary muscles, equipment category, compound/isolation.
- Search + filter by muscle group and equipment.
- User can add / edit / archive custom exercises.

### Session logging (core loop — optimize for speed of entry)
- Start session (auto timestamp) / finish session (auto duration).
- Add exercises to session; reorder.
- Log sets: weight, reps, optional RPE, warmup flag, completed toggle, set type (normal/warmup/dropset/failure/amrap).
- "Last time" performance shown inline per exercise while logging.
- Edit / delete any set or exercise. Soft delete.
- Session notes; optional bodyweight for the session.
- Discard-session option.

### Templates (minimal, in v1)
- "Save this session as a template."
- "Start a session from a template" (pre-fills exercises + target sets/reps).
- Template CRUD: name, ordered exercises, target sets, target rep range, optional target RPE, optional rest.
- No per-set template rows in v1 (targets only); column reserved.

### History
- Session list, cursor-paginated, newest first.
- Session detail view.
- Per-exercise history: every set across every date.

### Progress
- Estimated 1RM per set (Epley: `weight * (1 + reps/30)`, reps capped at 12 for the estimate).
- Auto PR detection on set save: max weight, best est. 1RM, max reps, best single-set volume.
- Per-exercise chart: est. 1RM trend + volume-per-session trend.

### Muscle heatmap
- Body diagram (front/back SVG) shaded by trailing-7-day volume per muscle group.
- Volume = `sum(set.volume * exercise_muscle.contribution)`, warmups excluded.
- Computed on read for v1; materialized rollup later if slow.

### Extras
- Bodyweight log (one entry per day, trend chart).
- Rest timer: client-side, auto-start after a logged set, notifies at zero.
- Settings: kg/lb unit, default rest duration.
- Data export: JSON (full) + CSV (sets).

## Explicitly OUT of v1 (schema supports; build later)
Programs / multi-day splits, supersets & circuits (column reserved), periodization / mesocycles,
Apple Watch / heart-rate enrichment, progress photos, body measurements beyond bodyweight,
social / following, coaching mode, AI program generation / NL logging.

## Scalability principles (applied from commit 1)
- Postgres from the start. No SQLite phase.
- Every user-owned row has `user_id`; RLS policy `user_id = auth.uid()`.
- `exercises`: global rows have `user_id IS NULL`; select policy allows own + global, write policy own only.
- `sets` carries denormalized `user_id` and `exercise_id` for fast RLS + per-exercise queries.
- Composite indexes: `sets(user_id, exercise_id, performed_at desc)`, `workout_sessions(user_id, started_at desc)`, `session_exercises(session_id)`, `sets(session_exercise_id)`.
- PRs stored in `personal_records` (one row per exercise+type, current best), written on set save — never recomputed on read.
- Cursor pagination on all list endpoints.
- Client-generated UUIDs, `updated_at` (last-write-wins), `deleted_at` (soft delete) → offline sync + multi-user safe.
- All metrics logic (1RM, volume, PR compare) in one shared, unit-tested `lib/metrics` module.
- Stateless route handlers; no server session state beyond Supabase auth cookie.

## Data model

### profiles
`id` uuid PK → auth.users, `display_name`, `unit_weight` ('kg'|'lb', default 'kg'),
`default_rest_seconds` int default 120, `created_at`, `updated_at`.

### muscles  (seeded reference)
`id` text PK (e.g. `chest`, `lats`, `quads`, `hamstrings`, `glutes`, `front_delts`, ...),
`name` text, `body_region` ('front'|'back'), `svg_key` text.

### exercises
`id` uuid PK, `user_id` uuid NULL → auth.users (NULL = global),
`name` text, `category` ('barbell'|'dumbbell'|'machine'|'cable'|'bodyweight'|'kettlebell'|'band'|'other'),
`movement` ('compound'|'isolation'), `is_unilateral` bool default false,
`default_unit` ('kg'|'lb'|'bodyweight'|'time'|'distance') default 'kg',
`notes` text, `is_archived` bool default false, `created_at`, `updated_at`.
Unique: `(user_id, lower(name))`.

### exercise_muscles
`exercise_id` uuid → exercises, `muscle_id` text → muscles,
`role` ('primary'|'secondary'), `contribution` numeric default 1.0 (primary 1.0, secondary 0.5).
PK `(exercise_id, muscle_id)`.

### workout_templates
`id` uuid PK, `user_id` uuid NOT NULL, `name` text, `notes` text,
`is_archived` bool default false, `created_at`, `updated_at`.

### template_exercises
`id` uuid PK, `template_id` uuid → workout_templates, `exercise_id` uuid → exercises,
`position` int, `superset_group` int NULL (reserved),
`target_sets` int, `target_reps_min` int, `target_reps_max` int,
`target_rpe` numeric NULL, `rest_seconds` int NULL, `notes` text.

### workout_sessions
`id` uuid PK, `user_id` uuid NOT NULL, `template_id` uuid NULL → workout_templates,
`name` text, `started_at` timestamptz NOT NULL default now(), `ended_at` timestamptz NULL,
`notes` text, `bodyweight` numeric NULL, `bodyweight_unit` text NULL,
`status` ('in_progress'|'completed'|'discarded') default 'in_progress',
`created_at`, `updated_at`, `deleted_at` timestamptz NULL.
Index: `(user_id, started_at desc)`.

### session_exercises
`id` uuid PK, `session_id` uuid → workout_sessions, `exercise_id` uuid → exercises,
`user_id` uuid NOT NULL, `position` int, `superset_group` int NULL (reserved),
`notes` text, `created_at`, `updated_at`, `deleted_at`.
Index: `(session_id)`.

### sets
`id` uuid PK (client-generated), `session_exercise_id` uuid → session_exercises,
`user_id` uuid NOT NULL, `exercise_id` uuid NOT NULL (denormalized),
`set_number` int, `weight` numeric NULL, `reps` int NULL, `rpe` numeric NULL,
`is_warmup` bool default false, `is_completed` bool default false,
`set_type` ('normal'|'warmup'|'dropset'|'failure'|'amrap') default 'normal',
`distance_m` numeric NULL, `duration_seconds` int NULL,
`est_1rm` numeric NULL (computed on write), `volume` numeric NULL (weight*reps, on write),
`performed_at` timestamptz default now(), `created_at`, `updated_at`, `deleted_at`.
Indexes: `(user_id, exercise_id, performed_at desc)`, `(session_exercise_id)`.

### personal_records
`id` uuid PK, `user_id` uuid NOT NULL, `exercise_id` uuid NOT NULL,
`record_type` ('max_weight'|'est_1rm'|'max_reps'|'max_set_volume'),
`value` numeric, `reps` int NULL, `weight` numeric NULL,
`set_id` uuid → sets, `achieved_at` timestamptz.
Unique: `(user_id, exercise_id, record_type)`.

### bodyweight_logs
`id` uuid PK, `user_id` uuid NOT NULL, `weight` numeric, `unit` text,
`measured_at` date, `note` text.
Unique: `(user_id, measured_at)`.

## Build milestones

1. **Scaffold** — Next.js + TS + Tailwind + shadcn, Supabase client wiring, env, PWA manifest + service worker shell.
2. **Schema** — SQL migrations for all tables + RLS policies + `updated_at` triggers. Seed `muscles` + ~80 `exercises` + `exercise_muscles`.
3. **Auth** — Supabase Auth UI, protected layout, `profiles` bootstrap, settings page (unit, rest).
4. **Exercise library** — list + search + filter, custom exercise create/edit/archive.
5. **Session core** — start → add exercises → log sets (with "last time") → finish / discard.
6. **Metrics module** — `lib/metrics` (1RM, volume, PR compare) + tests; PR write path on set save.
7. **History** — session list (cursor paginated), session detail, per-exercise history.
8. **Progress charts** — per-exercise est. 1RM + volume trend (Recharts).
9. **Muscle heatmap** — body SVG component + trailing-7-day volume query.
10. **Templates** — save session as template, template CRUD, start session from template.
11. **Bodyweight + rest timer** — bodyweight log + chart, client rest timer with notification.
12. **Export** — JSON + CSV download.
13. **PWA offline** — Dexie mirror, write queue, reconnect sync, soft-delete reconciliation.
14. **Deploy** — Vercel + Supabase prod project, env, smoke test.

MVP-usable-by-me line: after milestone 8. Milestones 10–13 are the "make it nice / scale" pass.
