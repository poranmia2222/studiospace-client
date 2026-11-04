import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, MapPin, Star, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* The data schema for one studio coming from GET /studios. */
export type Studio = {
  _id?: string;
  title: string;
  category: string;
  status: string;
  description: string;
  location: string;
  hourlyRate: number;
  rating: number;
  capacity: number;
  amenities: string[];
  images: string[];
  name?: string;
  email?: string;
  emailId?: string;
  /* Optional owner-set availability (set on the edit form, posted as
     plain strings; guests pick a slot on the studio page). */
  availabilityDate?: string; // "YYYY-MM-DD"
  startTime?: string;        // "HH:MM"
  endTime?: string;          // "HH:MM"
};

/* Same hover treatment as the homepage cards (Categories / How It Works). */
const CARD_HOVER =
  "transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const StudioCard = ({
  studio,
  className,
}: {
  studio: Studio;
  className?: string;
}) => {
  // The first image is the cover for the card top; if the API ever returns
  // a studio without images, we show a neutral placeholder instead.
  const cover = studio.images?.[0];
  // Show at most 3 amenity chips; "+2 more" summarizes the rest.
  const amenities = studio.amenities?.slice(0, 3) ?? [];
  const extraAmenities = Math.max((studio.amenities?.length ?? 0) - 3, 0);

  return (
    <article
      className={cn(
        "group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-edge bg-surface",
        CARD_HOVER,
        className,
      )}
    >
      {/* -------- Cover image + badges -------- */}
      <div className="relative h-48 shrink-0 overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={`Cover photo of ${studio.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          // Fallback tile when a studio has no photos yet
          <div className="flex h-full items-center justify-center bg-violet-500/10 text-primary">
            <Camera className="h-10 w-10" strokeWidth={1.5} aria-hidden="true" />
          </div>
        )}

        {/* Legibility gradient for the badges */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
        />

        {/* Category badge (e.g. "Content Studios") */}
        <span className="absolute left-3 top-3 max-w-[60%] truncate rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {studio.category}
        </span>

        {/* Rating badge (e.g. "★ 4.9") */}
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <Star
            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
          {studio.rating.toFixed(1)}
        </span>
      </div>

      {/* -------- Content -------- */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold">{studio.title}</h3>

        {/* Location + capacity are the two key facts under the title */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin
              className="h-4 w-4 text-primary"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            {studio.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users
              className="h-4 w-4 text-primary"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            Up to {studio.capacity} people
          </span>
        </div>

        {/* flex-1 grows this block so short descriptions still stretch to
            the same card height — the price footer always sits at the
            bottom, giving every card in a row an identical footprint. */}
        <p className="mt-3 flex-1 line-clamp-2 text-sm leading-6 text-muted">
          {studio.description}
        </p>

        {/* Amenity chips: first 3 perks + a "+N more" for the rest.
            The row always reserves one chip-line of height (min-h-7)
            and is simply hidden for studios with none, so a card with
            0, 1 or 3 amenities keeps its price footer at exactly the
            same position as its neighbours. */}
        <ul
          className={cn(
            "mt-4 flex min-h-7 flex-wrap items-start gap-2",
            amenities.length === 0 && "hidden",
          )}
        >
          {amenities.map((amenity) => (
            <li
              key={amenity}
              className="rounded-full border border-edge bg-overlay-soft px-2.5 py-1 text-xs text-muted"
            >
              {amenity}
            </li>
          ))}
          {extraAmenities > 0 && (
            <li className="rounded-full border border-violet-500/40 px-2.5 py-1 text-xs text-primary">
              +{extraAmenities} more
            </li>
          )}
        </ul>

        {/* -------- Price footer (pushed to the bottom by flex) -------- */}
        <div className="mt-5 flex items-center justify-between border-t border-edge pt-4">
          <p className="text-lg font-semibold">
            <span className="text-primary">${studio.hourlyRate}</span>
            <span className="text-sm font-normal text-muted"> / hour</span>
          </p>

          {/* Detail pages are a later milestone — /studios/[id] is a
              placeholder for now. Without an API-supplied id there's
              nowhere to link, so the button renders disabled instead. */}
         
            <Link
              href={`/studios/${studio._id}`}
              className={buttonVariants()}
            >
              View details
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
        </div>
      </div>
    </article>
  );
};

export default StudioCard;
