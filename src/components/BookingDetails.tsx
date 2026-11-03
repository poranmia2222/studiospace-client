
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Star,
  Camera,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type Booking = {
  _id: string;
  studioId?: string;
  name: string;
  emailId: string;
  title: string;
  category: string;
  description: string;
  location: string;
  hourlyRate: number;
  rating: number;
  capacity: number;
  amenities: string[];
  images: string[];
  status: "pending" | "Confirmed" | "Cancelled" | "Completed";
  date: string;
  startTime: string;
  endTime: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  confirmed: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

const BookingDetails = ({ id }: { id: string }) => {
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          toast.error("Please sign in to view your booking.");
          router.push("/signin");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/booking/${id}`,
          {
            headers: {
              authorization: `Bearer ${data.token}`,
            },
            cache: "no-store",
          }
        );

        if (res.status === 404) {
          toast.error("Booking not found.");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch booking");
        }

        const result = await res.json();
        setBooking(result);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold">Booking not found</h2>
        <p className="mt-2 text-sm text-muted">
          This booking may have been removed or is unavailable.
        </p>
        <Button className="mt-5">
          <Link href="/my-bookings">Back to My Bookings</Link>
        </Button>
      </div>
    );
  }

  const status = booking.status.toLowerCase();

  const formattedDate = new Date(
    `${booking.date}T12:00:00`
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 md:py-14">

      {/* Back navigation */}
      <Button variant="ghost" className="mb-6">
        <Link href="/my-bookings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          My Bookings
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">
            {booking.category}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {booking.title}
          </h1>

          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <MapPin className="h-4 w-4 text-primary" />
            {booking.location}
          </p>
        </div>

        <span
          className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize ${
            STATUS_STYLES[status] ??
            "border-edge bg-surface text-muted"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Studio Image */}
      <div className="relative mt-7 aspect-[16/7] overflow-hidden rounded-2xl border border-edge bg-surface">
        {booking.images?.[0] ? (
          <Image
            src={booking.images[0]}
            alt={booking.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Camera className="h-12 w-12 text-muted" />
          </div>
        )}
      </div>

      {/* Booking Information */}
      <section className="mt-8 grid gap-5 md:grid-cols-2">

        <div className="rounded-2xl border border-edge bg-surface p-6">
          <h2 className="text-lg font-semibold">
            Booking Information
          </h2>

          <div className="mt-5 space-y-5">

            <InfoItem
              icon={CalendarDays}
              label="Booking Date"
              value={formattedDate}
            />

            <InfoItem
              icon={Clock}
              label="Time Slot"
              value={`${booking.startTime} - ${booking.endTime}`}
            />

            <InfoItem
              icon={Users}
              label="Guest Capacity"
              value={`${booking.capacity} people`}
            />

            <InfoItem
              icon={Star}
              label="Studio Rating"
              value={`${booking.rating} / 5`}
            />

          </div>
        </div>

        {/* Customer Information */}
        <div className="rounded-2xl border border-edge bg-surface p-6">
          <h2 className="text-lg font-semibold">
            Customer Information
          </h2>

          <div className="mt-5 space-y-4">
            <InfoItem
              label="Customer Name"
              value={booking.name}
            />

            <InfoItem
              label="Email Address"
              value={booking.emailId}
            />

            <InfoItem
              label="Booking ID"
              value={booking._id}
            />
          </div>
        </div>

      </section>

      {/* Studio Description */}
      <section className="mt-6 rounded-2xl border border-edge bg-surface p-6">
        <h2 className="text-lg font-semibold">
          About This Studio
        </h2>

        <p className="mt-3 text-sm leading-7 text-muted">
          {booking.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {booking.amenities?.map((amenity) => (
            <span
              key={amenity}
              className="rounded-full border border-edge bg-overlay-soft px-3 py-2 text-xs"
            >
              {amenity}
            </span>
          ))}
        </div>
      </section>

      {/* Price */}
      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-edge bg-surface p-6">
        <div>
          <p className="text-sm text-muted">Hourly Rate</p>
          <p className="mt-1 text-3xl font-bold text-primary">
            ${booking.hourlyRate}
            <span className="ml-1 text-sm font-normal text-muted">
              / hour
            </span>
          </p>
        </div>

        {booking.studioId && (
          <Button>
            <Link href={`/studios/${booking.studioId}`}>
              Visit Studio
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </section>

    </main>
  );
};

import type { LucideIcon } from "lucide-react";

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon?: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />}

    <div className="min-w-0">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 break-all text-sm font-medium">{value}</p>
    </div>
  </div>
);

export default BookingDetails;
