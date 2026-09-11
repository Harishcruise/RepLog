"use client";

import {
  ChevronRight,
  Loader2,
  Lock,
  LogOut,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSignOut } from "@/hooks/use-sign-out";
import { authErrorMessage } from "@/lib/auth/errors";
import { updatePassword } from "@/lib/auth/operations";
import { createClient } from "@/lib/supabase/client";

// Stubbed until bodyweight_logs exists (SPEC.md milestone 2).
const STUB_LATEST_WEIGHT_KG = 52.0;

/** Change password (real) · bodyweight log (→ /app/body) · sign out (real). */
export function AccountSection() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { pending: signingOut, signOut } = useSignOut();

  function openDialog() {
    setPassword("");
    setConfirm("");
    setError(null);
    setOpen(true);
  }

  async function save() {
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setPending(true);
    setError(null);
    const res = await updatePassword(createClient(), { password });
    setPending(false);
    if (res.ok) {
      setOpen(false);
      toast.success("Password updated");
    } else {
      setError(authErrorMessage(res.code));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground font-display px-0.5 text-[11px] font-semibold tracking-[0.07em] uppercase">
        Account
      </span>
      <div className="border-border bg-card divide-border divide-y overflow-hidden rounded-xl border">
        <button
          type="button"
          onClick={openDialog}
          className="flex w-full items-center justify-between px-4 py-3.5"
        >
          <span className="text-body font-sans font-medium">
            Change password
          </span>
          <ChevronRight className="text-muted-foreground size-[15px]" />
        </button>

        <Link
          href="/app/body"
          className="flex w-full items-center justify-between px-4 py-3.5"
        >
          <span className="text-body font-sans font-medium">
            Bodyweight log
          </span>
          <span className="text-muted-foreground flex items-center gap-2 text-[13px]">
            <span className="font-mono">
              {STUB_LATEST_WEIGHT_KG.toFixed(1)} kg
            </span>
            <ChevronRight className="text-muted-foreground size-[15px]" />
          </span>
        </Link>

        <button
          type="button"
          disabled={signingOut}
          onClick={() => void signOut()}
          className="text-destructive flex w-full items-center justify-between px-4 py-3.5 disabled:opacity-60"
        >
          <span className="text-body font-sans font-medium">Sign out</span>
          {signingOut ? (
            <Loader2 className="size-[15px] animate-spin" />
          ) : (
            <LogOut className="size-[15px]" />
          )}
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Change password</DialogTitle>
          <div className="flex flex-col gap-3">
            <Field>
              <FieldLabel htmlFor="new-password">New password</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Lock strokeWidth={1.8} />
                </InputGroupAddon>
                <InputGroupInput
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-new-password">
                Confirm password
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Lock strokeWidth={1.8} />
                </InputGroupAddon>
                <InputGroupInput
                  id="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </InputGroup>
            </Field>
          </div>
          {error ? (
            <FieldError>
              <TriangleAlert className="size-3.5 shrink-0" strokeWidth={2.2} />
              {error}
            </FieldError>
          ) : null}
          <DialogFooter>
            <Button
              disabled={pending || password.length < 8 || !confirm}
              onClick={() => void save()}
            >
              {pending ? <Loader2 className="animate-spin" /> : "Save password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
