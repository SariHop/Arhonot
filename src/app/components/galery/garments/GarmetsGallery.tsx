"use client";
import { useState, useEffect } from "react";
import Card from "./Card";
import useGarments from '../../../store/garmentsStore';
import { useWeatherQuery } from "@/app/hooks/weatherQueryHook"; // השימוש ב-hook לקריאת מזג האוויר
import { numberOfItemsInPage } from "@/app/services/galleryService";

let ITEMS_PER_PAGE = 24;

const GarmentsGallery = ({ isForOutfit }: { isForOutfit: boolean }) => {
    const { sortedGarments } = useGarments();
    const [currentPage, setCurrentPage] = useState(1); // מעקב אחר העמוד הנוכחי

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = sortedGarments.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedGarments.length / ITEMS_PER_PAGE);

    const [temperature, setTemperature] = useState<number | null>(null); // מצב הטמפרטורה
    const { data: weatherData } = useWeatherQuery(); // שימוש ב-hook לקריאת נתוני מזג האוויר
    useEffect(() => {
        if (weatherData) {
            const currentTemp = weatherData.list[0].main.temp; // שליפת הטמפרטורה
            setTemperature(currentTemp); // עדכון המעלות ב-state
        }
        ITEMS_PER_PAGE = numberOfItemsInPage();
    }, [weatherData, window.innerWidth]); // התעדכנות עם כל פעם שיש נתונים חדשים

    useEffect(() => {
        setCurrentPage(1);
    }, [sortedGarments]);
    // פונקציה ממוינת לבגדים
    const getCircleColor = (garmentRange: number, currentTemperature: number | null): number => {
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
            return 3;
        }

        const { min, max } = garmentTempRange;
        if (currentTemperature) {
            if (currentTemperature >= min && currentTemperature <= max) {
                return 1; // ירוק
            }

            if (currentTemperature >= temperatureRanges[garmentRange - 1]?.min && currentTemperature <= temperatureRanges[garmentRange - 1]?.max ||
                currentTemperature >= temperatureRanges[garmentRange + 1]?.min && currentTemperature <= temperatureRanges[garmentRange + 1]?.max) {
                return 2; // כתום
            }

            return 3; // אדום
        }
        return 4;
    };


    const sortedGarmentsByColor = sortedGarments.sort((garmentA, garmentB) => {
        const colorA = getCircleColor(garmentA.range, temperature);
        const colorB = getCircleColor(garmentB.range, temperature);

        return colorA - colorB; // ממיין לפי ערך החזרה של הפונקציה
    });


    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    return (
        <>
            {!sortedGarments.length && <p>לא נמצאו בגדים עבור לקוח זה.</p>}
            <div className="grid  grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 gap-4 px-4">
                {currentItems.map((garment) => (
                    <Card key={String(garment._id)} garment={garment} isForOutfit={isForOutfit} />
                ))}
            </div>
            {sortedGarmentsByColor.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center items-center mt-6 space-x-6">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`text-gray-600 underline 
                        ${currentPage === 1 ? 'text-gray-400 no-underline cursor-not-allowed' : 'hover:text-gray-800'} px-2 mx-2`}
                    >
                        הקודם
                    </button>
                    <span className="text-gray-600 font-medium mx-4">
                        עמוד <span className="font-bold">{currentPage}</span> מתוך <span className="font-bold">{totalPages}</span>
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`text-gray-600 underline 
                        ${currentPage === totalPages ? 'text-gray-400 no-underline cursor-not-allowed' : 'hover:text-gray-800'}`}
                    >
                        הבא
                    </button>
                </div>
            )}

        </>
    );
};

export default GarmentsGallery;
