"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Deletes a studio listing via DELETE /studios/{id}, then refreshes the
 * server-rendered list so the card disappears. Success / failure both
 * surface as a sonner toast (same pattern as CancelBookingButton).
 */
const DeleteStudioButton = ({
  studioId,
  title,
  className,
}: {
  studioId?: string;
  title?: string;
  className?: string;
}) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/studios/${studioId}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        toast.error(
          `Couldn't delete the studio (status ${res.status}). Please try again.`,
        );
        return;
      }

      toast.success(`${title ?? "Studio"} deleted.`);
      // Re-run the server fetch — the deleted card drops out of the list.
      router.refresh();
    } catch {
      // Network error, API not running, invalid JSON...
      toast.error("We couldn't reach the server. Check your connection.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending || !studioId}
      onClick={handleDelete}
      title={studioId ? undefined : "This studio has no id — cannot delete"}
      className={cn(
        "border-rose-500/30 bg-surface text-rose-400 hover:bg-rose-500/10",
        className,
      )}
    >
      {pending ? (
        <Loader2 data-icon="inline-start" className="animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 data-icon="inline-start" aria-hidden="true" />
      )}
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
};

export default DeleteStudioButton;
