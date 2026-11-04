/**
 * STUDIO FILTERS — the three filter pills above the studio grid
 * (Category / Price range / Sort by), matching the reference design.
 *
 * Concepts:
 * • This IS a client component ("use client") because selects are
 *   interactive — the server can't respond to onChange events.
 * • Instead of managing a filtered list in React state, changing a pill
 *   simply NAVIGATES to `/studios?category=...&priceRange=...&sort=...`.
 *   The page re-renders on the server with fresh data. That keeps the URL
 *   shareable/bookmarkable (great for a marketplace) and the filtering
 *   logic lives in one place: the server component.
 * • `router.push(..., { scroll: false })` stops the page jumping to the
 *   top every time a pill changes.
 * • Native <select> arrows render differently per OS, so we hide them
 *   (appearance-none) and place our own ChevronDown icon in the pill —
 *   consistent look everywhere.
 */

"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

type FilterChoice = { value: string; label: string };

/* Price ranges mapped to bounds the server understands. */
const PRICE_RANGES: readonly FilterChoice[] = [
  { value: "under-30", label: "Under $30" },
  { value: "30-60", label: "$30 – $60" },
  { value: "60-100", label: "$60 – $100" },
  { value: "over-100", label: "$100+" },
];

const SORT_OPTIONS: readonly FilterChoice[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

/* One filter pill: the select (native dropdown) plus a custom chevron. */
const FilterPill = ({
  label,
  value,
  choices,
  onChange,
}: {
  label: string;
  value: string;
  choices: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) => (
  <div className="relative">
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full sm:w-auto sm:min-w-[11rem] cursor-pointer appearance-none rounded-full border border-edge bg-surface py-0 pl-5 pr-10 text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-violet-500/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
    >
      {/* Empty value = "no filter selected" — treated as the label. */}
      <option value="">{label}</option>
      {choices.map((choice) => (
        <option key={choice.value} value={choice.value}>
          {choice.label}
        </option>
      ))}
    </select>

    {/* Custom chevron (pointer-events-none so clicks hit the select) */}
    <ChevronDown
      aria-hidden="true"
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
    />
  </div>
);

const StudioFilters = ({
  categories,
  category,
  priceRange,
  sort,
}: {
  /** Live category names from the API — the dropdown is never stale. */
  categories: string[];
  category: string;
  priceRange: string;
  sort: string;
}) => {
  const router = useRouter();

  // Build the new URL keeping every OTHER filter at its current value.
  // Empty value = clear that filter (so "All categories" just drops it).
  const navigate = (changedKey: string, changedValue: string) => {
    const params = new URLSearchParams();
    if (changedKey !== "category" && category) params.set("category", category);
    if (changedKey !== "priceRange" && priceRange) params.set("priceRange", priceRange);
    if (changedKey !== "sort" && sort) params.set("sort", sort);
    if (changedValue) params.set(changedKey, changedValue);

    const query = params.toString();
    router.push(query ? `/studios?${query}` : "/studios", { scroll: false });
  };

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3">
      {/* Category — options come straight from the loaded studios */}
      <FilterPill
        label="Category"
        value={category}
        choices={categories.map((name) => ({ value: name, label: name }))}
        onChange={(next) => navigate("category", next)}
      />

      {/* Price range */}
      <FilterPill
        label="Price range"
        value={priceRange}
        choices={PRICE_RANGES}
        onChange={(next) => navigate("priceRange", next)}
      />

      {/* Sort */}
      <FilterPill
        label="Sort by"
        value={sort}
        choices={SORT_OPTIONS}
        onChange={(next) => navigate("sort", next)}
      />

      {/* "Clear filters" link appears only when something is selected */}
      {(category || priceRange || sort) && (
        <button
          type="button"
          onClick={() => router.push("/studios", { scroll: false })}
          className="flex h-11 items-center rounded-full px-3 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default StudioFilters;
