"use client";
import React from "react";
import Image from "next/image";
import { GarmentProps } from "@/app/types/IGarment";

const Garment = ({ garment, closeModal }: GarmentProps) => {
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
                    {garment.desc}
                </h2>
                <div className="flex flex-col items-center">
                    <Image
                        src={garment.img}
                        alt={garment.desc}
                        width={180}
                        height={270}
                        className="object-cover rounded-lg mt-4"
                    />
                    <div className="mt-6 w-full space-y-2">
                        <p className="text-gray-700">
                            <strong>עונה:</strong> {garment.season}
                        </p>
                        <p className="text-gray-700">
                            <strong>טווח:</strong> {garment.range}
                        </p>
                        <p className="text-gray-700">
                            <strong>קטגוריה:</strong> {garment.category}
                        </p>
                        <p className="text-gray-700 flex items-center">
                            <strong>צבע:  </strong>
                            <div
                                style={{ backgroundColor: garment.color }}
                                className="w-6 h-6 rounded-full border mx-2"
                            ></div>
                        </p>
                        <p className="text-gray-700">
                            <strong>מחיר:</strong> {garment.price} ₪ 
                        </p>
                        <p className="text-gray-700">
                            <strong>קישור:</strong>{" "}
                            <a
                                href={garment.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                מעבר לקישור
                            </a>
                        </p>
                        <p className="text-gray-700">
                            <strong>תגיות:</strong> {garment.tags.join(", ")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Garment;
