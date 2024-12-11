"use client";
import React, { useState, useEffect, useContext } from "react";
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
    const { data: weatherData} = useWeatherQuery(); // שימוש ב-hook לקריאת נתוני מזג האוויר

    useEffect(() => {
        if (weatherData) {
            const currentTemp = weatherData.list[0].main.temp; // שליפת הטמפרטורה
            setTemperature(currentTemp); // עדכון המעלות ב-state
        }
    }, [weatherData]); // התעדכנות עם כל פעם שיש נתונים חדשים

    if (!garment || !garment.img) {
        return <div>פרטי הבגד אינם זמינים</div>;
    }

    const getCircleColor = (garmentRange: number, currentTemperature: number): string => {
        // הגדרת טווחים לפי הנתונים שלך עם Record
        const temperatureRanges: Record<number, { min: number; max: number }> = {
            1: { min: 35, max: 90 },
            2: { min: 30, max: 35 },
            3: { min: 25, max: 30 },
            4: { min: 20, max: 25 },
            5: { min: 15, max: 20 },
            6: { min: 5, max: 15 },
            7: { min: -20, max: 5 },
        };

        // מציאת הטווח של הבגד
        const garmentTempRange = temperatureRanges[garmentRange];

        // אם הטווח לא קיים, מחזירים צבע אפור
        if (!garmentTempRange) {
            return 'gray-500';
        }

        const { min, max } = garmentTempRange;

        if (currentTemperature >= min && currentTemperature <= max) {
            return 'green-500'; // ירוק
        }

        if (currentTemperature >= temperatureRanges[garmentRange - 1]?.min && currentTemperature <= temperatureRanges[garmentRange - 1]?.max ||
            currentTemperature >= temperatureRanges[garmentRange + 1]?.min && currentTemperature <= temperatureRanges[garmentRange + 1]?.max) {
            return 'yellow-500'; // כתום
        }

        return 'red-500'; // אדום
    };

    const { addImageToCanvas } = useCanvasStore();

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm relative"
            onClick={isForOutfit ?()=>{ addImageToCanvas(garment.img, garment._id)}  : openModal}
        >
            <Image
                src={garment.img}
                alt={garment.desc}
                width={0}
                height={0}
                sizes="(max-width: 640px) 33vw, 25vw"
                className="w-full h-auto object-cover rounded-lg"
            />
            <p>{garment.desc}</p>

            {temperature !== null && (
                <div
                    className={`absolute top-2 right-2 w-5 h-5 rounded-full bg-${getCircleColor(garment.range, temperature)}`}
                ></div>
            )}


            {isModalOpen && <Garment garment={garment} closeModal={closeModal} />}
        </div>
    );
};

export default Card;
