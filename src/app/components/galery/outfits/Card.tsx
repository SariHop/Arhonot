"use client";
import React, { useState } from "react";
import Image from "next/image"; // שימוש ב-Image מ-next/image
import Outfit from "./Outfit";
import IOutfit from "@/app/types/IOutfit";
import useDay from '@/app/store/currentDayStore';

const Card = ({ outfit, isSelectForDay }: { outfit: IOutfit, isSelectForDay: boolean }) => {
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
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm" onClick={isSelectForDay ? () => { addOutfit(outfit); toggleDrawer(false); } : openModal}>
            <Image
                src={outfit.img}
                alt={outfit.desc}
                width={0}
                height={0}
                sizes="(max-width: 640px) 33vw, 25vw"
                className="w-full h-auto object-cover rounded-lg"
            />
            <p>{outfit.desc}</p>
            {isModalOpen && <Outfit outfit={outfit} closeModal={closeModal} />}
        </div>
    );
};

export default Card;
