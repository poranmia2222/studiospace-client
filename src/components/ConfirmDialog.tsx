"use client";

import { useState, type ReactElement, type ReactNode } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Confirmation modal in front of a destructive action. Renders `trigger`
 * (a <Button> element) which opens the dialog on click; `onConfirm` only
 * runs after the user explicitly confirms. The dialog closes itself on
 * success but stays open on failure so the user can retry or back out
 * (the error itself surfaces as a sonner toast, same as everywhere else).
 */
const ConfirmDialog = ({
  trigger,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirmingLabel = "Working…",
  onConfirm,
  className,
}: {
  /** Element (e.g. a <Button>) that opens the dialog when clicked. */
  trigger: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  /** Label on the destructive confirm button. */
  confirmLabel?: string;
  cancelLabel?: string;
  /** Confirm-button label while the action is running. */
  confirmingLabel?: string;
  onConfirm: () => void | Promise<void>;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    if (confirming) return;
    setConfirming(true);
    try {
      await onConfirm();
      // Only close on success — on failure the toast shows the error and
      // the user stays in the dialog to retry or cancel.
      setOpen(false);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className={cn("sm:max-w-md", className)}>
          <DialogHeader>
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
              <TriangleAlert className="size-5" aria-hidden="true" />
            </div>
            <DialogTitle className="text-center">{title}</DialogTitle>
            {description ? (
              <DialogDescription className="text-center">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={confirming}
                  className="border-edge bg-surface text-foreground hover:bg-overlay"
                >
                  {cancelLabel}
                </Button>
              }
            />
            <Button
              type="button"
              variant="destructive"
              disabled={confirming}
              onClick={handleConfirm}
            >
              {confirming ? (
                <Loader2
                  data-icon="inline-start"
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <TriangleAlert data-icon="inline-start" aria-hidden="true" />
              )}
              {confirming ? confirmingLabel : confirmLabel}
            </Button>
          </DialogFooter>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
};

export default ConfirmDialog;
