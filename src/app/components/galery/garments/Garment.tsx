"use client";
import React from 'react'
import Image from "next/image";
import { GarmentProps } from '@/app/types/IGarment';

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
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative"
                onClick={(e) => e.stopPropagation()} // מונע סגירה בלחיצה על התוכן
            >
                <button
                    onClick={handleCloseClick}
                    className="absolute top-2 right-2 text-xl text-red-500"
                >
                    X
                </button>
                <h2 className="text-2xl font-semibold text-center">{garment.desc}</h2>
                <Image
                    src={garment.img}
                    alt={garment.desc}
                    width={200}
                    height={300}
                    className="object-cover rounded-lg mt-4 text-center"
                />
                <div className="mt-4">
                    <p><strong>Season:</strong> {garment.season}</p>
                    <p><strong>Range:</strong> {garment.range}</p>
                    <p><strong>Category:</strong> {garment.category}</p>
                    <p><strong>Color:</strong> <div style={{ backgroundColor: garment.color }}>{garment.color}</div></p>
                    <p><strong>Price:</strong> ${garment.price}</p>
                    <p><strong>Link:</strong> <a href={garment.link} target="_blank" className="text-blue-500">Visit Link</a></p>
                    <p><strong>Tags:</strong> {garment.tags.join(", ")}</p>
                </div>
            </div>
        </div>
    )
}

export default Garment