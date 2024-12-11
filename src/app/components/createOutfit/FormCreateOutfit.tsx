"use client";

import React, { useState, useEffect, useContext } from "react";
import { IOutfitType, outfitSchemaZod } from '@/app/types/IOutfit'
import Image from "next/image";
import { Modal, Rate } from "antd";
import { CanvasContext } from "@/app/components/createOutfit/Canvas";
import useUser from "@/app/store/userStore";
import { validSeasons, tags, rangeWheatherDeescription } from "@/app/data/staticArrays"
import { cloudinaryUploud } from "@/app/services/image/saveToCloudinary";
import { toast } from "react-toastify";
import { createOutfit } from "@/app/services/outfitsService"
import "react-toastify/dist/ReactToastify.css";
import {OutfitFormProps} from "@/app/types/canvas"


const OutfitForm: React.FC<OutfitFormProps> = ({ closeModal, outfitImgurl }) => {
  const { _id: userId } = useUser((state) => state);

  const context = useContext(CanvasContext);
  const arreyOfGarmentInCanvas = context?.arreyOfGarmentInCanvas || [];

  // State for form fields
  const [season, setSeason] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [rangeWeather, setRangeWeather] = useState<number>(4);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [rate, setRate] = useState<number>(0);

  // Image states
  const [outfitFromCloudinary, setOutfitFromCloudinary] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  useEffect(() => {
    const saveImageToCloudinary = async () => {
      if (!outfitImgurl) return;

      try {
        setIsImageLoading(true);
        const { imageUrl } = await cloudinaryUploud(outfitImgurl);
        setOutfitFromCloudinary(imageUrl);
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("שגיאה בשמירת הלוק");
      } finally {
        setIsImageLoading(false);
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

    const outfitFinal: IOutfitType = {
      userId: userId,
      clothesId: arreyOfGarmentInCanvas,
      desc: description,
      season: season,
      tags: selectedTags,
      img: outfitFromCloudinary,
      favorite: rate,
      rangeWheather: rangeWeather,
    };

    try {
      await outfitSchemaZod.parseAsync(outfitFinal);
      await createOutfit(outfitFinal);
      toast.success("לוק נוצר בהצלחה!");
      closeModal();
    } catch (err) {
      console.error("Validation failed:", err);
      toast.error("שגיאה ביצירת הלוק. נסה שנית!");
    }
  };

  return (
    <Modal
      open
      title="יצירת לוק חדש"
      onCancel={closeModal}
      footer={null}
      style={{ top: 20 }}
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 space-y-6">

         {/* Image Preview */}
         <div className="relative flex flex-col items-center">
          <div className="relative w-full max-w-sm h-64 overflow-hidden rounded-lg border shadow-sm mb-4">
            {isImageLoading ? (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <p className="text-gray-600">טוען תמונה...</p>
              </div>
            ) : outfitFromCloudinary ? (
              <Image
                src={outfitFromCloudinary}
                layout="fill"
                style={{ objectFit: "contain" }}
                alt="תמונה ללא רקע"
                className="rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100">
                <p className="text-gray-500">תמונה לא זמינה</p>
              </div>
            )}
          </div>
        </div>

        {/* Season Selector */}
        <select 
          value={season} 
          onChange={(e) => setSeason(e.target.value)} 
          className="w-full p-2 border rounded" 
          required
        >
          <option value="">בחר עונה</option>
          {validSeasons.map((seasonOption: string) => (
            <option key={seasonOption} value={seasonOption}>
              {seasonOption}
            </option>
          ))}
        </select>

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="הוסף תיאור (אופציונלי)"
          className="w-full p-2 border rounded"
        ></textarea>

        {/* Weather Range */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="range">לאיזה מזג אוויר הלוק הזה מתאים?</label>
          <span>{rangeWheatherDeescription[rangeWeather - 1]}</span>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              value={rangeWeather}
              onChange={(e) => setRangeWeather(Number(e.target.value))}
              id="range"
              min="1"
              max="7"
              className="w-full"
            />
                       
          </div>
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
                  checked={selectedTags.includes(tag)}
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
            value={rate}
            onChange={(value) => setRate(value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!outfitFromCloudinary || isImageLoading}
          className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            !outfitFromCloudinary || isImageLoading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          צור לוק
        </button>
      </form>
    </Modal>
  );
};

export default OutfitForm;