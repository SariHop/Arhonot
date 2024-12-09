"use client";

import React, { useState, useEffect, useContext } from "react";
import { outfitSchemaZod } from '@/app/types/IOutfit'
import Image from "next/image";
import { Modal, Rate } from "antd";
import { CanvasContext } from "@/app/components/createOutfit/Canvas";
import useUser from "@/app/store/userStore";
import { useTagQuery } from "@/app/hooks/tagsQueryHook";
import { useSeasonQuery } from "@/app/hooks/seasonQueryHook";
import { cloudinaryUploud } from "@/app/services/image/saveToCloudinary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface OutfitFormProps {
  closeModal: () => void;
  outfitImgurl: string;
}

const OutfitForm: React.FC<OutfitFormProps> = ({ closeModal, outfitImgurl }) => {
  const { _id: userId } = useUser((state) => state);

  const context = useContext(CanvasContext);
  const arreyOfGarmentInCanvas = context?.arreyOfGarmentInCanvas || [];

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [outfitFromCloudinary, setOutfitFromCloudinary] = useState<string>("");
  const [imageError, setImageError] = useState<string>("תצוגה מקדימה של הלוק");
  const [rate, setRate] = useState<number>(0);

  const { data: tags = [] } = useTagQuery();
  const { data: seasons = [] } = useSeasonQuery();

  useEffect(() => {
    const saveImageToCloudinary = async () => {
      if (!outfitImgurl) return;

      try {
        const { imageUrl } = await cloudinaryUploud(outfitImgurl);
        setOutfitFromCloudinary(imageUrl);
      } catch (error) {
        console.error("Image upload error:", error);
        setImageError("שגיאה בשמירת הלוק");
      }
    };

    saveImageToCloudinary();
  }, [outfitImgurl]);

  const handleTagChange = (tag: string, checked: boolean) => {
    setSelectedTags((prevTags) =>
      checked ? [...prevTags, tag] : prevTags.filter((t) => t !== tag)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    if (typeof data["rangeWheather"] === "string") {
      data["rangeWheather"] = Number(data["rangeWheather"]);
    }
    data["tags"] = selectedTags; 
    data["clothesId"] = arreyOfGarmentInCanvas; 
    data["userId"] = userId; 
    data["img"] = outfitFromCloudinary; 
    data["favorite"] = rate; 

    console.log(data);
    try {
      await outfitSchemaZod.parseAsync(data);
      console.log("Validation passed");
      
      // Submit to server here
      // לעדכן רידקס
    } catch (err) {
      console.error("Validation failed:", err);
      toast.error("שגיאה ביצירת הלוק. נסה שנית!");
    }
    // לסגור את המודל,  ולנתב לגלריה
  };


  return (
    <Modal
      open
      title="יצירת לוק חדש"
      onCancel={closeModal}
      footer={null}
      style={{ top: 20 }}
      bodyStyle={{
        padding: "20px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Season Selector */}
        <select name="season" className="w-full p-2 border rounded" required>
          <option value="">בחר עונה</option>
          {seasons.map((season: string) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>

        {/* Description */}
        <textarea
          name="desc"
          placeholder="הוסף תיאור (אופציונלי)"
          className="w-full p-2 border rounded"
        ></textarea>

        {/* Weather Range */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="range">לאיזה מזג אוויר הלוק הזה מתאים?</label>
          {/* רותח חם חמים נעים קריר קר קפוא */}
          <input
            type="range"
            name="rangeWheather"
            id="range"
            min="1"
            max="7"
            defaultValue="4"
            className="w-full"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">בחר תגית</h3>
          <div className="flex flex-wrap gap-4">
            {tags.map((tag: string) => (
              <label
                key={tag}
                className="flex items-center p-2 border rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={tag}
                  onChange={(e) => handleTagChange(tag, e.target.checked)}
                  className="mr-2"
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <p>איך היית מדרג את הלוק שיצרת?</p>
          <Rate
            onChange={(value) => setRate(value)}
          />
        </div>

        {/* Image Preview */}
        <div className="relative flex flex-col items-center">
          {outfitFromCloudinary ? (
            <div className="relative w-full max-w-sm h-64 overflow-hidden rounded-lg border shadow-sm mb-4">
              <Image
                src={outfitFromCloudinary}
                layout="fill"
                style={{ objectFit: "contain" }}
                alt="תמונה ללא רקע"
                className="rounded-lg"
              />
            </div>
          ) : (
            <p className="text-gray-500">{imageError}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          צור לוק
        </button>
      </form>
    </Modal>
  );
};

export default OutfitForm;
