"use client";
import React, { useState } from "react";
import Image from "next/image"; // שימוש ב-Image מ-next/image
import IGarment from "@/app/types/IGarment";
import Garment from "./Garment";
// import { useContext } from "react";
// import { CanvasContext } from "@/app/components/createOutfit/Canvas";
// import { CanvasContextType } from "@/app/types/canvas";


const Card = ({ garment }: { garment: IGarment }) => {

    // הפונקציה להוספת בגד לקנבס
    // const context:CanvasContextType|null = useContext(CanvasContext);
    // const { addImageToCanvas } = context;

    const [isModalOpen, setIsModalOpen] = useState(false); // מצב הפופ-אפ (פתוח/סגור)
    const openModal = () => setIsModalOpen(true); // לפתוח את הפופ-אפ
    const closeModal = () => {
        setIsModalOpen(false);
    }
    if (!garment || !garment.img) {
        return <div>פרטי הבגד אינם זמינים</div>;
    }

    return (
        // <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm" onClick={()=>{addImageToCanvas(garment.img, garment._id)}}
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm" onClick={openModal}
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
            {isModalOpen && <Garment garment={garment} closeModal={closeModal} />}
        </div>
    );
};

export default Card;
