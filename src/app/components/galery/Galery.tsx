"use client";
import React, { useEffect, useState } from "react";
import { fetchGarments } from "@/app/services/garmentService";
import Card from "./Card";
import GaleryHeader from "./GaleryHeader";
import useGarments from '../../store/garmentsStore';
import useUser from "@/app/store/userStore";


const GarmentsGallery: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const { sortedGarments, setGarments } = useGarments();
    const { _id } = useUser((state) => state);
    useEffect(() => {
        const fetchGarmentsFromServises = async () => {
            try {
                const response = await fetchGarments(_id);
                console.log(response.data); // data הוא מערך של IGarment[]
                setGarments(response.data); // הגדר ישירות
            } catch (error) {
                console.error("Failed to fetch garments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGarmentsFromServises();
    }, []);

    if (loading) return <p>Loading...</p>;
    // if (!sortedGarments.length) return <p>No garments found.</p>;

    return (
        <>
            <GaleryHeader />
            {!sortedGarments.length && <p>No garments found.</p>}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-7 gap-4 px-4">
                {sortedGarments.map((garment) => (
                    <Card key={String(garment._id)} garment={garment} />
                ))}
            </div>
        </>
    );
};

export default GarmentsGallery;
