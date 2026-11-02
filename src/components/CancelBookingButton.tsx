"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import { cn } from "@/lib/utils";

/**
 * Deletes a booking via DELETE /my-bookings/{id}, then refreshes the
 * server-rendered list so the card disappears. Success / failure both
 * surface as a sonner toast (same pattern as Navbar sign-out).
 */
const CancelBookingButton = ({
  bookingId,
  title,
  className,
}: {
  bookingId?: string;
  title?: string;
  className?: string;
}) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleCancel = async () => {
    

    setPending(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${bookingId}`,
        { method: "DELETE" },
      );
      console.log(bookingId)
      console.log(res)

      if (!res.ok) {
        toast.error(
          `The booking service responded with an error (${res.status}). Please try again.`,
        );
        return;
      }

      toast.success("Booking cancelled.");
      // Re-run the server fetch — the deleted card drops out of the list.
      router.refresh();
    } catch {
      // Network error, API not running, invalid JSON...
      toast.error("We couldn't reach the booking service. Please try again.");
    } finally {
      setPending(false);
    }
  };

  /**
   * Opens a ConfirmDialog first — the DELETE request only fires once the
   * user explicitly confirms.
   */
  return (
    <ConfirmDialog
      trigger={
        <Button
          type="button"
          variant="outline"
          disabled={pending || !bookingId}
          title={bookingId ? undefined : "This booking has no id — cannot cancel"}
          className={cn(
            "border-rose-500/30 bg-surface text-rose-400 hover:bg-rose-500/10",
            className,
          )}
        >
          <Trash2 data-icon="inline-start" aria-hidden="true" />
          {pending ? "Cancelling…" : "Cancel booking"}
        </Button>
      }
      title={title ? `Cancel booking for "${title}"?` : "Cancel this booking?"}
      description="The booking will be removed from your reservations. This action cannot be undone."
      confirmLabel="Cancel booking"
      confirmingLabel="Cancelling…"
      onConfirm={handleCancel}
    />
  );
};

export default CancelBookingButton;
