"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * next-themes wrapper rendered once, in the root layout.
 *
 * • attribute="data-theme" → next-themes writes <html data-theme="light|dark">;
 *   globals.css keys both palettes and the `dark:` custom variant off that
 *   same attribute, so every token-based utility (bg-surface, text-muted…)
 *   switches together.
 * • defaultTheme="dark", enableSystem={false} → StudioSpace keeps its dark
 *   brand look until the visitor explicitly toggles; once they do, the
 *   choice is stored in localStorage and honored on later visits.
 */
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;
