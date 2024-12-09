"use client";
import React from "react";
import Image from "next/image";
import { IOutfitProps } from "../../../types/IOutfit";

const Outfit = ({ outfit, closeModal }: IOutfitProps) => {
    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // מונע פיזור אירוע
        closeModal();
    };

    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => e.stopPropagation()} // מונע סגירה בלחיצה על המודאל עצמו
        >
            <div
                className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md relative text-right"
                onClick={(e) => e.stopPropagation()} // מונע סגירה בלחיצה על התוכן
                dir="rtl"
            >
                <button
                    onClick={handleCloseClick}
                    className="absolute top-2 left-2 text-2xl text-red-500 hover:text-red-700 transition"
                >
                    ✖
                </button>
                <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                    {outfit.desc}
                </h2>
                <div className="flex flex-col items-center">
                    <Image
                        src={outfit.img}
                        alt={outfit.desc}
                        width={180}
                        height={270}
                        className="object-cover rounded-lg mt-4"
                    />
                    <div className="mt-6 w-full space-y-2">
                        {/* עונה */}
                        <p className="text-gray-700">
                            <strong>עונה:</strong> {outfit.season}
                        </p>

                        {/* טווח */}
                        <p className="text-gray-700">
                            <strong>טווח מזג אוויר:</strong> {outfit.rangeWheather}
                        </p>

                        {/* תגיות */}
                        <p className="text-gray-700">
                            <strong>תגיות:</strong> {outfit.tags.join(", ")}
                        </p>

                        {/* מחיר */}
                        <p className="text-gray-700">
                            <strong>מחיר:</strong> {outfit.favorite} ₪
                        </p>

                        {/* קישור */}
                        <p className="text-gray-700">
                            <strong>קישור:</strong>{" "}
                            <a
                                href={outfit.img} // אם הכוונה היא לקישור למוצר עצמו, אולי צריך לשנות את `outfit.img` לכישור המתאים
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                מעבר לקישור
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Outfit;
