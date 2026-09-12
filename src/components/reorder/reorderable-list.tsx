"use client";

import { Reorder, useDragControls, type DragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { createContext, useContext, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Generic drag-to-reorder primitives, independent of what's inside each
 * item — the Active Session screen uses these for exercise cards today,
 * but templates/exercise-builder screens (ordered exercises, ordered sets)
 * are an expected future user of the same three pieces.
 *
 * `ReorderList` wraps the group; `DraggableItem` wraps one row and owns its
 * drag controls; `DragHandle`, placed anywhere inside a `DraggableItem`,
 * reads those controls from context and is the only thing that starts a
 * drag. Nothing else inside the item — buttons, menus, taps — is at risk
 * of being mistaken for a reorder gesture.
 */

type ReorderListProps<T> = {
  values: T[];
  onReorder: (next: T[]) => void;
  children: ReactNode;
  className?: string;
};

export function ReorderList<T>({
  values,
  onReorder,
  children,
  className,
}: ReorderListProps<T>) {
  return (
    <Reorder.Group
      axis="y"
      values={values}
      onReorder={onReorder}
      className={cn("flex flex-col gap-3", className)}
    >
      {children}
    </Reorder.Group>
  );
}

const DragControlsContext = createContext<DragControls | null>(null);

type DraggableItemProps<T> = {
  value: T;
  children: ReactNode;
  className?: string;
};

export function DraggableItem<T>({
  value,
  children,
  className,
}: DraggableItemProps<T>) {
  const dragControls = useDragControls();

  return (
    <DragControlsContext.Provider value={dragControls}>
      <Reorder.Item
        value={value}
        dragListener={false}
        dragControls={dragControls}
        // select-none: a mouse drag that briefly slips off the handle onto
        // sibling text (a real risk since the handle is small) would
        // otherwise start a native text selection instead of continuing
        // the drag.
        className={cn("select-none", className)}
      >
        {children}
      </Reorder.Item>
    </DragControlsContext.Provider>
  );
}

type DragHandleProps = {
  "aria-label": string;
  className?: string;
};

/** Must render inside a `DraggableItem`. */
export function DragHandle({
  "aria-label": ariaLabel,
  className,
}: DragHandleProps) {
  const dragControls = useContext(DragControlsContext);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onPointerDown={(e) => {
        // Without this, a drag that doesn't cleanly engage Framer's pointer
        // capture falls back to native text selection on desktop.
        e.preventDefault();
        dragControls?.start(e);
      }}
      className={cn(
        "text-muted-foreground flex size-7 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing",
        className,
      )}
    >
      <GripVertical className="size-4" />
    </button>
  );
}
