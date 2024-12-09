"use client";
import React, { useEffect, useState } from "react";
import { fetchGarments } from "@/app/services/garmentService";
import GaleryHeader from "./GaleryHeader";
import GarmentsGallery from "./garments/GarmetsGallery";
import useGarments from '../../store/garmentsStore';
import useUser from "@/app/store/userStore";

const Gallery = ({ isForOutfit }: { isForOutfit: boolean }) => {
    const { setGarments } = useGarments();
    const { _id } = useUser((state) => state);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<"garments" | "outfits">("garments");

    useEffect(() => {
        if (!_id) {
            console.log("Waiting for user ID to load...");
            return;
        }
        const fetchGarmentsFromServices = async () => {
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
        fetchGarmentsFromServices();
    }, [_id]); // הוסף _id כתלות
    if (loading) return <p>Loading...</p>;
    if (isForOutfit) {
        return (
            <>
                <GaleryHeader activeTab={activeTab} setActiveTab={setActiveTab} isForOutfit={isForOutfit} />
                <GarmentsGallery isForOutfit={isForOutfit}/>
            </>
        )
    }
    return (
        <>
            <GaleryHeader activeTab={activeTab} setActiveTab={setActiveTab} isForOutfit={isForOutfit} />
            {activeTab === "garments" && <GarmentsGallery isForOutfit={isForOutfit} />}
        </>
    );
};

export default Gallery;
