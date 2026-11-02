"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Camera,
    ImagePlus,
    Loader2,
    MapPin,
    Plus,
    SquarePen,
    Sparkles,
    X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogPopup,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Studio } from "@/components/StudioCard";

/* Same category list as the add-studio form. */
const CATEGORIES = [
    "Photo Studios",
    "Film Stages",
    "Podcast Rooms",
    "Music Studios",
    "Art Workshops",
    "Dance Studios",
    "Content Studios",
] as const;

/* Shared field styling — same treatment as the auth forms. */
const FIELD =
    "h-11 rounded-xl border-edge bg-white/[.04] text-foreground placeholder:text-muted focus-visible:border-violet-500 focus-visible:ring-violet-500/20 transition-all";
const LABEL = "text-muted text-xs font-medium";

/**
 * Opens a dialog with the same form as the add-studio page, but prefilled
 * with the studio's current values and submitted via PUT /studios/{id}.
 * Success / failure both surface as a sonner toast, and the detail page
 * re-renders with fresh data after a successful update.
 */
const EditStudioDialog = ({ studio }: { studio: Studio }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [amenities, setAmenities] = useState<string[]>(studio.amenities ?? []);
    const [images, setImages] = useState<string[]>(
        studio.images?.filter(Boolean) ?? [],
    );
    const [amenityDraft, setAmenityDraft] = useState("");
    const [imageDraft, setImageDraft] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* ----- amenity chips ----- */
    const addAmenity = () => {
        const value = amenityDraft.trim();
        if (!value || amenities.includes(value)) return;
        setAmenities((current) => [...current, value]);
        setAmenityDraft("");
    };

    const removeAmenity = (amenity: string) => {
        setAmenities((current) => current.filter((item) => item !== amenity));
    };

    /* ----- image URL chips ----- */
    const addImage = () => {
        const value = imageDraft.trim();
        if (!/^https?:\/\//.test(value)) {
            toast.error("Image URLs must start with http:// or https://");
            return;
        }
        if (images.includes(value)) return;
        setImages((current) => [...current, value]);
        setImageDraft("");
    };

    const removeImage = (src: string) => {
        setImages((current) => current.filter((item) => item !== src));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const postData = {
            email: studio.email,
            title: (data.title as string).trim(),
            category: data.category as string,
            description: (data.description as string).trim(),
            location: (data.location as string).trim(),
            hourlyRate: Number(data.hourlyRate),
            rating: Number(data.rating || 0),
            capacity: Number(data.capacity),
            amenities,
            images,
        };

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/studios/${studio._id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(postData),
                },
            );

            if (!res.ok) {
                toast.error(
                    `Couldn't update the studio (status ${res.status}). Please try again.`,
                );
                return;
            }

            toast.success("Studio updated successfully!");
            // Re-run the server fetch so the detail page shows the edit.
            router.refresh();
            setOpen(false);
        } catch {
            toast.error("Couldn't reach the server. Check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Same styling as the previous standalone Edit button. */}
            <DialogTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-edge bg-surface text-foreground hover:bg-white/[.07]"
                    >
                        <SquarePen data-icon="inline-start" aria-hidden="true" />
                        Edit
                    </Button>
                }
            />

            <DialogPortal>
                <DialogBackdrop />

                <DialogPopup className="max-h-[calc(100%-3rem)] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit studio</DialogTitle>
                        <DialogDescription>
                            Update the details below so creators always see current
                            information about your space.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        {/* ---------- Basic info ---------- */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title" className={LABEL}>
                                    Studio Title
                                </Label>
                                <Input
                                    id="edit-title"
                                    name="title"
                                    type="text"
                                    defaultValue={studio.title}
                                    placeholder="Golden Hour Photography Studio"
                                    className={FIELD}
                                    maxLength={100}
                                    required
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-category" className={LABEL}>
                                        Category
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="edit-category"
                                            name="category"
                                            defaultValue={studio.category}
                                            required
                                            className={`${FIELD} w-full appearance-none pr-10 ${"text-foreground"
                                                }`}
                                        >
                                            {CATEGORIES.map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                    className="bg-surface text-foreground"
                                                >
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                        <MapPin
                                            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-location" className={LABEL}>
                                        Location
                                    </Label>
                                    <Input
                                        id="edit-location"
                                        name="location"
                                        type="text"
                                        defaultValue={studio.location}
                                        placeholder="Gulshan, Dhaka"
                                        className={FIELD}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-description" className={LABEL}>
                                    Description
                                </Label>
                                <textarea
                                    id="edit-description"
                                    name="description"
                                    rows={4}
                                    defaultValue={studio.description}
                                    placeholder="A bright photography space for portraits, product photography, and creative shoots."
                                    className="w-full rounded-xl border border-edge bg-white/[.04] px-3.5 py-3 text-foreground placeholder:text-muted outline-none focus-visible:border-violet-500 focus-visible:ring-3 focus-visible:ring-violet-500/20 transition-all resize-y"
                                    required
                                />
                            </div>
                        </div>

                        {/* ---------- Pricing & capacity ---------- */}
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="edit-hourlyRate" className={LABEL}>
                                    Hourly Rate ($)
                                </Label>
                                <Input
                                    id="edit-hourlyRate"
                                    name="hourlyRate"
                                    type="number"
                                    min={1}
                                    step={1}
                                    defaultValue={studio.hourlyRate}
                                    placeholder="35"
                                    className={FIELD}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-capacity" className={LABEL}>
                                    Max Capacity
                                </Label>
                                <Input
                                    id="edit-capacity"
                                    name="capacity"
                                    type="number"
                                    min={1}
                                    step={1}
                                    defaultValue={studio.capacity}
                                    placeholder="8"
                                    className={FIELD}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-rating" className={LABEL}>
                                    Rating (0–5, optional)
                                </Label>
                                <Input
                                    id="edit-rating"
                                    name="rating"
                                    type="number"
                                    min={0}
                                    max={5}
                                    step={0.1}
                                    placeholder="0.0"
                                    defaultValue={studio.rating || 0}
                                    className={FIELD}
                                />
                            </div>
                        </div>

                        {/* ---------- Amenities (tag chips) ---------- */}
                        <div className="mt-6 space-y-2">
                            <Label htmlFor="edit-amenities" className={LABEL}>
                                Amenities
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="edit-amenities"
                                    type="text"
                                    value={amenityDraft}
                                    onChange={(e) => setAmenityDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addAmenity();
                                        }
                                    }}
                                    placeholder="Lighting Equipment, Backdrops, Changing Area…"
                                    className={FIELD}
                                />
                                <Button
                                    type="button"
                                    onClick={addAmenity}
                                    className="h-11 shrink-0 rounded-xl bg-primary px-4 text-white hover:bg-primary-strong"
                                >
                                    <Plus data-icon="inline-start" aria-hidden="true" />
                                    Add
                                </Button>
                            </div>
                            {amenities.length > 0 && (
                                <ul className="mt-2 flex flex-wrap gap-2">
                                    {amenities.map((amenity) => (
                                        <li
                                            key={amenity}
                                            className="flex items-center gap-1.5 rounded-full border border-edge bg-white/[.03] px-2.5 py-1 text-xs text-muted"
                                        >
                                            {amenity}
                                            <button
                                                type="button"
                                                aria-label={`Remove ${amenity}`}
                                                onClick={() => removeAmenity(amenity)}
                                                className="rounded-full text-muted transition-colors hover:text-rose-400"
                                            >
                                                <X className="h-3 w-3" aria-hidden="true" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* ---------- Images (URL chips with previews) ---------- */}
                        <div className="mt-6 space-y-2">
                            <Label htmlFor="edit-images" className={LABEL}>
                                Photo URLs
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="edit-images"
                                    type="url"
                                    value={imageDraft}
                                    onChange={(e) => setImageDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addImage();
                                        }
                                    }}
                                    placeholder="https://images.unsplash.com/photo-…"
                                    className={FIELD}
                                />
                                <Button
                                    type="button"
                                    onClick={addImage}
                                    className="h-11 shrink-0 rounded-xl bg-primary px-4 text-white hover:bg-primary-strong"
                                >
                                    <ImagePlus data-icon="inline-start" aria-hidden="true" />
                                    Add
                                </Button>
                            </div>
                            {images.length > 0 ? (
                                <ul className="mt-2 flex flex-wrap gap-3">
                                    {images.map((src, index) => (
                                        <li
                                            key={`${src}-${index}`}
                                            className="group relative h-20 w-28 overflow-hidden rounded-lg border border-edge"
                                        >
                                            <Image
                                                src={src}
                                                alt={`Preview ${index + 1}`}
                                                fill
                                                sizes="112px"
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                aria-label={`Remove photo ${index + 1}`}
                                                onClick={() => removeImage(src)}
                                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-rose-600 focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
                                            >
                                                <X className="h-3.5 w-3.5" aria-hidden="true" />
                                            </button>
                                            {index === 0 && (
                                                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                                    Cover
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                                    <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                                    The first photo becomes the studio&apos;s cover image.
                                </p>
                            )}
                        </div>

                        {/* ---------- Actions ---------- */}
                        <DialogFooter className="mt-8 border-t border-edge pt-6">
                            <DialogClose render={<Button type="button" variant="outline" size="lg" className="border-edge bg-surface text-foreground hover:bg-white/[.07]" />}>
                                Cancel
                            </DialogClose>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                                className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-xl shadow-violet-600/30 hover:shadow-violet-500/40 hover:brightness-110 active:scale-[.98] sm:min-w-44"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" aria-hidden="true" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <Sparkles data-icon="inline-start" aria-hidden="true" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogPopup>
            </DialogPortal>
        </Dialog>
    );
};

export default EditStudioDialog;
