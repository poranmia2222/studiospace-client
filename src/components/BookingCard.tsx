import Image from "next/image";
import Link from "next/link";
import {
  type LucideIcon,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Camera,
  CircleDashed,
  CircleX,
  CheckCircle2,
  MapPin,
  Star,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import CancelBookingButton from "@/components/CancelBookingButton";
import { type Studio } from "@/components/StudioCard";
import { cn } from "@/lib/utils";

/* One document from GET /my-bookings/{email}: the booked studio payload
   plus the `date` the booking was made. */
export type Booking = Studio & {
  date: string;
};

/* Status badge colors/icons. Keys are lowercase so the badge tolerates
   whatever casing the API sends ("pending" vs "PENDING"). */
const STATUS_META: Record<
  string,
  { icon: LucideIcon; label: string; className: string }
> = {
  pending: {
    icon: CircleDashed,
    label: "Pending",
    className: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  },
  confirmed: {
    icon: BadgeCheck,
    label: "Confirmed",
    className: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
  cancelled: {
    icon: CircleX,
    label: "Cancelled",
    className: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  },
};

/** Horizontal card for the "My Bookings" grid. */
const BookingCard = ({ booking, className }: { booking: Booking; className?: string }) => {
  const cover = booking.images?.[0];

  // The API sends an ISO timestamp; a fixed en-US/UTC format keeps the
  // server-rendered output stable.
  const bookedOn = booking.date
    ? new Date(booking.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })
    : null;

  // Status badge: matched case-insensitively against the known lifecycles.
  // Unknown/missing statuses fall back to a neutral chip instead of nothing.
  const statusMeta =
    STATUS_META[booking.status?.trim().toLowerCase() ?? ""] ?? null;

  return (
    <article
      className={cn(
        "group flex h-full overflow-hidden rounded-2xl border border-edge bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-row",
        className,
      )}
    >
      {/* -------- Thumbnail (side on tablet+, stacked on mobile) -------- */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-52">
        {cover ? (
          <Image
            src={cover}
            alt={`Cover photo of ${booking.title}`}
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
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {booking.category}
            </p>
            <h3 className="mt-1 text-lg font-semibold">{booking.title}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status badge (e.g. "Pending") — first thing the eye lands on */}
            {statusMeta && (
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                  statusMeta.className,
                )}
              >
                <statusMeta.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {statusMeta.label}
              </span>
            )}

            {/* When the booking was made */}
            {bookedOn && (
              <span className="flex items-center gap-1.5 rounded-full border border-edge bg-overlay-soft px-2.5 py-1 text-xs text-muted">
                <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Booked {bookedOn}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" strokeWidth={1.8} aria-hidden="true" />
            {booking.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            {booking.rating} ({booking.capacity} guests max)
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{booking.description}</p>

        {/* Footer: price + actions, pushed to the bottom by flex */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-edge pt-4">
          <p className="text-lg font-semibold">
            <span className="text-primary">${booking.hourlyRate}</span>
            <span className="text-sm font-normal text-muted"> / hour</span>
          </p>

          <div className="flex items-center gap-2">
            {/* Cancel is only possible before the booking is confirmed */}
            {statusMeta?.label === "Pending" && (
              <CancelBookingButton bookingId={booking._id} title={booking.title} />
            )}
            <Link href={`/studios/${booking._id}`} className={buttonVariants()}>
              View details
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BookingCard;
