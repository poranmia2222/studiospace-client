"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Tells server and client renders apart without an effect+setState: the
// server snapshot is always false, the browser one always true. Once the
// component hydrates we know next-themes has applied the stored theme and
// the toggle can safely reflect (and switch) it.
const noopSubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(noopSubscribe, () => true, () => false);

/**
 * Light ↔ dark switcher, shown in the navbar on every page.
 *
 * • Clicking it flips the theme and next-themes persists the choice.
 * • Before hydration the button renders a neutral disabled Moon on both
 *   server and client (the stored theme isn't known yet), so there's no
 *   hydration mismatch from pre-rendering Sun/Moon.
 */
const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  // "dark" is the default; resolvedTheme resolves null/system to a color.
  const isDark = mounted && resolvedTheme === "light" ? false : true;
  const canToggle = mounted && Boolean(resolvedTheme);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      disabled={!canToggle}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={canToggle && !isDark ? "Switch to dark theme" : "Switch to light theme"}
      title={canToggle && !isDark ? "Switch to dark theme" : "Switch to light theme"}
      className={cn("rounded-full border-edge bg-surface text-foreground hover:bg-overlay", className)}
    >
      {isDark ? (
        <Sun aria-hidden="true" />
      ) : (
        <Moon aria-hidden="true" />
      )}
    </Button>
  );
};

export default ThemeToggle;
