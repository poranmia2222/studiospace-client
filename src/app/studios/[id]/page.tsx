export default async function StudioDetailsPage({params,}: {params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Studio details</h1>
      <p className="mt-3 text-muted">
        Listing pages with photos, amenities and hourly booking are coming
        soon — this is a placeholder for studio{" "}
        <span className="font-mono text-foreground">{id}</span> for now.
      </p>
    </main>
  );
}
