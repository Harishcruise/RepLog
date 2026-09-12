"use client";

import { CheckIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { SetBadge } from "./set-badge";
import { DEFAULT_SET_TYPE, SET_TYPES, type SetType } from "./set-type";

type SetTypePickerProps = {
  setNumber: number;
  type: SetType;
  onTypeChange: (type: SetType) => void;
};

/**
 * The SET badge, doubling as the trigger for its own type picker — tappable
 * whether the set is pending or already logged, so a set can be re-tagged
 * after the fact. Built on Radix's DropdownMenu (tap/click to open, built-in
 * flip near the viewport edge) rather than ContextMenu, which only opens on
 * right-click / long-press.
 */
export function SetTypePicker({
  setNumber,
  type,
  onTypeChange,
}: SetTypePickerProps) {
  const currentLabel =
    SET_TYPES.find((t) => t.value === type)?.label ?? "Normal";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* padding + matching negative margin pads the tap target to ~40px
            without the 22px badge nudging the row's SET column layout */}
        <button
          type="button"
          aria-label={`Set ${setNumber} type: ${currentLabel}. Tap to change.`}
          className="focus-visible:ring-ring/50 -m-[9px] rounded-lg p-[9px] outline-none focus-visible:ring-[3px]"
        >
          <SetBadge setNumber={setNumber} type={type} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[172px] p-1.5">
        <DropdownMenuRadioGroup
          value={type}
          onValueChange={(value) => onTypeChange(value as SetType)}
        >
          {SET_TYPES.map((option) => {
            const selected = option.value === type;
            const isDefault = option.value === DEFAULT_SET_TYPE;
            return (
              <DropdownMenuPrimitive.RadioItem
                key={option.value}
                value={option.value}
                className={cn(
                  "flex cursor-default items-center justify-between rounded-lg px-2.5 py-2 text-[12.5px] font-semibold outline-hidden select-none",
                  selected
                    ? "bg-[oklch(0.30_0.06_141)] text-[oklch(0.86_0.16_137)]"
                    : optionTextClass(option.value),
                )}
              >
                <span className="flex items-center gap-1.5">
                  {option.label}
                  {selected && <CheckIcon className="size-3.5" />}
                </span>
                {isDefault && (
                  <span className="text-[9.5px] font-semibold tracking-[0.02em] opacity-75">
                    DEFAULT
                  </span>
                )}
              </DropdownMenuPrimitive.RadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
        <p className="text-muted-foreground border-border mt-0.5 border-t px-2.5 pt-1.5 pb-0.5 text-[10px] leading-[13px] italic">
          Normal is the default — no carry-over between sets.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function optionTextClass(type: SetType) {
  switch (type) {
    case "warmup":
      return "text-[oklch(0.88_0.11_78)]";
    case "dropset":
      return "text-[oklch(0.85_0.12_305)]";
    case "failure":
      return "text-[oklch(0.80_0.15_25)]";
    case "normal":
      return "text-popover-foreground";
  }
}
