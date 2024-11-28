"use client"
import React, { FC } from 'react';
import Image from 'next/image'
import { cloudinaryUploud } from '@/app/services/image/saveToCloudinary';

// תיקיה
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    setCloudinary: (url: string) => void
    fileWithNoBG: string | null
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, fileWithNoBG, setCloudinary }) => {
    if (!isOpen) return null;

    const handleAccept = async () => {
        // להציג עיגול מסתובב על הכפתור
        console.log("cccccccccccccccccccccccccccccccccc")
        if (fileWithNoBG != null) {
            const data = await cloudinaryUploud(fileWithNoBG)
            console.log("התשובה שהמודל קיבל", data)
            // Jייב בדיקה שהתשובה לא NUךך ושגיאה
             setCloudinary(data.imageUrl)
        }
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-2xl p-4 bg-white rounded-lg shadow dark:bg-gray-700">

                {/* Body */}
                <div className="p-4 md:p-5 space-y-4">
                    {fileWithNoBG ?
                        <Image
                            src={fileWithNoBG}
                            height={0}
                            width={0}
                            style={{width:'120px', height: "auto" }}
                            alt="Picture of the author"
                        /> :
                        <p>procecing</p>}
                </div>

                {/* Footer */}
                <div className="p-4 border-t dark:border-gray-600">
                    <div className="flex justify-end">
                        <button
                            disabled={fileWithNoBG == null}
                            onClick={handleAccept}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            אישור
                        </button>
                        <button
                            onClick={onClose}
                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
