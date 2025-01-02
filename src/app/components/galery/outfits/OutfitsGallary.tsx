"use client";
import { useState, useEffect } from "react";
import Card from "./Card";
import useOutfit from '../../../store/outfitsStore';
import IOutfit from "@/app/types/IOutfit";
import { numberOfItemsInPage } from "@/app/services/galleryService";

let ITEMS_PER_PAGE = 24;

const OutfitsGallary = ({ isSelectForDay , setChanged= () => {}}: { isSelectForDay: boolean, setChanged?: (b:boolean)=>void }) => {
  const { sortedOutfits } = useOutfit();
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = sortedOutfits.slice(startIndex, endIndex);

  const totalPages = Math.ceil(sortedOutfits.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
    ITEMS_PER_PAGE = numberOfItemsInPage();
  }, [sortedOutfits, window.innerWidth]);

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  return (
    <>
      {!sortedOutfits.length && <p>לא נמצאו לוקים עבור לקוח זה.</p>}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 gap-4 px-4">
        {currentItems.map((outfit:IOutfit) => (
          <Card key={String(outfit._id)} outfit={outfit} isSelectForDay={isSelectForDay} setChanged={setChanged}/>
        ))}
      </div>
      {sortedOutfits.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center mt-6 space-x-6">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`text-gray-600 underline 
                      ${currentPage === 1 ? 'text-gray-400 no-underline cursor-not-allowed' : 'hover:text-gray-800'} px-2 mx-2`}
          >
            הקודם
          </button>
          <span className="text-gray-600 font-medium mx-4">
            עמוד <span className="font-bold">{currentPage}</span> מתוך <span className="font-bold">{totalPages}</span>
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`text-gray-600 underline 
                      ${currentPage === totalPages ? 'text-gray-400 no-underline cursor-not-allowed' : 'hover:text-gray-800'}`}
          >
            הבא
          </button>
        </div>
      )}

    </>
  );
}

export default OutfitsGallary