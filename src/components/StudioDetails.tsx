"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CalendarPlus,
  Camera,
  Loader2,
  MapPin,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EditStudioDialog from "@/components/EditStudioDialog";
import type { Studio } from "@/components/StudioCard";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const StudioDetails = ({ studio }: { studio: Studio }) => {
  const router = useRouter()
  const photos = studio.images?.filter(Boolean) ?? [];
  const amenities = studio.amenities ?? [];
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [pending, setPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession()
  const user = session?.user;


  const handleAddToBooking = async () => {
    if (!user?.email) {
      toast.error("Please sign in to book a studio.");
      return;
    }

    setPending(true);
    try {
      // Duplicate check: does this studio already sit in the user's bookings?
      const bookedRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${user.email}`,
        { cache: "no-store" },
      );
      if (bookedRes.ok) {
        // Response bodies are unwrapped tolerantly (body.bookings ?? body.data ?? body).
        const body = await bookedRes.json().catch(() => null);
        const bookings: Array<{ _id?: string; title?: string }> =
          (body as Record<string, unknown>)?.bookings ??
          (body as Record<string, unknown>)?.data ??
          body ??
          [];
        const alreadyBooked = Array.isArray(bookings) && bookings.some(
          (booking) =>
            (studio._id && booking._id === studio._id) ||
            (booking.title && booking.title === studio.title),
        );
        if (alreadyBooked) {
          toast.warning("This studio is already in your bookings.");
          return;
        }
      }

      const newBooking = {
        name: user.name,
        email: user.email,
        ...studio,
        date: new Date().toISOString(),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });

      if (!res.ok) {
        toast.error(
          `The booking service responded with an error (${res.status}). Please try again.`,
        );
        return;
      }

      toast.success(
        `${studio.title} booked! It's now in your My Bookings list.`,
      );
    } catch {
      // Network error, API not running, invalid JSON...
      toast.error("We couldn't reach the booking service. Please try again.");
    } finally {
      setPending(false);
    }
  };

  /**
   * Deletes the studio via DELETE /studios/{id}, then navigates back to
   * the studios grid on success. Success / failure both surface as
   * sonner toasts (same pattern as CancelBookingButton).
   */
  const handleDetele = async () => {
    if (isDeleting || !studio._id) return;
    setIsDeleting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/studios/${studio._id}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        toast.error(
          `Couldn't delete the studio (status ${res.status}). Please try again.`,
        );
        return;
      }

      toast.success(`${studio.title} deleted.`);
      // Only leave the page once the delete actually succeeded.
      router.push("/studios");
    } catch {
      // Network error, API not running, invalid JSON...
      toast.error("We couldn't reach the server. Check your connection.");
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <article>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="rounded-full bg-violet-500/15 px-2.5 py-1 font-medium text-primary">
              {studio.category}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {studio.location}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {studio.title}
          </h1>
        </div>

        {/* Post-level actions: edit & delete the ENTIRE studio listing,
            not an individual photo. */}
        <div className="flex shrink-0 items-center gap-2">
          {(user?.email === studio?.email) ?
            <div className="flex gap-3">
              <EditStudioDialog studio={studio} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDetele}
                disabled={isDeleting || !studio._id}
                title={
                  studio._id
                    ? undefined
                    : "This studio has no id — cannot delete"
                }
                className="border-rose-500/30 bg-surface text-rose-400 hover:bg-rose-500/10"
              >
                {isDeleting ? (
                  <Loader2
                    data-icon="inline-start"
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Trash2 data-icon="inline-start" aria-hidden="true" />
                )}
                {isDeleting ? "Deleting…" : "Delete"}
              </Button>
            </div> : ""
          }
        </div>
      </header>

      <section aria-label="Studio photos" className="mt-6">
        <div className="relative aspect-[2.4/1] max-h-[440px] min-h-56 overflow-hidden rounded-2xl border border-edge bg-surface shadow-sm">
          {photos.length > 0 ? (
            <>
              {/* Blurred copy of the same photo fills the letterboxed area so
                  nothing is cropped away — the sharp layer shows the FULL
                  photo (object-contain) instead of zooming in (object-cover). */}
              <Image
                src={photos[selectedPhoto]}
                alt=""
                fill
                priority
                sizes="(max-width: 640px) 100vw, 896px"
                aria-hidden="true"
                className="scale-125 object-cover blur-2xl brightness-[.35]"
              />
              <Image
                src={photos[selectedPhoto]}
                alt={`Photo ${selectedPhoto + 1} of ${studio.title}`}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 896px"
                className="object-contain"
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted">
              <Camera className="h-10 w-10" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-sm">Photos coming soon</span>
            </div>
          )}

          {photos.length > 0 && (
            <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2.5 py-1 text-xs font-medium text-white">
              Photo {selectedPhoto + 1} of {photos.length}
            </span>
          )}
        </div>

        {photos.length > 0 && (
          <div className="mt-2 flex gap-2.5 overflow-x-auto pb-1">
            {photos.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                aria-label={`View photo ${index + 1} of ${studio.title}`}
                aria-pressed={selectedPhoto === index}
                onClick={() => setSelectedPhoto(index)}
                className={`relative h-14 w-22 shrink-0 overflow-hidden rounded-lg border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selectedPhoto === index
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
                  }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="88px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="mt-7 grid items-start gap-5 md:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <section
          aria-label="Studio highlights"
          className="grid grid-cols-2 gap-4 rounded-2xl border border-edge bg-surface p-4 sm:grid-cols-4 sm:gap-3 sm:p-5"
        >
          <div>
            <p className="text-xs text-muted">Hourly Rate</p>
            <p className="mt-1 font-semibold text-primary">
              ${studio.hourlyRate}/hr
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Max Capacity</p>
            <p className="mt-1 font-semibold text-foreground">
              {studio.capacity} people
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Client Rating</p>
            <p className="mt-1 flex items-center gap-1 font-semibold text-foreground">
              <Star
                className="h-4 w-4 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              {studio.rating.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Amenities</p>
            <p className="mt-1 font-semibold text-foreground">
              {amenities.length}
            </p>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-edge bg-surface p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="text-2xl font-bold text-primary">
              ${studio.hourlyRate}
              <span className="ml-1 text-sm font-normal text-muted">
                / hour
              </span>
            </p>
            <span className="flex items-center gap-1 pt-1 text-xs font-medium text-foreground">
              <Star
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              {studio.rating.toFixed(1)}
            </span>
          </div>
          <div className="my-4 flex items-center gap-2 border-y border-edge py-3 text-sm text-muted">
            <Users className="h-4 w-4 text-primary" aria-hidden="true" />
            Up to {studio.capacity} people
          </div>
          <Button
            type="button"
            onClick={handleAddToBooking}
            size="lg"
            disabled={pending}
            className="w-full"
          >
            {pending ? (
              <Loader2
                data-icon="inline-start"
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <CalendarPlus data-icon="inline-start" aria-hidden="true" />
            )}
            {pending ? "Booking…" : "Book now"}
          </Button>
          <p className="mt-2 text-center text-xs text-muted">
            Booking &amp; payments are coming soon.
          </p>
        </aside>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            About this studio
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-muted">
            {studio.description}
          </p>
        </section>

        {amenities.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              What&apos;s inside
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-full border border-edge bg-white/[.03] px-3 py-1.5 text-xs text-muted"
                >
                  {amenity}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
};

export default StudioDetails;
