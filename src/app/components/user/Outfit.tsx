"use user"
import IOutfit from '@/app/types/IOutfit'
import React from 'react'
import Image from "next/image";
import useDay from "@/app/store/currentDayStore";

const Outfit = ({ look }: { look: IOutfit }) => {
    const { selectedLooks, selectLook } = useDay();

    const isSelected = selectedLooks.some((item) => item._id === look._id);

    return (
        <div
            className="relative border border-gray-300 rounded-lg p-4 max-w-[200px] text-center cursor-pointer transition-all duration-300 bg-transparent"
            onClick={() => selectLook(look)}
        >
            {/* אם הלוק נבחר, מציגים וי ירוק */}
            {isSelected && (
                <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ✓
                </div>
            )}
            <Image
                src={look.img}
                alt={`look ${look.id}`}
                width={200}
                height={200}
                className="w-full h-auto rounded-lg mb-4"
            />
            <p className="text-sm text-gray-700">{look.desc}</p>
        </div>
    )
}

export default Outfit;
