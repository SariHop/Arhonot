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
import { CircularProgress } from "@mui/material";

const Gallery = ({ viewMode, setChanged = () => {} }: { viewMode: ("view" | "createOtfit" | "selectForDay") , setChanged?: (b:boolean) => void}) => {
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
  }, [_id, setOutfits, setGarments]);

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <CircularProgress />
    </div>
  );
  

  if (viewMode === "createOtfit") {
    return (
      <>
        <GaleryHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isForOutfit={true}
        />
        <GarmentsGallery isForOutfit={true} />

      </>
    );
  } else if (viewMode === "selectForDay") {
    return (
      <>
        < GaleryHeader activeTab={"outfits"} setActiveTab={setActiveTab} isForOutfit={true} />
        <OutfitsGallary isSelectForDay={true} setChanged={setChanged}/>
      </>
    )
  }
  return (
    <div>
      < GaleryHeader activeTab={activeTab} setActiveTab={setActiveTab} isForOutfit={false} />
      {activeTab === "garments" ? <GarmentsGallery isForOutfit={false} /> : <OutfitsGallary isSelectForDay={false} />}
    </div>
  );
};

export default Gallery;
