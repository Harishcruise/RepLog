"use client";

import {
  ArrowRight,
  Eye,
  Loader2,
  Lock,
  Mail,
  Plus,
  TriangleAlert,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";

import { NavShell } from "@/components/app-shell/nav-shell";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border flex flex-col gap-4 border-t pt-8">
      <h2 className="font-display text-muted-foreground text-[11px] font-semibold tracking-[0.09em] uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

const SURFACES = [
  "background",
  "card",
  "popover",
  "muted",
  "accent",
  "primary",
  "primary-subtle",
  "secondary",
  "destructive",
  "success",
  "warning",
] as const;

export default function DevUI() {
  return (
    <main className="mx-auto flex max-w-[520px] flex-col gap-10 px-6 py-14">
      <Toaster position="top-center" />

      <header className="flex flex-col gap-1">
        <h1 className="font-display text-h1">Design system</h1>
        <p className="text-caption text-muted-foreground font-sans">
          Obsidian &amp; Volt · tokens, type, primitives
        </p>
      </header>

      {/* ---- colour ---- */}
      <Section title="Surfaces & brand">
        <div className="grid grid-cols-3 gap-3">
          {SURFACES.map((name) => (
            <div key={name} className="flex flex-col gap-1.5">
              <div
                className="border-border h-12 rounded-lg border"
                style={{ background: `var(--color-${name})` }}
              />
              <span className="text-muted-foreground font-mono text-[10px]">
                --{name}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- heatmap ---- */}
      <Section title="Heatmap ramp">
        <div className="flex h-10 overflow-hidden rounded-full">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex-1"
              style={{ background: `var(--color-heat-${i})` }}
            />
          ))}
        </div>
      </Section>

      {/* ---- type ---- */}
      <Section title="Type scale">
        <div className="flex flex-col gap-3">
          <p className="text-display font-mono tabular-nums">128.5</p>
          <p className="text-stat font-mono tabular-nums">8&nbsp;420</p>
          <p className="font-display text-h1">Active session</p>
          <p className="font-display text-h2">This week</p>
          <p className="text-h3 font-sans">Barbell Bench Press</p>
          <p className="text-body font-sans">
            Body copy — 16px Geist, the reading size for everything long-form
            and every input.
          </p>
          <p className="font-display text-label">
            Label / button — Space Grotesk
          </p>
          <p className="text-caption text-muted-foreground font-sans">
            Caption — last-time line, field labels
          </p>
          <p className="text-micro text-muted-foreground font-mono">
            12 Jul · 18:24 — micro / timestamps
          </p>
        </div>
      </Section>

      {/* ---- buttons ---- */}
      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default 44</Button>
          <Button size="lg">
            Large 52 <ArrowRight />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Discard</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex items-center gap-3">
          <Button size="icon" aria-label="Add">
            <Plus />
          </Button>
          <Button disabled>
            <Loader2 className="animate-spin" /> Loading
          </Button>
          <Button className="w-full" size="lg">
            Full-width lg
          </Button>
        </div>
      </Section>

      {/* ---- field + input group ---- */}
      <Section title="Field · Input group">
        <Field>
          <FieldLabel htmlFor="dev-name">Name</FieldLabel>
          <Input id="dev-name" placeholder="Plain input, no adornment" />
          <FieldDescription>
            Shown under the control for helper text.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="dev-email">Email</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Mail strokeWidth={1.8} />
            </InputGroupAddon>
            <InputGroupInput
              id="dev-email"
              type="email"
              placeholder="you@example.com"
            />
          </InputGroup>
        </Field>

        <Field>
          <FieldLabel htmlFor="dev-pw">Password — invalid</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Lock strokeWidth={1.8} />
            </InputGroupAddon>
            <InputGroupInput
              id="dev-pw"
              type="password"
              defaultValue="short"
              aria-invalid
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-sm" aria-label="Show password">
                <Eye />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldError>
            <TriangleAlert className="size-3.5 shrink-0" strokeWidth={2.2} />
            Password must be at least 8 characters.
          </FieldError>
        </Field>

        <FieldSeparator>or</FieldSeparator>
      </Section>

      {/* ---- segmented toggle (auth) ---- */}
      <Section title="Tabs — segmented (auth toggle)">
        <Tabs defaultValue="signin">
          <TabsList variant="segmented">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>
          <TabsContent
            value="signin"
            className="text-caption text-muted-foreground pt-3 font-sans"
          >
            Sign-in panel
          </TabsContent>
          <TabsContent
            value="signup"
            className="text-caption text-muted-foreground pt-3 font-sans"
          >
            Create-account panel
          </TabsContent>
        </Tabs>
      </Section>

      {/* ---- tabs — default ---- */}
      <Section title="Tabs — default">
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">Volume</TabsTrigger>
            <TabsTrigger value="b">Est. 1RM</TabsTrigger>
            <TabsTrigger value="c">Sets</TabsTrigger>
          </TabsList>
        </Tabs>
      </Section>

      {/* ---- otp ---- */}
      <Section title="Input OTP (6-digit code)">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </Section>

      {/* ---- toast ---- */}
      <Section title="Toast">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => toast("Set saved")}>
            Default
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.success("Password updated — you're in.")}
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast("New PR — Bench 1RM 102 kg", {
                icon: <Trophy className="size-4" />,
              })
            }
          >
            PR
          </Button>
        </div>
      </Section>

      {/* ---- app shell nav ---- */}
      <Section title="App shell nav">
        <NavShell />
      </Section>
    </main>
  );
}
