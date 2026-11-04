import Link from "next/link";
import { HeroSlider } from "@/components/hero-slider";

const HIGHLIGHTS = [
  {
    title: "Rent photo, film & rehearsal studios",
    icon: (
      <path d="M8 6 5 3m16 3-3-3M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    ),
  },
  {
    title: "Book hourly, half-day or full-day",
    icon: <path d="M12 8v4l2.5 2.5M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />,
  },
  {
    title: "Host your idle space & earn",
    icon: <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Zm5-3.5h.01" />,
  },
] as const;

function HighlightIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-primary"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const Banner = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow + dotted texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-[-10%] h-[640px] w-[640px] rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute bottom-[-30%] right-[-5%] h-[520px] w-[520px] rounded-full bg-fuchsia-600/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Left: copy */}
          <div>
            {/* Eyebrow badge (static dot — motion is limited to the hero slider) */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-violet-500/10 py-1.5 pl-2 pr-4">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                Peer-to-peer creative marketplace
              </span>
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Space to{" "}
              <span className="relative whitespace-nowrap">
                create
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 12"
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-primary"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C25 3 60 3 118 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                </svg>
            </span>
              .{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-fuchsia-600 bg-clip-text text-transparent">
                Rooms that earn.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
              Book professional studios by the hour, or list your own space and
              turn idle hours into income — direct, fair and built for
              creatives.
            </p>

            <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {HIGHLIGHTS.map((highlight) => (
                <li
                  key={highlight.title}
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground"
                >
                  <HighlightIcon>{highlight.icon}</HighlightIcon>
                  {highlight.title}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/studios"
                className="group flex h-12 items-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 px-8 text-base font-medium text-white shadow-xl shadow-violet-600/30 transition-all hover:shadow-violet-500/40 hover:brightness-110 active:scale-[.98]"
              >
                Explore Studios
                <span
                  aria-hidden="true"
                  className="ml-2 transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <Link
                href="/signup"
                className="flex h-12 items-center rounded-full border border-edge bg-overlay-soft px-8 text-base font-medium text-foreground transition-colors hover:border-muted hover:bg-overlay"
              >
                Host Your Space
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted">
              Free to join · No booking fees for hosts · Cancel 24h ahead
            </p>
          </div>

          {/* Right: banner slider + floating chips */}
          <div className="relative">
            <HeroSlider />

            <div className="absolute -left-4 -top-4 hidden items-center gap-2.5 rounded-2xl border border-edge bg-surface/90 p-3 pr-4 shadow-xl shadow-black/40 backdrop-blur sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm text-white">
                ✦
              </span>
              <span className="text-xs leading-tight">
                <span className="block font-semibold">8.4k bookings</span>
                <span className="text-muted">this month</span>
              </span>
            </div>

            <div className="absolute -bottom-4 right-6 hidden items-center gap-2.5 rounded-2xl border border-edge bg-surface/90 p-3 pr-4 shadow-xl shadow-black/40 backdrop-blur sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm text-white">
                ★
              </span>
              <span className="text-xs leading-tight">
                <span className="block font-semibold">4.9 average</span>
                <span className="text-muted">host rating</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
