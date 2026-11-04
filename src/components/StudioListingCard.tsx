import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, MapPin, SquarePen, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import DeleteStudioButton from "@/components/DeleteStudioButton";
import type { Studio } from "@/components/StudioCard";
import { cn } from "@/lib/utils";

/**
 * Horizontal card for the "My Studio Listing" grid — mirrors BookingCard,
 * but the footer carries owner actions (edit / delete / view) instead of
 * a cancel-booking button.
 */
const StudioListingCard = ({ studio, className }: { studio: Studio; className?: string }) => {
  const cover = studio.images?.[0];

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-row",
        className,
      )}
    >
      {/* -------- Thumbnail (side on tablet+, stacked on mobile).
              h-48 matches the vertical StudioCard cover height so every
              card variant on the site renders at the same size. -------- */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-52">
        {cover ? (
          <Image
            src={cover}
            alt={`Cover photo of ${studio.title}`}
            fill
            sizes="(max-width: 640px) 100vw, 220px"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-violet-500/10 text-primary">
            <Camera className="h-10 w-10" strokeWidth={1.5} aria-hidden="true" />
          </div>
        )}
      </div>

      {/* -------- Content -------- */}
      <div className="flex flex-1 flex-col p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {studio.category}
          </p>
          <h3 className="mt-1 text-lg font-semibold">{studio.title}</h3>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" strokeWidth={1.8} aria-hidden="true" />
            {studio.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            {studio.rating} ({studio.capacity} guests max)
          </span>
        </div>

        <p className="mt-3 flex-1 line-clamp-2 text-sm leading-6 text-muted">{studio.description}</p>

        {/* Footer: price + owner actions, pinned to the bottom by flex-1 above */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-edge pt-4">
          <p className="text-lg font-semibold">
            <span className="text-primary">${studio.hourlyRate}</span>
            <span className="text-sm font-normal text-muted"> / hour</span>
          </p>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* Edit now lives on its own page (the dialog was removed) */}
            <Link
              href={`/studios/edit/${studio._id}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "border-edge bg-surface text-foreground hover:bg-overlay",
              })}
            >
              <SquarePen data-icon="inline-start" aria-hidden="true" />
              Edit
            </Link>
            <DeleteStudioButton studioId={studio._id} title={studio.title} />
            <Link href={`/studios/${studio._id}`} className={buttonVariants()}>
              View details
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default StudioListingCard;
