/**
 * NOT FOUND PAGE (convention file: src/app/not-found.tsx)
 *
 * • Next.js App Router convention: this file renders whenever `notFound()`
 *   is thrown in a route segment OR when a URL matches no route at all
 *   (the root app/not-found handles unmatched URLs app-wide).
 * • Server Component — it's fully static, no interactivity needed; the
 *   "Return to Home" button is just a <Link> (a server-safe anchor).
 * • Renders inside the root layout, so Navbar + Footer stay on screen;
 *   `flex-1` on <main> pushes the footer to the bottom on short pages.
 */

import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex-1">
      <div className="mx-auto flex w-full max-w-6xl justify-center px-4 sm:px-6 py-12 sm:py-20">
        {/* Same friendly card style as the StatusCard empty/error states
            on the studios grid — icon tile, heading, description. */}
        <div className="flex max-w-md flex-col items-center rounded-2xl border border-edge bg-surface px-8 py-14 text-center shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-primary">
            <Compass className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
          </span>

          <p className="mt-5 text-5xl font-bold tracking-tight text-primary">
            404
          </p>
          <h2 className="mt-3 text-lg font-semibold text-foreground">
            Page not found
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            The page you&apos;re looking for doesn&apos;t exist, moved, or may
            have been taken down.
          </p>

          <Button
            type="button"
            size="lg"
            className="mt-7 w-full sm:w-auto"
            render={<Link href="/" />}
          >
            Return to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
