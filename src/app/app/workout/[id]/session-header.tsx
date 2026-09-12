"use client";

import { ChevronLeft, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

import type { ActiveSessionController } from "./use-active-session";

type SessionHeaderProps = {
  controller: ActiveSessionController;
};

function formatElapsed(totalSeconds: number) {
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

/** Sticky header: back, session name (tap to rename), elapsed timer, Finish,
 *  overflow (rename / discard). No back-to-tabs chrome behind it — this
 *  screen owns its own chrome, same as Profile and Body. */
export function SessionHeader({ controller }: SessionHeaderProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [draft, setDraft] = useState(controller.name);
  const [discardOpen, setDiscardOpen] = useState(false);

  function openRename() {
    setDraft(controller.name);
    setRenameOpen(true);
  }

  function saveRename() {
    controller.rename(draft);
    setRenameOpen(false);
  }

  return (
    <header className="border-border flex items-center justify-between border-b px-4 pt-4.5 pb-3">
      {/* No max-w cap here — matches TabHeader (Home's header), which also
          spreads its content to the true viewport edges on desktop rather
          than capping to the body's centered column width. */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Back to Home — session keeps running"
          onClick={controller.leaveRunning}
        >
          <ChevronLeft />
        </Button>

        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={openRename}
            className="flex items-center gap-1.5"
          >
            <span className="font-display text-[16px] font-semibold">
              {controller.name}
            </span>
            <Pencil
              className="text-muted-foreground size-3"
              strokeWidth={2.2}
            />
          </button>
          <span className="text-micro text-muted-foreground font-mono">
            {formatElapsed(controller.elapsedSeconds)} elapsed
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button size="sm" onClick={controller.finish}>
          Finish
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Session options">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={openRename}>
              <Pencil /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setDiscardOpen(true)}
            >
              <Trash2 /> Discard
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogTitle>Rename session</DialogTitle>
          <Field>
            <FieldLabel htmlFor="session-name">Name</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="session-name"
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveRename();
                }}
              />
            </InputGroup>
          </Field>
          <DialogFooter>
            <Button disabled={!draft.trim()} onClick={saveRename}>
              Save name
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard this session?</AlertDialogTitle>
            <AlertDialogDescription>
              Every set logged so far will be lost. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep session</AlertDialogCancel>
            <AlertDialogAction onClick={controller.discard}>
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
