import { Suspense } from "react";
import { AlertTriangle, CalendarX2, LogIn } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import BookingCard, { type Booking } from "@/components/BookingCard";
import { authClient } from "@/lib/auth-client";

/* ------------------------------ Data ------------------------------ */

type LoadResult = { bookings: Booking[]; error?: string; email?: string };

/** Fetch + normalize the bookings list; never throws, never crashes. */
const loadBookings = async (emailId?: string): Promise<LoadResult> => {
  if (!emailId) return { bookings: [], error: "auth" };

  try {

    const jwtToken = await auth.api.getToken({
      headers: await headers(),
    })
    const token = jwtToken?.token
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${emailId}`,
      {
        cache: "no-store",
        headers: {
          authorization: `Bearer ${token}`
        }
      }, // always fresh
    );

    if (!res.ok) {
      return {
        bookings: [],
        error: `The booking service responded with an error (${res.status}).`,
      };
    }

    // The API may send a bare array, or wrapped (e.g. { data: [...] }) —
    // handle the common shapes so the UI doesn't depend on one exact JSON.
    const body: unknown = await res.json();
    const list: unknown = Array.isArray(body)
      ? body
      : (body as Record<string, unknown>)?.data ??
      (body as Record<string, unknown>)?.bookings ??
      (body as Record<string, unknown>)?.results;

    const bookings = (Array.isArray(list) ? list : []).filter(
      (booking): booking is Booking => {
        // Very light validation: a booking needs a title to be renderable.
        const b = booking as Booking;
        return Boolean(b && typeof b.title === "string");
      },
    );

    return { bookings };
  } catch {
    // Network error, API not running, invalid JSON... render the error card.
    return {
      bookings: [],
      error: "We couldn't reach the booking service right now.",
    };
  }
};

/* --------------------------- Small pieces --------------------------- */

/** Gray pulsing placeholders shown while the API request is in flight. */
const BookingsSkeleton = () => (
  <ul aria-hidden="true" className="grid gap-5">
    {[0, 1, 2].map((n) => (
      <li
        key={n}
        className="h-[228px] animate-pulse rounded-2xl border border-edge bg-surface"
      />
    ))}
  </ul>
);

/** Friendly full-width message card for error / empty results. */
const StatusCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
}) => (
  <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-edge bg-surface px-8 py-14 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-primary">
      <Icon className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
    </span>
    <h2 className="mt-5 text-lg font-semibold">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
  </div>
);

/**
 * The whole dynamic section: resolves the session, loads fresh bookings,
 * then shows the cards (or a reason why there's nothing to show).
 */
const BookingsSection = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  const { bookings, error } = await loadBookings(email);

  // Not signed in — nothing to look up.
  if (error === "auth") {
    return (
      <StatusCard
        icon={LogIn}
        title="You're not signed in"
        description="Sign in to see the studios you've booked."
      />
    );
  }

  if (error) {
    return (
      <StatusCard
        icon={AlertTriangle}
        title="Something went wrong"
        description={`${error} Please try again in a few moments.`}
      />
    );
  }

  if (bookings.length === 0) {
    return (
      <StatusCard
        icon={CalendarX2}
        title="No bookings yet"
        description="You haven't booked any studios yet — browse the studios and book your first session!"
      />
    );
  }

  return (
    <>
      <p className="text-sm text-muted" aria-live="polite">
        You have {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
      </p>

      {/* Card list — one booking per row, newest first when dates are present */}
      <ul className="mt-5 grid gap-5">
        {[...bookings]
          .sort(
            (a, b) =>
              new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
          )
          .map((booking, index) => (
            <li key={booking._id ?? `${booking.title}-${index}`} className="h-full">
              <BookingCard booking={booking} />
            </li>
          ))}
      </ul>
    </>
  );
};

/* ------------------------------ Page ------------------------------ */

const MyBookings = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
      {/* Section header (same pattern as the /studios page) */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          My Account
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          My{" "}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
            Bookings
          </span>
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Every studio you&apos;ve booked, with the date you booked it and quick
          access to the details.
        </p>
      </div>

      {/* The session lookup + uncached API call stream inside Suspense:
          the header above renders instantly, this section (including the
          skeleton) fills in while the request is in flight. */}
      <div className="mt-10">
        <Suspense fallback={<BookingsSkeleton />}>
          <BookingsSection />
        </Suspense>
      </div>
    </div>
  );
};

export default MyBookings;
