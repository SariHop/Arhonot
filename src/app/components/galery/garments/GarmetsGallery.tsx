"use client";
import { useState, useEffect } from "react";
import Card from "./Card";
import useGarments from '../../../store/garmentsStore';

const ITEMS_PER_PAGE = 4;

const GarmentsGallery = ({ isForOutfit }: { isForOutfit: boolean }) => {
    const { sortedGarments } = useGarments();
    const [currentPage, setCurrentPage] = useState(1); // מעקב אחר העמוד הנוכחי

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = sortedGarments.slice(startIndex, endIndex);

    const totalPages = Math.ceil(sortedGarments.length / ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [sortedGarments]);

    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    return (
        <>
            {!sortedGarments.length && <p>לא נמצאו בגדים עבור לקוח זה.</p>}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-7 gap-4 px-4">
                {currentItems.map((garment) => (
                    <Card key={String(garment._id)} garment={garment} isForOutfit={isForOutfit} />
                ))}
            </div>
            {sortedGarments.length > ITEMS_PER_PAGE && (
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
};

export default GarmentsGallery;
