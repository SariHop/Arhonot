"use client";
import React, { useState, useEffect } from "react";
import { IOutfitProps, outfitSchemaZod } from '@/app/types/IOutfit'
import { Rate } from "antd";
import { validSeasons, tags, rangeWheatherDeescription } from "@/app/data/staticArrays"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ZodError } from "zod";
import { updateOutfit } from "@/app/services/outfitServices";

const OutfitForm = ({ outfit, closeModal }: IOutfitProps) => {

    // State for form fields
    const [season, setSeason] = useState("");
    const [description, setDescription] = useState("");
    const [rangeWeather, setRangeWeather] = useState(4);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [rate, setRate] = useState(0);

    // messege
    const [errormessege, setErrormessege] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);


    useEffect(() => {
        if (outfit) {
            setSeason(outfit.season);
            setDescription(outfit.desc || "");
            setRangeWeather(outfit.rangeWheather);
            setSelectedTags(outfit.tags);
            setRate(outfit.favorite);
        }
    }, [outfit]);

    const handleTagChange = (tag: string, checked: boolean) => {
        setSelectedTags((prevTags) =>
            checked ? [...prevTags, tag] : prevTags.filter((t) => t !== tag)
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);

        const outfitFinal = {
            desc: description,
            season: season,
            tags: selectedTags,
            favorite: rate,
            rangeWheather: rangeWeather,
        };

        try {
            const submitOutfit = {
                ...outfit,
                ...outfitFinal,
                userId: outfit.userId.toString(),
                clothesId: outfit.clothesId.map((id) => id.toString())
            };

            console.log(submitOutfit)
            await outfitSchemaZod.parseAsync(submitOutfit);
            await updateOutfit(submitOutfit, outfit._id as string);
            toast.success("לוק עודכן בהצלחה!");
            closeModal()

        } catch (err) {
            if (err instanceof ZodError) {
                const errorMessages = err.errors.map((e) => e.message).join(", ");
                console.error("Validation failed:", errorMessages);
                setErrormessege(`שגיאה : ${errorMessages}`);
            } else {
                console.error("Unexpected error:", err);
                setErrormessege("שגיאה . נסה שנית!");
            }
        } finally {
            setIsUpdating(false); // החזר את המצב לנורמלי
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-7 bg-white rounded shadow-md space-y-4 ">
                <h1 className="text-2xl font-semibold text-center">{outfit ? "עריכת לבוש" : "יצירת לבוש"} </h1>

                {/* Season Selector */}
                <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value=""> עונה</option>
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
                    <h3 className="text-lg font-medium"> תגיות</h3>
                    <div className="flex flex-wrap gap-4">
                        {tags.map((tag: string) => (
                            <label
                                key={tag}
                                className={`flex items-center p-2 border rounded cursor-pointer ${selectedTags.includes(tag)
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200"
                                    }`}
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

                {errormessege && <p className="text-red-500">{errormessege}</p>}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isUpdating} // חסום את הכפתור בזמן עדכון
                    className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 ${isUpdating
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
                        }`}
                >
                    {isUpdating ? "מעדכן..." : "עדכן לבוש"}
                </button>


                <button
                    type="button"
                    onClick={closeModal}
                    className="w-full bg-gray-400 text-white py-2 px-4 rounded-md mt-4 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    ביטול
                </button>
            </form>
        </>
    );
};

export default OutfitForm;