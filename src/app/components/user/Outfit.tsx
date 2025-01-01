"use user"
import IOutfit from '@/app/types/IOutfit'
import React from 'react'
import Image from "next/image";
import useDay from "@/app/store/currentDayStore";

const Outfit = ({ look, setChanged }: { look: IOutfit , setChanged: (b:boolean)=> void}) => {
    const { selectedLooks, selectLook } = useDay();

    const isSelected = selectedLooks.some((item) => item._id === look._id);

    return (
        <div
            className="relative text-center cursor-pointer transition-all duration-300 bg-transparent"
            onClick={() => {setChanged(true); selectLook(look)}}
        >
            {/* אם הלוק נבחר, מציגים וי ירוק */}
            {isSelected ? (
                <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ✓
                </div>
            ):<div className="absolute top-2 left-2 bg-white border border-gray-700 rounded-full w-6 h-6 flex items-center justify-center"></div>}
            <Image
                src={look.img}
                alt={`look ${look.id}`}
                width={200}
                height={200}
                className="w-full h-auto shadow-xl border"
            />
        </div>
    )
}

export default Outfit;
