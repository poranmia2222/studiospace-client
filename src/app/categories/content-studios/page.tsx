import StudioCard from '@/components/StudioCard';
import React from 'react';

const ContentStudios = async() => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studios`, {
        cache: "no-store", // always fresh
    });
    const data = await res.json();
    const contentStudios = data.filter((studio: any) => studio.category === "Content Studios");

    return (
        <div className="max-w-6xl mx-auto my-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {
                contentStudios.map((studio: any) => (
                    <StudioCard key={studio._id} studio={studio} />
                ))
            }
        </div>
    );
};

export default ContentStudios;