"use client";

import {
  ArrowRight,
  ChevronLeft,
  Loader2,
  Mail,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import type { ResetController } from "./use-reset";

/** Step 1 — collect the account email and send a recovery code. */
export function RequestStep({ reset }: { reset: ResetController }) {
  const { email, error, pending } = reset;

  return (
    <div className="flex flex-col">
      <Link
        href="/login"
        className="text-caption text-muted-foreground hover:text-foreground flex items-center gap-1.5 self-start font-sans font-medium transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back to sign in
      </Link>

      <h1 className="font-display text-h2 mt-11">Reset your password</h1>
      <p className="text-caption text-muted-foreground mt-2 font-sans">
        Enter your account email and we&apos;ll send a 6-digit code to set a new
        one.
      </p>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          void reset.sendCode();
        }}
      >
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Mail strokeWidth={1.8} />
            </InputGroupAddon>
            <InputGroupInput
              id="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => reset.setEmail(e.target.value)}
            />
          </InputGroup>
        </Field>

        {error ? (
          <FieldError>
            <TriangleAlert className="size-3.5 shrink-0" strokeWidth={2.2} />
            {error}
          </FieldError>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full"
          disabled={pending || !email}
        >
          {pending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Send code
              <ArrowRight />
            </>
          )}
        </Button>
      </form>

      <p className="text-micro text-muted-foreground/80 mt-8 text-center font-sans leading-4">
        If an account exists for that email, a code is on its way.
      </p>
    </div>
  );
}
