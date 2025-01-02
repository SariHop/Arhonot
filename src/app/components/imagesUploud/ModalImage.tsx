"use client"
import React, { FC } from 'react';
import Image from 'next/image'
import { cloudinaryUploud } from '@/app/services/image/saveToCloudinary';
import { ModalImageProps } from '@/app/types/props';
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal: FC<ModalImageProps> = ({ isOpen, onClose, fileWithNoBG, setCloudinary }) => {

    if (!isOpen) return null;

    const handleAccept = async () => {
        onClose();
        if (fileWithNoBG != null) {
            return toast.promise(
                cloudinaryUploud(fileWithNoBG)
                    .then(data => {
                        if (!data.imageUrl) {
                            throw new Error("Image URL is missing");
                        }
                        setCloudinary(data.imageUrl);
                        return "success";
                    })
                    .catch(error => {
                        console.error(error);
                        throw new Error("Error while saving changes");
                    }),
                {
                    pending: "רק רגע! שומרים בשבילך את התמונה",
                    success: "התמונה נשמרה בהצלחה",
                    error: "שגיאה בשמירת התמונה. נסה שנית!"
                }
            );
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full h-full md:max-w-3xl md:h-3/4 p-4 bg-white flex flex-col">
                {/* Body */}
                <div className="flex-grow flex items-center justify-center overflow-hidden mb-4">
                    {fileWithNoBG ? (
                        <div className="w-full h-full flex items-center justify-center bg-white shadow-inner">
                            <div className="relative w-full h-full max-h-[calc(100%-80px)]">
                                <Image
                                    src={fileWithNoBG}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    alt="תמונה ללא רקע"
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <CircularProgress />
                            <p className=" font-medium text-2xl text-black"> מסירים את הרקע בשבילך</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-end space-x-2 bg-white shadow-inner">
                    <button
                        disabled={fileWithNoBG == null}
                        onClick={handleAccept}
                        className="
                            text-white bg-gradient-to-r from-cyan-500 to-blue-500 m-3
                            hover:bg-gradient-to-bl focus:ring-4 focus:outline-none 
                            focus:ring-cyan-300 dark:focus:ring-cyan-800 
                            font-medium rounded-lg text-sm px-5 py-2.5 
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-300
                        "
                    >
                        אישור
                    </button>
                    <button

                        onClick={onClose}
                        className="
                            text-white bg-gradient-to-br from-green-400 to-blue-600 m-3
                            hover:bg-gradient-to-bl focus:ring-4 focus:outline-none 
                            focus:ring-green-200 dark:focus:ring-green-800 
                            font-medium rounded-lg text-sm px-5 py-2.5
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-300
                        "
                    >
                        ביטול
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;