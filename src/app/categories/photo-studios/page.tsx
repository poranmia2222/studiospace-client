import StudioCard from "@/components/StudioCard";

const PhotoStudios = async() => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studios`, {
        cache: "no-store", // always fresh
    });
    const data = await res.json();
    const photoStudios = data.filter((studio: any) => studio.category === "Photo Studios");
    return (
        <div className="max-w-6xl mx-auto my-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {
                photoStudios.map((studio: any) => (
                    <StudioCard key={studio._id} studio={studio} />
                ))
            }
        </div>
    );
};

export default PhotoStudios;