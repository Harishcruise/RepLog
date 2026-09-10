"use client";

import {
  ArrowRight,
  Check,
  ChevronLeft,
  Circle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

import type { ResetController } from "./use-reset";

/** Step 3 — choose a new password. Recovery session is already open. */
export function NewPasswordStep({ reset }: { reset: ResetController }) {
  const { error, pending } = reset;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);

  const longEnough = password.length >= 8;
  const matches = password.length > 0 && password === confirm;
  const canSubmit = longEnough && matches;

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={reset.backToRequest}
        className="text-caption text-muted-foreground hover:text-foreground flex items-center gap-1.5 self-start font-sans font-medium transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back
      </button>

      <h1 className="font-display text-h2 mt-11">Set a new password</h1>
      <p className="text-caption text-muted-foreground mt-2 font-sans">
        Code verified. Choose a new password — you&apos;ll be signed in straight
        after.
      </p>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) void reset.savePassword(password);
        }}
      >
        <Field>
          <FieldLabel htmlFor="new-password">New password</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Lock strokeWidth={1.8} />
            </InputGroupAddon>
            <InputGroupInput
              id="new-password"
              type={showPw ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-sm"
                aria-label={showPw ? "Hide password" : "Show password"}
                onClick={() => setShowPw((v) => !v)}
              >
                {showPw ? <EyeOff /> : <Eye />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">
            Confirm new password
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Lock strokeWidth={1.8} />
            </InputGroupAddon>
            <InputGroupInput
              id="confirm-password"
              type={showPw ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Re-enter it"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </InputGroup>
        </Field>

        <ul className="mt-1 flex flex-col gap-1.5">
          <Requirement met={longEnough}>At least 8 characters</Requirement>
          <Requirement met={matches}>Both entries match</Requirement>
        </ul>

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
          disabled={pending || !canSubmit}
        >
          {pending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Save &amp; sign in
              <ArrowRight />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

function Requirement({
  met,
  children,
}: {
  met: boolean;
  children: React.ReactNode;
}) {
  return (
    <li
      className={cn(
        "text-caption flex items-center gap-1.5 font-sans transition-colors",
        met ? "text-success" : "text-muted-foreground",
      )}
    >
      {met ? (
        <Check className="size-3.5 shrink-0" strokeWidth={2.6} />
      ) : (
        <Circle className="size-3.5 shrink-0" strokeWidth={2.2} />
      )}
      {children}
    </li>
  );
}
