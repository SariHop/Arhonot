"use client";
import React from "react";
import Card from "./Card";
import useGarments from '../../../store/garmentsStore';


const GarmentsGallery = ({ isForOutfit }: { isForOutfit: boolean }) => {
    const { sortedGarments } = useGarments();
    // if (!sortedGarments.length) return <p>No garments found.</p>;

    return (
        <>
            {!sortedGarments.length && <p>No garments found.</p>}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-7 gap-4 px-4">
                {sortedGarments.map((garment) => (
                    <Card key={String(garment._id)} garment={garment} isForOutfit={isForOutfit} />
                ))}
            </div>
        </>
    );
};

export default GarmentsGallery;
