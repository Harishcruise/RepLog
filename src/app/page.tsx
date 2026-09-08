import { Dumbbell } from "lucide-react";

// Placeholder. Becomes a redirect (authed → /app, else → /login) once those exist.
export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex size-13 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Dumbbell className="size-7" strokeWidth={2} aria-hidden />
      </div>
      <h1 className="font-display text-h1">RepLog</h1>
      <p className="font-sans text-body text-muted-foreground">
        Log every set. Watch it climb.
      </p>
      <p className="font-mono text-micro text-muted-foreground/70">
        foundation wired · screens coming
      </p>
    </main>
  );
}
