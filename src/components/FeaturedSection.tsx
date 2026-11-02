import React from 'react';
import StudioCard, { type Studio } from './StudioCard';
import FeaturedCarousel from './FeaturedCarousel';

const FeaturedSection = async() => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/featured-studios`, {
        cache: "no-store", // always fresh
    });
    const body = await res.json().catch(() => null);

    // The API may send a bare array, or wrapped (e.g. { data: [...] }) —
    // handle the common shapes so the UI doesn't depend on one exact JSON.
    const studios: Studio[] = Array.isArray(body)
        ? body
        : body?.data ?? body?.studios ?? body?.results ?? [];

    return (
        // Same section wrapper as the other homepage blocks (Categories,
        // HowItWorks, AboutUs): full-width band + shared max-w-6xl container
        // so every section's content lines up. The id is a scroll anchor;
        // scroll-mt-24 keeps the sticky navbar clear of the heading.
        <section id="featured" className="scroll-mt-24">
            <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
                {/* Section header — same eyebrow/heading style as Categories */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        Handpicked For You
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                        Featured{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                            Studios
                        </span>
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted">
                        The most-loved spaces on StudioSpace, ready to book for
                        your next session.
                    </p>
                </div>

                {/* Carousel sits inside the shared container, so its slide
                    widths match the 3-up rhythm of the category grid. */}
                <div className="mt-12">
                    <FeaturedCarousel studios={studios} />
                </div>
            </div>
        </section>
    );
};

export default FeaturedSection;
