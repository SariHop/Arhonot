"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image"; // שימוש ב-Image מ-next/image
import IGarment from "@/app/types/IGarment";
import Garment from "./Garment";
import { useWeatherQuery } from "@/app/hooks/weatherQueryHook"; // השימוש ב-hook לקריאת מזג האוויר
import useCanvasStore from "@/app/store/canvasStore";

const Card = ({ garment, isForOutfit }: { garment: IGarment; isForOutfit: boolean }) => {

    const [isModalOpen, setIsModalOpen] = useState(false); // מצב הפופ-אפ (פתוח/סגור)
    const openModal = () => setIsModalOpen(true); // לפתוח את הפופ-אפ
    const closeModal = () => {
        setIsModalOpen(false);
    }

    const [temperature, setTemperature] = useState<number | null>(null); // מצב הטמפרטורה
    const { data: weatherData } = useWeatherQuery(); // שימוש ב-hook לקריאת נתוני מזג האוויר

    const { addImageToCanvasFromGallery } = useCanvasStore();
    const handleClickcard = isForOutfit ? addImageToCanvasFromGallery : undefined;

    useEffect(() => {
        if (weatherData) {
            const currentTemp = weatherData.list[0].main.temp; // שליפת הטמפרטורה
            setTemperature(currentTemp); // עדכון המעלות ב-state
        }
    }, [weatherData]); // התעדכנות עם כל פעם שיש נתונים חדשים

    if (!garment || !garment.img) {
        return <div>פרטי הבגד אינם זמינים</div>;
    }

    const getCircleColor = (garmentRange: number, currentTemperature: number | null): string => {
        const temperatureRanges: Record<number, { min: number; max: number }> = {
            1: { min: 35, max: 90 },
            2: { min: 30, max: 35 },
            3: { min: 25, max: 30 },
            4: { min: 20, max: 25 },
            5: { min: 15, max: 20 },
            6: { min: 5, max: 15 },
            7: { min: -20, max: 5 },
        };

        const garmentTempRange = temperatureRanges[garmentRange];

        if (!garmentTempRange) {
            return 'bg-gray-500';
        }

        const { min, max } = garmentTempRange;

        if (currentTemperature && currentTemperature >= min && currentTemperature <= max) {
            return 'bg-green-500'; // ירוק
        }

        if (currentTemperature && (
            (garmentRange > 1 && currentTemperature >= temperatureRanges[garmentRange - 1]?.min && currentTemperature <= temperatureRanges[garmentRange - 1]?.max) ||
            (garmentRange < 7 && currentTemperature >= temperatureRanges[garmentRange + 1]?.min && currentTemperature <= temperatureRanges[garmentRange + 1]?.max)
        )) {
            return 'bg-yellow-500'; // כתום
        }

        return 'bg-red-500'; // אדום
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm relative p-1 h-[250px]"
            onClick={handleClickcard ? () => handleClickcard(garment.img, garment._id) : openModal}
        >
            <div className="h-[160px] w-full p-1">
                <Image
                    src={garment.img}
                    alt={garment.desc}
                    width={200}
                    height={200}
                    sizes="(max-width: 640px) 33vw, 25vw"
                    className="w-full h-full object-contain rounded-lg"
                />
            </div>
            <p className="text-xs md:text-sm 2xl:text-base 3xl:text-lg md:line-clamp-1 line-clamp-2">{garment.desc}</p>

            <div
                className={`absolute top-2 right-2 w-5 h-5 rounded-full ${getCircleColor(garment.range, temperature)}`}
            />
            {isModalOpen && <Garment garment={garment} closeModal={closeModal} />}
        </div>
    );
};

export default Card;
