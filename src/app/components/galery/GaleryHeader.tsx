"use client";
import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import FilterModal from "./FilterModal";

const GaleryHeader = () => {
    const [activeTab, setActiveTab] = useState<"garments" | "outfits">("garments");
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <nav className="bg-white text-gray-800 p-6 flex flex-col items-start w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-0 sm:gap-6 mb-4 sm:mb-0 sm:justify-between">       <div className="flex w-full sm:w-auto">
                <input
                    type="text"
                    placeholder="חיפוש..."
                    className="p-2 text-lg rounded-r-md w-full sm:w-64 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-10"
                />
                <button className="bg-gray-200 text-gray-800 p-2 rounded-l-md h-10">
                    <SearchOutlined className="h-5 w-5 text-gray-600" />
                </button>
            </div>
                <div className="flex justify-between w-full sm:w-auto">
                    <div className="flex gap-6 mt-6"> {/* השתמש ב-gap במקום space-x-6 */}

                        <button
                            className={`text-lg ${activeTab === "garments"
                                ? "border-b-2 border-gray-800"
                                : "border-b-2 border-transparent"
                                } pb-1 hover:border-b-2 hover:border-gray-400`}
                            onClick={() => setActiveTab("garments")}
                        >
                            בגדים
                        </button>
                        <button
                            className={`text-lg ${activeTab === "outfits"
                                ? "border-b-2 border-gray-800"
                                : "border-b-2 border-transparent"
                                } pb-1 hover:border-b-2 hover:border-gray-400`}
                            onClick={() => setActiveTab("outfits")}
                        >
                            לוקים
                        </button>
                    </div>
                    {/* כפתור סינונים */}
                    <button
                        className="bg-gray-200 text-gray-800 sm:mx-6 p-2 rounded-md mt-4"
                        onClick={() => setIsModalVisible(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* פופ-אפ של סינונים */}
            <FilterModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </nav>
    );
};

export default GaleryHeader;
