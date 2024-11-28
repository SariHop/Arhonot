"use client"
import React, { FC } from 'react';
import Image from 'next/image'
import { cloudinaryUploud } from '@/app/services/image/saveToCloudinary';
import { IModalProps } from '@/app/types/props';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal: FC<IModalProps> = ({ isOpen, onClose, fileWithNoBG, setCloudinary }) => {
    if (!isOpen) return null;

    const handleAccept = async () => {
        // להציג עיגול מסתובב על הכפתור
        // להוסיף בלוק של טריי וקץ
        if (fileWithNoBG != null) {
            const data = await cloudinaryUploud(fileWithNoBG)
            if (!data.imageUrl) { toast.error("שגיאה בשמירת התמונה. נסה שנית!") }
            setCloudinary(data.imageUrl)
        }
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-2xl p-4 bg-white rounded-lg shadow">
                <ToastContainer />
                {/* Body */}
                <div className="p-4 md:p-5 space-y-4">
                    {fileWithNoBG ?
                        <Image
                            src={fileWithNoBG}
                            height={0}
                            width={0}
                            style={{ width: '120px', height: "auto" }}
                            alt="Picture of the author"
                        /> :
                        <p>מסירים בשבילך את הרקע...</p>}
                </div>

                {/* Footer */}
                <div className="p-4 border-t">
                    <div className="flex justify-end">
                        <button
                            disabled={fileWithNoBG == null}
                            onClick={handleAccept}
                            className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            אישור
                        </button>
                        <button
                            onClick={onClose}
                            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            ביטול
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
