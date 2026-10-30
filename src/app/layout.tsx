/**
 * ROOT LAYOUT — wraps every page in the app.
 *
 * Concepts a recruiter might ask about:
 * • "layout.tsx" is a special Next.js file: every page inside src/app renders
 *   inside it. We use it for the shared HTML shell (<html>, <body>) so the
 *   navbar appears on every route without repeating code.
 * • "next/font/google" self-hosts Google Fonts at build time (no external
 *   request at runtime, no layout shift). We load both weights as CSS
 *   variables (--font-geist-sans / --font-geist-mono) that our theme wires up
 *   in globals.css.
 * • `LayoutProps<"/">` is Next 16's generated type for this route — typed
 *   props instead of hand-written TypeScript.
 * • `metadata` sets the <title> and <meta name="description"> for SEO; it's
 *   exported from a Server Component (this file has no interactivity).
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// The Atlanta-based Geist font pair (sans for UI, mono for code snippets).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Static site metadata — this is what search engines and browser tabs show.
export const metadata: Metadata = {
  title: "StudioSpace",
  description:
    "Peer-to-peer creative workspace & production studio sharing platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // `h-full` + `antialiased` (smoother font rendering) come from the
    // create-next-app scaffold; everything else is ours.
    <html
      lang="en"
      // data-scroll-behavior tells Next.js it can temporarily disable our
      // CSS smooth-scrolling when navigating between routes (so pages
      // appear at the top instantly instead of gliding down the page).
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* One navbar instance, rendered above every page. */}
        <Navbar />
        {/* Each route's page.tsx renders in place of this variable. */}
        {children}
        {/* One footer instance, rendered below every page. */}
        <Footer />
      </body>
    </html>
  );
}
