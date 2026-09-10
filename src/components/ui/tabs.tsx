"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list text-muted-foreground inline-flex items-center justify-center group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        // subtle pill tabs
        default: "bg-muted h-9 w-fit rounded-lg p-[3px]",
        // the auth-style segmented toggle — see docs/DESIGN_SYSTEM.md §6
        segmented: "bg-muted h-11 w-full rounded-xl p-1",
        // underlined tabs
        line: "border-border w-fit gap-1 border-b",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "font-display text-label text-muted-foreground hover:text-foreground relative inline-flex flex-1 items-center justify-center gap-1.5 border border-transparent whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
        "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // default: pill lightens to --popover on active
        "group-data-[variant=default]/tabs-list:data-[state=active]:bg-popover group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground group-data-[variant=default]/tabs-list:h-[calc(100%-1px)] group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:px-2 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm",
        // segmented: volt-subtle fill + volt label + hairline volt border on active
        "group-data-[variant=segmented]/tabs-list:data-[state=active]:border-primary/40 group-data-[variant=segmented]/tabs-list:data-[state=active]:bg-primary-subtle group-data-[variant=segmented]/tabs-list:data-[state=active]:text-primary-hover group-data-[variant=segmented]/tabs-list:h-full group-data-[variant=segmented]/tabs-list:rounded-lg group-data-[variant=segmented]/tabs-list:px-3",
        // line: volt underline
        "group-data-[variant=line]/tabs-list:data-[state=active]:text-foreground group-data-[variant=line]/tabs-list:after:bg-primary group-data-[variant=line]/tabs-list:px-1 group-data-[variant=line]/tabs-list:pb-2 group-data-[variant=line]/tabs-list:after:absolute group-data-[variant=line]/tabs-list:after:inset-x-0 group-data-[variant=line]/tabs-list:after:-bottom-px group-data-[variant=line]/tabs-list:after:h-0.5 group-data-[variant=line]/tabs-list:after:opacity-0 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
