/**
 * HERO SLIDER — the image carousel in the homepage banner.
 *
 * Concepts:
 * • State: useState(index) remembers which slide is showing. Changing state
 *   re-renders the component with the new value — that's React's core loop.
 * • Side effects: useEffect schedules a timer to auto-advance the slider.
 *   The cleanup function it returns clears the old timer on every re-run so
 *   we never stack multiple timers (a classic React beginner bug).
 * • next/image: the <Image> component optimizes images (correct sizing,
 *   lazy-loading, formats). `fill` makes the image stretch to its parent
 *   box; `priority` only on the FIRST slide, so later ones load eagerly
 *   only when needed.
 * • The "slider" itself is CSS: one flex row holding all slides side by
 *   side, shifted with translateX(-index * 100%) and animated by a CSS
 *   transition. No slider library needed.
 * • Mouse handlers (`onMouseEnter/Leave`) pause autoplay while the user is
 *   looking/interacting — a nice UX touch.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Slide content — images live in /public/banner_images, served at "/banner_images".
const SLIDES = [
  {
    src: "/banner_images/banner1.jpg",
    eyebrow: "Rent",
    title: "Book pro studios by the hour",
    cta: { label: "Rent a studio", href: "/studios" },
  },
  {
    src: "/banner_images/banner2.jpg",
    eyebrow: "Host",
    title: "Turn your space into creative income",
    cta: { label: "Start hosting", href: "/signup" },
  },
  {
    src: "/banner_images/banner3.jpg",
    eyebrow: "Create",
    title: "Shoot, rehearse & produce your next work",
    cta: { label: "Explore studios", href: "/studios" },
  },
] as const;

const SLIDE_INTERVAL_MS = 5000; // how long each slide stays visible

export function HeroSlider() {
  // Which slide is on screen (0, 1, 2...).
  const [index, setIndex] = useState(0);
  // "Hovering pauses the carousel" toggle.
  const [paused, setPaused] = useState(false);

  // Auto-play: re-runs whenever `paused` changes; the returned cleanup
  // cancels the previous interval before scheduling the next one.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length), // wrap 2 -> 0
      SLIDE_INTERVAL_MS,
    );
    return () => clearInterval(id); // cleanup — prevents timer stacking
  }, [paused]);

  // step(-1) is "previous", step(1) is "next". The `+ length` keeps the
  // result positive so the modulo wrap-around works both directions.
  const go = (delta: number) =>
    setIndex((i) => (i + delta + SLIDES.length) % SLIDES.length);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-edge bg-surface shadow-2xl shadow-black/40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Sliding track: translateX moves the whole row of slides leftwards.
          `duration-700 ease-out` animates the movement smoothly. */}
      <div
        className="flex h-[380px] transition-transform duration-700 ease-out sm:h-[460px]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map(
          (slide, i) => (
            <div
              key={slide.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              className="relative h-full w-full shrink-0"
            >
              {/* `fill` = image fills the parent box; object-cover keeps the
                  photo cropped nicely instead of stretched. */}
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
              {/* Legibility overlay: dark gradient so white caption text is
                  readable on any photo. aria-hidden = purely decorative. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
              />
              {/* Slide caption + call-to-action */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300">
                    {slide.eyebrow}
                  </p>
                  <p className="mt-1.5 max-w-xs text-lg font-semibold leading-snug text-white sm:text-xl">
                    {slide.title}
                  </p>
                  <Link
                    href={slide.cta.href}
                    className="mt-3 inline-flex h-9 items-center rounded-full bg-white/95 px-4 text-sm font-medium text-black transition-colors hover:bg-white"
                  >
                    {slide.cta.label}
                  </Link>
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Arrows: step(-1) / step(1). aria-label explains them to screen
          readers because they contain only an icon. */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </button>

      {/* Dots: quick jump buttons; the active dot stretches wide. */}
      <div className="absolute bottom-5 right-5 flex gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
