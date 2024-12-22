"use client";
import React, { useState, useEffect } from "react";
import { IOutfitType, outfitSchemaZod } from '@/app/types/IOutfit'
import Image from "next/image";
import { Rate } from "antd";
import useUser from "@/app/store/userStore";
import { validSeasons, tags, rangeWheatherDeescription } from "@/app/data/staticArrays"
import { cloudinaryUploud } from "@/app/services/image/saveToCloudinary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCanvasStore from "@/app/store/canvasStore";
import { useRouter } from 'next/navigation';
import { ZodError } from "zod";
import { createOutfit } from "@/app/services/outfitServices"

const OutfitForm: React.FC = () => {
    const { _id: userId } = useUser((state) => state);
    const { garments, editOutfit, setCanvas, setGarments, canvasUrl, setSelectedObject } = useCanvasStore();

    // State for form fields
    const [season, setSeason] = useState("");
    const [description, setDescription] = useState("");
    const [rangeWeather, setRangeWeather] = useState(4);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [rate, setRate] = useState(0);
    const [canvasJson, setCanvasJson] = useState({})
    // img
    const [outfitFromCloudinary, setOutfitFromCloudinary] = useState("");
    const [isImageLoading, setIsImageLoading] = useState(true);
    // error messege
    const [errormessege, setErrormessege] = useState("");

    const router = useRouter()

    useEffect(() => {
        // אם מדובר בעריכה של אאוטפיט טעינת הערכים שלו לשדות הקלט
        if (editOutfit) {
            setSeason(editOutfit.season);
            setDescription(editOutfit.desc || "");
            setRangeWeather(editOutfit.rangeWheather);
            setSelectedTags(editOutfit.tags);
            setRate(editOutfit.favorite);
            setOutfitFromCloudinary(editOutfit.img);
        }
    }, [editOutfit]);

    useEffect(() => {
        const saveImageToCloudinary = async () => {
            try {
                setIsImageLoading(true);
                const { imageUrl } = await cloudinaryUploud(canvasUrl); // שם מתוקן
                setOutfitFromCloudinary(imageUrl);
                setIsImageLoading(false);

            } catch (error) {
                console.error("Image upload error:", error);
                toast.error("שגיאה בטעינת הלוק");
            }
        };

        const getCanvasfromlocaStorage = () => {
            const savedCanvas = localStorage.getItem("canvas-store");
            if (savedCanvas) {
                const savedCanvasObj = JSON.parse(savedCanvas);
                const canvasJSON = savedCanvasObj.state.canvasJSON
                setCanvasJson(canvasJSON)
            }
        };

        saveImageToCloudinary();
        getCanvasfromlocaStorage()
    }, [canvasUrl]);


    const handleTagChange = (tag: string, checked: boolean) => {
        setSelectedTags((prevTags) =>
            checked ? [...prevTags, tag] : prevTags.filter((t) => t !== tag)
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const outfitFinal: IOutfitType = {
            userId: String(userId),
            clothesId: garments,
            desc: description,
            season: season,
            tags: selectedTags,
            img: outfitFromCloudinary,
            favorite: rate,
            rangeWheather: rangeWeather,
            canvasJson: canvasJson
        };

        try {
            await outfitSchemaZod.parseAsync(outfitFinal);

            if (editOutfit) {
                await createOutfit(outfitFinal);
                toast.success("לוק עודכן בהצלחה!");
            } else {
                await createOutfit(outfitFinal);
                toast.success("לוק נוצר בהצלחה!");
            }
            router.push("/pages/user");

            // לןק עודכן
            // לנקות את הקנבס?
            setCanvas(null)
            setGarments([])
            setSelectedObject(null)
        } catch (err) {
            if (err instanceof ZodError) {
                const errorMessages = err.errors.map((e) => e.message).join(", ");
                console.error("Validation failed:", errorMessages);
                setErrormessege(`שגיאה ביצירת הלוק: ${errorMessages}`);
            } else {
                console.error("Unexpected error:", err);
                setErrormessege("שגיאה ביצירת הלוק. נסה שנית!");
            }
        }
    };

    return (
        <>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-7 bg-white rounded shadow-md space-y-4 ">
                <input type="button" value="חזרה לעמוד עריכה" onClick={() => { router.push("/pages/user/outfit_canvas") }} />
                <h1 className="text-2xl font-semibold text-center">יצירת לבוש

                </h1>

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
                    disabled={!outfitFromCloudinary || isImageLoading}
                    className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!outfitFromCloudinary || isImageLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                >
                    צור לוק
                </button>
            </form>
        </>
    );
};

export default OutfitForm;