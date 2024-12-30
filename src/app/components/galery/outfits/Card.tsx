"use client";
import React, { useState } from "react";
import Image from "next/image"; // שימוש ב-Image מ-next/image
import Outfit from "./Outfit";
import IOutfit from "@/app/types/IOutfit";
import useDay from '@/app/store/currentDayStore';

const Card = ({ outfit, isSelectForDay ,setChanged = () => {}}: { outfit: IOutfit, isSelectForDay: boolean, setChanged?: (b:boolean)=>void }) => {
    // הפונקציה להוספת בגד לקנבס
    // const context: CanvasContextType | null = useContext(CanvasContext);
    // const { addImageToCanvas } = context;
    const { addOutfit, toggleDrawer } = useDay();
    const [isModalOpen, setIsModalOpen] = useState(false); // מצב הפופ-אפ (פתוח/סגור)
    const openModal = () => setIsModalOpen(true); // לפתוח את הפופ-אפ
    const closeModal = () => {
        setIsModalOpen(false);
    }
    if (!outfit || !outfit.img) {
        return <div>פרטי הבגד אינם זמינים</div>;
    }

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm p-1 h-[200px]" onClick={isSelectForDay ? () => {setChanged(true); addOutfit(outfit); toggleDrawer(false); } : openModal}>
            <div className="h-[160px] w-full p-1">
            <Image
                src={outfit.img}
                alt={outfit.desc}
                width={200}
                height={200}
                sizes="(max-width: 640px) 33vw, 25vw"
                className="w-full h-full object-contain rounded-lg"
            />
            </div>
            <p className="text-xs md:text-sm 2xl:text-base 3xl:text-lg line-clamp-1">{outfit.desc}</p>
            {isModalOpen && <Outfit outfit={outfit} closeModal={closeModal} />}
        </div>
    );
};

export default Card;
