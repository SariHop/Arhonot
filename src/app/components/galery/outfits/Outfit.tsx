"use client";
import React, { useState } from "react";
import Image from "next/image";
import { IOutfitProps } from "../../../types/IOutfit";
import { IoMdClose } from "react-icons/io";
import useOutfits from "@/app/store/outfitsStore";
import { toast } from "react-toastify";
import { deleteOutfit } from "@/app/services/outfitServices";
import { FaBars, FaEdit, FaTrash } from "react-icons/fa";
import EditOutfit from "../../createOutfit/EditOutfit";

const Outfit = ({ outfit, closeModal }: IOutfitProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const { deleteOutfit: deleteFromStore } = useOutfits();
    const [isDeleting, setIsDeleting] = useState(false); // מצב המחיקה
    
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
      };
    
      const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // מונע פיזור אירוע
        closeModal();
        setMenuOpen(false);
      };
    
      const confirmDelete = () => {
        toast(
          <div dir="rtl">
            <p>האם אתה בטוח שברצונך למחוק את הלוק הזה?</p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                    toast.dismiss(); // סוגר את ההתראה לאחר אישור
                  handleDelete();
                }}
                className="text-red-500 pl-2"
              >
                אישור
              </button>
              <button
                onClick={() => {
                  toast.dismiss();
                  setIsDeleting(false); // אחרי המחיקה, החזרת המצב הרגיל
                }}
                className="text-blue-500"
              >
                ביטול
              </button>
            </div>
          </div>,
          {
            autoClose: false,
            closeButton: true,
            hideProgressBar: true,
            position: "top-center",
            onClose: () => setIsDeleting(false), // מאפס את המצב גם בסגירה ידנית של ההתראה
          }
        );
        setIsDeleting(true);
      };
    
      function handleDelete() {
        try {
            console.log("in delete");
          deleteOutfit(String(outfit._id));
          console.log("after delete outfit");
          deleteFromStore(outfit);
          console.log("after delete outfit store");
          closeModal();
          console.log("after close modal");

          toast.success("הלוק נמחק בהצלחה!");
          console.log("after toast");

        } catch (error: unknown) {
          console.log("error accured while deleting outfit: ", error)
        }
        setIsDeleting(false); // אחרי המחיקה, החזרת המצב הרגיל
      }
    

    const handleEdit = () => {
        debugger
        setUpdateOpen(true);
    };

    return (
        <>
        <div
        className={`fixed inset-0 ${
          isDeleting ? "pointer-events-none" : ""
        } bg-gray-800 bg-opacity-50 flex items-center justify-center z-50`}
      >
        {/* שכבה נוספת לאינטראקציות */}
        {isDeleting && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50 z-40 pointer-events-auto" />
        )}

        {!updateOpen && (
          <div
            className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md relative text-right z-50"
            onClick={(e) => {
              e.stopPropagation();
              if (menuOpen) setMenuOpen(false);
            }}
            dir="rtl"
          >
                {/* Toast עם כפתורים */}
                <button
                    onClick={handleCloseClick}
                    className="absolute top-4 left-4 text-3xl text-gray-500 transition"
                >
                    <IoMdClose />
                </button>
                <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                    {outfit.desc || "הלוק שלך"}
                </h2>
                <div className="flex flex-col items-center">
                    <div className="w-full border-b-2 border-t-2 h-[250px] p-4">                    <Image
                        src={outfit.img}
                        alt={outfit.desc}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain rounded-lg"
                        />
                    </div>
                    <div className="mt-6 w-full space-y-2 relative">
                        <FaBars
                            className="absolute top-0 left-2 text-gray-500 text-xl cursor-pointer"
                            onClick={toggleMenu}
                        />
                        {menuOpen && (
                        <div className="absolute top-8 left-2 bg-white shadow-lg rounded-lg p-2 z-10 flex flex-col gap-2">
                            <button
                                className="flex items-center gap-2 text-red-500 hover:bg-red-100 p-2 rounded"
                                onClick={confirmDelete}
                            >
                            <FaTrash />
                            </button>
                            <button
                                className="flex items-center gap-2 text-blue-500 hover:bg-blue-100 p-2 rounded"
                                onClick={handleEdit}
                                >
                                <FaEdit />
                            </button>
                            </div>)}
                        {/* עונה */}
                        <p className="text-gray-700">
                            <strong>עונה:</strong> {outfit.season}
                        </p>

                        {/* טווח */}
                        <p className="text-gray-700">
                            <strong>טווח מזג אוויר:</strong> {outfit.rangeWheather}
                        </p>

                        {/* תגיות */}
                        <p className="text-gray-700">
                            <strong>תגיות:</strong> {outfit.tags.join(", ")}
                        </p>

                        {/* מחיר */}
                        <p className="text-gray-700">
                            <strong>מחיר:</strong> {outfit.favorite} ₪
                        </p>

                        {/* קישור */}
                        <p className="text-gray-700">
                            <strong>קישור:</strong>{" "}
                            <a
                                href={outfit.img} // אם הכוונה היא לקישור למוצר עצמו, אולי צריך לשנות את `outfit.img` לכישור המתאים
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                מעבר לקישור
                            </a>
                        </p>
                        
                    </div>
                </div>
            </div>)}
        <div onClick={(e) => e.stopPropagation()}>
          {updateOpen && (           
            <EditOutfit closeModal={closeModal} outfit={outfit}/>
          )}
        </div>
        </div>

    </>

    );
};

export default Outfit;
