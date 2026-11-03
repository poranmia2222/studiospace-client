import { Suspense } from "react";
import BookingDetails from "@/components/BookingDetails";

async function BookingDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookingDetails id={id} />;
}

export default function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-10">Loading booking details...</div>}>
      <BookingDetailsContent params={params} />
    </Suspense>
  );
}