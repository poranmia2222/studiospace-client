import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  AudioLines,
  Camera,
  Clapperboard,
  Footprints,
  Mic,
  Palette,
  Video,
} from "lucide-react";

/* ------------------------------ Content ------------------------------ */

type Category = {
  icon: LucideIcon;
  name: string;
  description: string;
  /** Category-detail route this card links to ("/categories/[category]"). */
  href: string;
};

const CATEGORIES: readonly Category[] = [
  {
    icon: Camera,
    name: "Photo Studios",
    description: "Photo-ready spaces for shoots of every kind.",
    href: "/categories/photo-studios",
  },
  {
    icon: Clapperboard,
    name: "Film Stages",
    description: "Sound stages and sets ready for your next production.",
    href: "/categories/film-stages",
  },
  {
    icon: Mic,
    name: "Podcast Rooms",
    description: "Quiet, acoustically treated rooms for recording episodes.",
    href: "/categories/podcast-rooms",
  },
  {
    icon: AudioLines, // music/audio waveform (this lucide version has no plain "Music" icon)
    name: "Music Studios",
    description: "Rehearsal and recording rooms for musicians and producers.",
    href: "/categories/music-studios",
  },
  {
    icon: Palette,
    name: "Art Workshops",
    description: "Bright, open spaces to paint, sculpt, and create.",
    href: "/categories/art-workshops",
  },
  {
    icon: Footprints,
    name: "Dance Studios",
    description: "Mirror-walled practice rooms for dancers and choreographers.",
    href: "/categories/dance-studios",
  },
  {
    icon: Video,
    name: "Content Studios",
    description: "Creator-ready sets for streaming, vlogs, and social media.",
    href: "/categories/content-studios",
  },
] as const;

/* ------------------------------ Component ------------------------------ */

const Categories = async () => {

  

  return (
    // The id is a scroll anchor ("#categories") for future nav/footer links;
    // scroll-mt-24 stops the sticky navbar from covering the heading.
    <section id="categories" className="scroll-mt-24 border-t border-edge">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Explore Categories
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Find the{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Perfect Space
            </span>{" "}
            for Your Creativity.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            Explore different types of creative studios and find the right
            space for your next project.
          </p>
        </div>

        {/* Category cards: every card is one <Link>, so the whole card is
            clickable and keyboard-navigable without extra click handlers. */}
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <li key={category.name} className="h-full">
              <Link
                href={`/studios?category=${encodeURIComponent(category.name)}`}
                className="group flex h-full flex-col rounded-2xl border border-edge bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-primary">
                  <category.icon className="h-7 w-7" strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 text-lg font-semibold">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {category.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {/* Simple button under the grid */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/studios"
            className="group flex h-12 items-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 px-8 text-base font-medium text-white shadow-xl shadow-violet-600/30 transition-all hover:shadow-violet-500/40 hover:brightness-110 active:scale-[.98]"
          >
            Explore All Studios
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
