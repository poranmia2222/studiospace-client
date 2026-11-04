"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StudioCard, { type Studio } from "./StudioCard";

/**
 * Horizontal snap-scroll carousel of featured studio cards.
 *
 * No carousel library — native CSS scroll snapping with prev/next
 * buttons that scroll one card at a time. Edge buttons disable
 * themselves at either end, and the scrollbar is hidden.
 */
const FeaturedCarousel = ({ studios }: { studios: Studio[] }) => {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    // Track layout changes (resize, font/img load) so the arrow
    // enabled states stay accurate.
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", updateArrows);
    };
  }, [updateArrows, studios.length]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // Advance by one card slot: card width + the flex gap.
    const item = el.querySelector<HTMLElement>(".snap-start");
    const step = (item?.offsetWidth ?? el.clientWidth) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured studios"
    >
      {/* Prev / Next — overlay circles on the sides, disabled at the ends */}
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        disabled={!canPrev}
        aria-label="Previous studios"
        className="absolute top-1/2 left-0 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-edge bg-surface text-foreground shadow-md transition-[opacity,background-color] hover:bg-overlay disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        disabled={!canNext}
        aria-label="Next studios"
        className="absolute top-1/2 right-0 z-10 flex h-9 w-9 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-edge bg-surface text-foreground shadow-md transition-[opacity,background-color] hover:bg-overlay disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Fades hinting there's more content off-screen */}
      {canPrev && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-0 z-[5] w-8 rounded-l-2xl bg-gradient-to-r from-background to-transparent"
        />
      )}
      {canNext && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 right-0 z-[5] w-8 rounded-r-2xl bg-gradient-to-l from-background to-transparent"
        />
      )}

      {/* Track: one card per snap slot (≈3 visible on desktop, like the
          old grid) with the scrollbar hidden */}
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {studios.map((studio, index) => (
          <li
            key={studio._id ?? `${studio.title}-${index}`}
            data-slot="carousel-item"
            className="flex w-[86%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${studios.length}`}
          >
            <StudioCard studio={studio} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturedCarousel;
