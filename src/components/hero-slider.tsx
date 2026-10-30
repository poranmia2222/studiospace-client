"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const SLIDE_INTERVAL_MS = 5000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [paused]);

  const go = (delta: number) =>
    setIndex((i) => (i + delta + SLIDES.length) % SLIDES.length);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-edge bg-surface shadow-2xl shadow-black/40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Sliding track */}
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
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
              {/* Legibility overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
              />
              {/* Slide caption */}
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

      {/* Arrows */}
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

      {/* Dots */}
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
