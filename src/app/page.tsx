/**
 * HOME PAGE (route "/")
 *
 * Concepts:
 * • In the App Router, creating a folder under src/app + a page.tsx file
 *   creates a route. src/app/page.tsx = the home page ("/").
 * • This file is a Server Component (no "use client"): it runs only on the
 *   server, ships zero JavaScript to the browser, and composes the
 *   interactive pieces (Banner, HowItWorks) which ARE client components.
 * • The page is a thin "composition layer" — each section lives in its own
 *   component file so it stays easy to test, tweak and explain.
 */

import Banner from "@/components/Banner"; // hero + banner image slider
import Categories from "@/components/Categories"; // studio category cards
import HowItWorks from "@/components/HowItWorks"; // interactive journey tabs
import AboutUs from "@/components/AboutUs"; // story, mission & features
import FeaturedSection from "@/components/FeaturedSection";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero / banner section (top of the homepage). */}
      <Banner />

      <FeaturedSection />
      
      <Categories />

      {/* "How it works" — renter vs host tabs + steps + CTA.
          The id lets navbar links scroll straight here ("/#how-it-works"). */}
      <HowItWorks />

      {/* About Us (scroll target: /#about-us) — story, mission & vision,
          and "Why choose StudioSpace" feature cards. */}
      <AboutUs />
    </main>
  );
}
