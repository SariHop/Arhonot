"use client";
import React, { useEffect, useState } from "react";
import { fetchOutfits } from "@/app/services/outfitServices";
import { fetchGarments } from "@/app/services/garmentService";
import GaleryHeader from "./GaleryHeader";
import GarmentsGallery from "./garments/GarmetsGallery";
import OutfitsGallary from "./outfits/OutfitsGallary";
import useGarments from "../../store/garmentsStore";
import useUser from "@/app/store/userStore";
import useOutfits from "@/app/store/outfitsStore";

const Gallery = ({ isForOutfit }: { isForOutfit: boolean }) => {
  const { setGarments } = useGarments();
  const { setOutfits } = useOutfits();
  const { _id } = useUser((state) => state);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"garments" | "outfits">(
    "garments"
  );
  useEffect(() => {
    if (!_id) {
      console.log("Waiting for user ID to load...");
      return;
    }
    const fetchGarmentsFromServices = async () => {
      try {
        if (_id) {
          const response = await fetchGarments(_id);
          console.log(response.data); // data הוא מערך של IGarment[]
          setGarments(response.data); // הגדר ישירות
        }
      } catch (error) {
        console.error("Failed to fetch garments:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchOutfitsFromServices = async () => {
      try {
        const response = await fetchOutfits(_id);
        setOutfits(response.data); // הגדר ישירות
      } catch (error) {
        console.error("Failed to fetch outfits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGarmentsFromServices();
    fetchOutfitsFromServices();
  }, [_id]); // הוסף _id כתלות
  if (loading) return <p>Loading...</p>;
  if (isForOutfit) {
    return (
      <>
        <GaleryHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isForOutfit={isForOutfit}
        />
        <GarmentsGallery isForOutfit={isForOutfit} />
      </>
    );
  }
  return (
    <div className="mt-10">
      <GaleryHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isForOutfit={isForOutfit}
      />
      {activeTab === "garments" ? (
        <GarmentsGallery isForOutfit={isForOutfit} />
      ) : (
        <OutfitsGallary />
      )}
    </div>
  );
};

export default Gallery;
