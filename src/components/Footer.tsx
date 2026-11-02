"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { LogoMark } from "@/components/Navbar";

/* ------------------------------ Content ------------------------------ */

const MISSION =
  "StudioSpace connects creative people with studio owners, making it easier to find and share the perfect creative space.";

// Brand wordmark row — same look as the navbar logo (LogoMark is reused).
function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-lg font-semibold tracking-tight">
        Studio<span className="text-muted">Space</span>
      </span>
    </Link>
  );
}

/* ----- Social icon SVGs (brand logos were removed from this lucide version) ----- */

type IconProps = { className?: string };

function XIcon({ className }: IconProps) {
  // Official X logo — a solid fill mark, not the old outlined Twitter bird.
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 22.144h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

type SocialLink = {
  label: string;
  href: string;
  Icon: (props: IconProps) => React.JSX.Element;
};

const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "X", href: "https://x.com/studiospace", Icon: XIcon },
  { label: "Instagram", href: "https://instagram.com/studiospace", Icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com/@studiospace", Icon: YoutubeIcon },
  { label: "LinkedIn", href: "https://linkedin.com/company/studiospace", Icon: LinkedinIcon },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about-us" },
  { label: "List Your Studio", href: "/add-studio" },
  { label: "Sign In", href: "/signin" },
] as const;

// Same category routes the Categories section links to.
const POPULAR_CATEGORIES = [
  { label: "Photo Studios", href: "/categories/photo-studios" },
  { label: "Film Stages", href: "/categories/film-stages" },
  { label: "Podcast Rooms", href: "/categories/podcast-rooms" },
  { label: "Music Studios", href: "/categories/music-studios" },
] as const;

// One class string reused by every footer column heading, so they all match.
const COLUMN_TITLE_CLASSES =
  "text-xs font-semibold uppercase tracking-[0.2em] text-muted";

/* ------------------------------ Newsletter ------------------------------ */

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // stop the browser doing a full-page reload
    // `required` + type="email" mean the browser only "submits" valid emails;
    // a real app would send the email to an API route here.
    setSubscribed(true);
  };

  // After subscribing, swap the form for a confirmation message.
  if (subscribed) {
    return (
      <p
        role="status"
        className="rounded-2xl border border-edge bg-background px-4 py-3 text-sm text-muted"
      >
        Thanks — you&apos;re on the list! We&apos;ll be in touch at{" "}
        <span className="text-foreground">{email}</span>.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* Controlled input: React state is the single source of truth. */}
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
        className="h-10 min-w-0 flex-1 rounded-full border border-edge bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus-visible:border-violet-500/60"
      />
      <button
        type="submit"
        className="h-10 shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 px-5 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition-all hover:brightness-110 active:scale-[.98]"
      >
        Subscribe
      </button>
    </form>
  );
}

/* ------------------------------ Component ------------------------------ */

// The copyright year is a plain constant. Prerendered (static) pages cannot
// include live-clock values — our Cache Components setup blocks new Date()
// during prerender — so we bump this manually each January. If it ever needs
// to update itself, compute it on the server behind <Suspense> instead.
const COPYRIGHT_YEAR = 2026;

const Footer = () => {

  return (
    <footer className="border-t border-edge bg-surface">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr] lg:gap-8">
          {/* Brand: logo, mission statement, social links */}
          <div>
            <Brand />
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted">
              {MISSION}
            </p>
            <div className="mt-5 flex gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`StudioSpace on ${label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-edge bg-overlay-soft text-muted transition-colors hover:border-muted hover:bg-overlay hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick navigation */}
          <nav aria-label="Footer">
            <h3 className={COLUMN_TITLE_CLASSES}>Quick Links</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Popular studio categories */}
          <div>
            <h3 className={COLUMN_TITLE_CLASSES}>Popular Categories</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {POPULAR_CATEGORIES.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter signup */}
          <div>
            <h3 className={COLUMN_TITLE_CLASSES}>Newsletter</h3>
            <p className="mt-5 text-sm leading-6 text-muted">
              Studio tips and fresh listings, straight to your inbox.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Copyright & terms notice */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-edge pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted">
            © {COPYRIGHT_YEAR} StudioSpace. All rights reserved.
          </p>
          <div className="flex gap-6">
            {/* Placeholder pages — swap the "#" for real routes when built. */}
            <Link
              href="#"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
