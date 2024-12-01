"use client"
import React, { useState, FC } from 'react';
import Image from 'next/image'
import { cloudinaryUploud } from '@/app/services/image/saveToCloudinary';
import { IModalProps } from '@/app/types/props';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal: FC<IModalProps> = ({ isOpen, onClose, fileWithNoBG, setCloudinary }) => {
    if (!isOpen) return null;
    const [progressUploud, setProgressUploud] = useState(false)

    const handleAccept = async () => {
        setProgressUploud(true)
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
                            <div className="w-6 h-6 border-4 border-white border-t-cyan-500 rounded-full animate-spin"></div>
                            <p className=" font-medium text-2xl text-black"> מסירים את הרקע בשהילך</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-end space-x-2 bg-white shadow-inner">
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
                        {progressUploud ? (
                            // <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 border-4 border-white border-t-cyan-500 rounded-full animate-spin"></div>
                            // </div>
                        ) : (
                            'אישור'
                        )}
                    </button>
                    <button
                        disabled={progressUploud}
                        onClick={onClose}
                        className="
                            text-white bg-gradient-to-br from-green-400 to-blue-600 
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