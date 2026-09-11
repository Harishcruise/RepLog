"use client";

import { Loader2, Pencil, TriangleAlert, User } from "lucide-react";
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
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { authErrorMessage } from "@/lib/auth/errors";
import { updateDisplayName } from "@/lib/auth/operations";
import { createClient } from "@/lib/supabase/client";

type IdentitySectionProps = {
  name: string;
  email: string;
  memberSince: string;
};

/** Avatar + name (real, editable) + email + member-since (both read-only). */
export function IdentitySection({
  name: initialName,
  email,
  memberSince,
}: IdentitySectionProps) {
  const [name, setName] = useState(initialName);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(initialName);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  function openDialog() {
    setDraft(name);
    setError(null);
    setOpen(true);
  }

  async function save() {
    setPending(true);
    setError(null);
    const res = await updateDisplayName(createClient(), { name: draft });
    setPending(false);
    if (res.ok) {
      setName(draft.trim());
      setOpen(false);
      toast.success("Name updated");
    } else {
      setError(authErrorMessage(res.code));
    }
  }

  return (
    <div className="flex flex-col items-center gap-2.5 pt-1.5">
      {/* Avatar: initials only for now — no photo upload, no colour picker
          yet (needs a `profiles` table that doesn't exist until SPEC.md
          milestone 2). */}
      <span className="bg-accent text-primary-hover font-display flex size-[68px] items-center justify-center rounded-full text-2xl font-semibold">
        {initial}
      </span>

      <button
        type="button"
        onClick={openDialog}
        className="flex items-center gap-1.5"
      >
        <span className="font-display text-[19px] font-semibold">{name}</span>
        <Pencil className="text-muted-foreground size-3.5" strokeWidth={2.2} />
      </button>
      <span className="text-caption text-muted-foreground -mt-1.5 font-sans">
        {email}
      </span>
      {memberSince ? (
        <span className="text-micro text-muted-foreground/70 font-mono">
          Member since {memberSince}
        </span>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Edit name</DialogTitle>
          <Field>
            <FieldLabel htmlFor="profile-name">Name</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="profile-name"
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void save();
                }}
              />
            </InputGroup>
          </Field>
          {error ? (
            <FieldError>
              <TriangleAlert className="size-3.5 shrink-0" strokeWidth={2.2} />
              {error}
            </FieldError>
          ) : null}
          <DialogFooter>
            <Button
              disabled={pending || !draft.trim()}
              onClick={() => void save()}
            >
              {pending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <User />
                  Save name
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
