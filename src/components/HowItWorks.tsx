"use client";

import Link from "next/link";
import { useState } from "react";

const AUDIENCES = {
  rent: {
    label: "I want to rent",
    steps: [
      {
        title: "Browse & compare studios",
        description:
          "Filter photo, film and rehearsal spaces by location, gear, capacity and hourly rate. Real photos, real availability.",
      },
      {
        title: "Book your slot",
        description:
          "Choose hourly, half-day or full-day rental, message the host to agree details, and confirm instantly online.",
      },
      {
        title: "Create & review",
        description:
          "Show up and start producing. After the session, leave a review to help the next creative book with confidence.",
      },
    ],
  },
  host: {
    label: "I want to host",
    steps: [
      {
        title: "List your space",
        description:
          "Publish your workspace with photos, amenities, house rules and your own pricing — you stay in full control.",
      },
      {
        title: "Approve & host bookings",
        description:
          "Chat with creatives, approve the requests that fit your schedule and manage every booking from one dashboard.",
      },
      {
        title: "Earn & grow",
        description:
          "Get paid for time your space sits empty and build a reputation through reviews that keep bookings rolling in.",
      },
    ],
  },
} as const;

type AudienceKey = keyof typeof AUDIENCES;

const HowItWorks = () => {
  const [audience, setAudience] = useState<AudienceKey>("rent");
  const [activeStep, setActiveStep] = useState(0);

  const current = AUDIENCES[audience];
  const step = current.steps[activeStep];

  const selectAudience = (key: AudienceKey) => {
    setAudience(key);
    setActiveStep(0);
  };

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-t border-edge bg-surface/50"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        {/* Heading + audience tabs */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              How It Works
            </h2>
            <p className="mt-3 max-w-md text-muted">
              Three steps between an empty room and your next project. Pick
              your side to see the path.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Choose your side"
            className="flex w-fit rounded-full border border-edge bg-surface p-1"
          >
            {(Object.keys(AUDIENCES) as AudienceKey[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={audience === key}
                onClick={() => selectAudience(key)}
                className={`h-9 rounded-full px-5 text-sm font-medium transition-all ${
                  audience === key
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-600/25"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {AUDIENCES[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Steps + detail panel */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          {/* Step list */}
          <div
            key={audience}
            className="animate-step-in flex flex-col gap-3"
            role="tabpanel"
          >
            {current.steps.map((s, index) => {
              const isActive = index === activeStep;
              return (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  aria-expanded={isActive}
                  className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
                    isActive
                      ? "border-violet-500/50 bg-surface shadow-lg shadow-violet-600/10"
                      : "border-edge bg-surface/60 hover:border-muted hover:bg-surface"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30"
                        : "bg-white/[.06] text-muted"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span>
                    <span className="block font-semibold">{s.title}</span>
                    <span
                      className={`mt-1 block text-xs transition-colors ${
                        isActive ? "text-primary" : "text-muted"
                      }`}
                    >
                      {isActive ? "Selected — see details →" : "Tap to preview"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="relative overflow-hidden rounded-2xl border border-edge bg-surface p-7 lg:sticky lg:top-24 lg:self-start">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-600/15 blur-3xl"
            />
            <div key={step.title} className="animate-step-in relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                {AUDIENCES[audience].label} · Step {activeStep + 1} of{" "}
                {current.steps.length}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-4 leading-8 text-muted">
                {step.description}
              </p>
              <Link
                href={audience === "rent" ? "/studios" : "/signup"}
                className="mt-7 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition-colors hover:bg-primary-strong"
              >
                {audience === "rent" ? "Browse studios" : "List your space"}
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
