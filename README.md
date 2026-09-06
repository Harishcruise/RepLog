# RepLog

A gym workout session tracker. Log your sets fast, see your history, and watch your
lifts progress over time.

Personal-use first, built multi-user and scalable from day one.

## Stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Supabase** — Postgres, Auth, Row Level Security
- **Recharts** for progress charts
- PWA: installable, offline logging, sync on reconnect
- Hosting: Vercel (app) + Supabase cloud (data)

## v1 scope

- Auth + per-user data isolation (RLS)
- Exercise library (~80 seeded + custom exercises)
- Fast session logging — weight, reps, RPE, warmup flag, "last time" inline
- Minimal templates — save a session as a template, start a session from one
- History — session list, session detail, per-exercise history
- Progress — estimated 1RM, auto PR detection, per-exercise trend charts
- Muscle heatmap — body diagram shaded by trailing-7-day volume
- Bodyweight log, rest timer, kg/lb setting, data export

Full detail and the data model live in [`docs/SPEC.md`](docs/SPEC.md).

## Development

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase keys
npm run dev
```

## Status

Early build — scaffolding in progress. See `docs/SPEC.md` for the milestone list.
