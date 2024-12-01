"use client"
import React, { FC } from 'react';
import Image from 'next/image'
import { cloudinaryUploud } from '@/app/services/image/saveToCloudinary';
import { IModalProps } from '@/app/types/props';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal: FC<IModalProps> = ({ isOpen, onClose, fileWithNoBG, setCloudinary }) => {
    if (!isOpen) return null;

    const handleAccept = async () => {
        // מכאן לשנות את עיצוב של הכפתור אן של העמוד
        // שייראה שהשמירה ניטענת
        if (fileWithNoBG != null) {
            try {
                const data = await cloudinaryUploud(fileWithNoBG);
                if (!data.imageUrl) {
                    toast.error("שגיאה בשמירת התמונה. נסה שנית!");
                } else {
                    setCloudinary(data.imageUrl);
                }
            } catch (error) {
                toast.error("שגיאה בשמירת התמונה. נסה שנית!");
                console.error(error)
            }
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full h-full md:max-w-2xl md:h-auto p-4 bg-white rounded-lg shadow overflow-auto">
             
                {/* Body */}
                <div className="p-4 md:p-5 space-y-4 text-center h-64 flex items-center justify-center">
                    {fileWithNoBG ? (
                        <div className="relative w-full max-w-[120px] aspect-square">
                            {/* התמונה חייבת להיות גדולה יותר ולמלא את הקונטיינר יפה */}
                            <Image
                                src={fileWithNoBG}
                                fill
                                style={{ objectFit: 'contain' }}
                                alt="תמונה ללא רקע"
                                className="rounded-lg"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="animate-spin w-10 h-10 border-4 border-t-4 border-blue-500 rounded-full"></div>
                            {/* !שיסתובב */}
                            <p className="text-gray-600 font-medium">מסירים בשבילך את הרקע...</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-end space-x-2">
                    <button
                        disabled={fileWithNoBG == null}
                        onClick={handleAccept}
                        className="
                            text-white bg-gradient-to-r from-cyan-500 to-blue-500 
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
                            text-white bg-gradient-to-br from-green-400 to-blue-600 
                            hover:bg-gradient-to-bl focus:ring-4 focus:outline-none 
                            focus:ring-green-200 dark:focus:ring-green-800 
                            font-medium rounded-lg text-sm px-5 py-2.5
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