import React from "react";
import useDay from "@/app/store/currentDayStore";
import Image from "next/image";
import ShowGalery from "./ShowGalery";
import Outfit from "../user/Outfit";

const LooksList: React.FC = () => {
    const { allLooks, selectedLooks, selectLook } = useDay();
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-4">
                {allLooks.map((look) => (
                    <Outfit key={look?._id || look.id} look={look} />
                ))}
                <ShowGalery />
            </div>
            {/* הצגת הלוקים הנבחרים */}
            <div className="flex flex-wrap gap-3 justify-center">
                {selectedLooks.map((look) => (
                    <div
                        key={look.id}
                        className="border border-gray-300 rounded-lg p-2 max-w-[80px] text-center cursor-pointer transition-all duration-300 hover:scale-105"
                        onClick={() => selectLook(look)} // הפעלת פונקציית selectLook
                    >
                        <Image
                            src={look.img}
                            alt={`look ${look.id}`}
                            width={80}
                            height={80}
                            className="w-full h-auto rounded-lg mb-2"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LooksList;
