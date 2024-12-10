"use client"
import React, { useState } from "react";
import Gallery from "../galery/Galery";
import { ChevronUp, ChevronDown } from "lucide-react";

const ShowGallery: React.FC = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const toggleGallery = () => {
    setIsGalleryOpen(!isGalleryOpen);
  };

  return (
    <div className="w-full">
      {/* <div className="hidden xl:block">
        <Gallery isForOutfit={true} />
      </div> */}

      {/* Mobile and smaller screens - with toggle button */}
      {/* <div className="xl:hidden bg-white pt-2"> */}
      <div className=" bg-white">
        <button
          onClick={toggleGallery}
          className="sticky top-0 z-50 w-full bg-gray-100 py-4 px-4 flex items-center justify-center 
                     border-t border-b border-gray-200 
                     hover:bg-gray-200 transition-colors duration-300"
        >
          <span className="mr-2 text-gray-700">
            {isGalleryOpen ? "סגירת הגלריה" : "פתיחת הגלריה"}
          </span>
          {isGalleryOpen ? <ChevronUp /> : <ChevronDown />}
        </button>

        {/* Gallery with slide animation */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isGalleryOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <Gallery isForOutfit={true} />
        </div>
      </div>
    </div>
  );
}

export default ShowGallery;