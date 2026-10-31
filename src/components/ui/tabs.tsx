/**
 * TABS (shadcn/ui style) — a thin styling wrapper around Base UI's tabs
 * primitive (@base-ui/react/tabs), the same library the existing
 * ui/button.tsx already uses.
 *
 * Why a wrapper? Base UI handles ALL the hard accessibility work for us
 * (ARIA roles, roving tabindex, arrow-key navigation, focusing panels).
 * Our job here is only to give the pieces nice classes that fit the
 * StudioSpace theme (dark cards, violet→fuchsia gradient for the active
 * tab) — exactly what shadcn/ui components do.
 *
 * How styling works: Base UI adds a `data-active` attribute to the tab
 * that is currently selected. Tailwind's `data-[active]:` variant only
 * applies the classes after it when that attribute is present, so the
 * active tab paints itself with the gradient — no extra state to check.
 */

"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

/* The whole control: holds <TabsList> and one or more <TabsContent>.
   Core props: defaultValue (which tab starts open), value + onValueChange
   (to control it yourself), orientation ("horizontal" is the default). */
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/* The rounded pill container that sits behind the tab buttons. */
function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-full border border-edge bg-surface p-1 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

/* One tab button. Set a matching `value` on it and on a <TabsContent>.
   Base UI toggles `data-active` when the tab is selected — the
   data-[active]: classes below style only the selected tab. */
function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab>) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        // Shared look (applies to every tab).
        "inline-flex h-10 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium whitespace-nowrap text-muted",
        "transition-all duration-300 motion-reduce:transition-none",
        "hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
        "disabled:pointer-events-none disabled:opacity-50",
        // Selected look: the gradient pill, applied via data-[active].
        "data-[active]:bg-gradient-to-r data-[active]:from-violet-500 data-[active]:to-fuchsia-600 data-[active]:text-white data-[active]:shadow-md data-[active]:shadow-violet-600/30",
        className,
      )}
      {...props}
    />
  );
}

/* The content area for one tab. Give it the same `value` as its trigger.
   By default Base UI UNMOUNTS inactive panels (removes them from the DOM,
   same as shadcn/ui's Radix Tabs) — pass keepMounted to <TabsContent> if
   you need the content to stay mounted. With keepMounted, panels are kept
   in the DOM via a `hidden` attribute, so this wrapper must NOT set a
   `display` utility (like flex) — that would override the browser's
   display:none and un-hide the panel. */
function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return (
    <TabsPrimitive.Panel
      className={cn(
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
