"use client";
import React, { useState } from "react";
import Image from "next/image";
import { GarmentProps } from "@/app/types/IGarment";
import { rangeWheatherDeescription } from "../../../data/staticArrays";
import { IoMdClose } from "react-icons/io";
import { FaBars, FaTrash, FaEdit } from "react-icons/fa";
import { deleteGarment } from "@/app/services/garmentService";
import CreateGarment from "../../createGarment/CreateGarment";
import useGarments from "@/app/store/garmentsStore";
import axios from "axios";
import { toast } from "react-toastify";

const Garment = ({ garment, closeModal }: GarmentProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const {deleteGarment: deleteFromStore} = useGarments();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // מונע פיזור אירוע
    closeModal();
    setMenuOpen(false);
  };

  function handleDelete() {
    try {
        deleteGarment(String(garment._id));
        deleteFromStore(garment)
        closeModal();
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const serverError = error.response?.data?.error || "Unknown server error";
          toast.error(`Server Error: ${serverError}`);
        } else {
          toast.error("An unexpected error occurred");
        }
    }
  }

  function handleEdit() {
    console.log("in edit", garment);
    // closeModal();
    setUpdateOpen(true);
  }

  

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleCloseClick} // מונע סגירה בלחיצה על המודאל עצמו
    >
      {!updateOpen && (
        <div
          className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md relative text-right"
          onClick={(e) => {
            e.stopPropagation();
            if (menuOpen) setMenuOpen(false);
          }} // מונע סגירה בלחיצה על התוכן
          dir="rtl"
        >
          <button
            onClick={handleCloseClick}
            className="absolute top-4 left-4 text-3xl text-gray-500 transition"
          >
            <IoMdClose />
          </button>

          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
            {garment.desc}
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-full border-b-2 border-t-2 h-[250px] p-4">
              <Image
                src={garment.img}
                alt={garment.desc}
                width={200}
                height={200}
                className="w-full h-full object-contain rounded-lg"

                // className="object-cover rounded-lg mt-4"
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
                    onClick={handleDelete}
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="flex items-center gap-2 text-blue-500 hover:bg-blue-100 p-2 rounded"
                    onClick={handleEdit}
                  >
                    <FaEdit />
                  </button>
                </div>
              )}
              <p className="text-gray-700">
                <strong>עונה:</strong> {garment.season}
              </p>
              <p className="text-gray-700">
                <strong>מותאם למזג אויר: </strong>
                <span>{rangeWheatherDeescription[garment.range - 1]}</span>
              </p>
              <p className="text-gray-700">
                <strong>קטגוריה:</strong> {garment.category}
              </p>
              <span className="text-gray-700 flex items-center">
                <strong>צבע: </strong>
                <span
                  style={{ backgroundColor: garment.color }}
                  className="w-6 h-6 rounded-full border mx-2"
                ></span>
              </span>
              <p className="text-gray-700">
                <strong>מחיר:</strong> {garment.price} ₪
              </p>
              <p className="text-gray-700">
                <strong>קישור:</strong>{" "}
                <a
                  href={garment.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  מעבר לקישור
                </a>
              </p>
              <p className="text-gray-700">
                <strong>תגיות:</strong> {garment.tags.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}
      <div onClick={(e) => e.stopPropagation()} >
      {updateOpen && <CreateGarment garment={garment} closeModal={closeModal}/>}
      </div>
    </div>
  );
};

export default Garment;
