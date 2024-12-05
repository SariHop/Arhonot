import React, { useState } from "react";
import { Modal, Slider, Tag } from "antd";
import { IFilterModalProps } from "@/app/types/IGarment";
import useGarments from '../../store/garmentsStore';

const FilterModal: React.FC<IFilterModalProps> = ({ visible, onClose }) => {
    const { selectedColors, selectedCategory, selectedSeason, selectedRange, selectedTags, setSelectedColors, setSelectedCategory, setSelectedSeason, setSelectedRange, setSelectedTags } = useGarments();
    const categories = ["Shirts", "Pants", "Dresses"];
    const seasons = ["Winter", "Spring", "Summer", "Fall"];
    const tags = ["Casual", "Formal", "Sporty", "Vintage"];
    const colors = [
        { bg: "bg-red-600", name: "red" },
        { bg: "bg-blue-400", name: "blue" },
        { bg: "bg-green-500", name: "green" },
        { bg: "bg-yellow-400", name: "yellow" },
        { bg: "bg-black", name: "black" },
        { bg: "bg-white", name: "white" },
        { bg: "bg-orange-500", name: "orange" },
        { bg: "bg-pink-500", name: "pink" },
        { bg: "bg-gray-500", name: "gray" },
        { bg: "bg-purple-500", name: "purple" }
    ];

    const [localSelectedColors, setLocalSelectedColors] = useState<string[]>(selectedColors);
    const [localselectedCategory, setLocalSelectedCategory] = useState<string | undefined>(selectedCategory);
    const [localselectedSeason, setLocalSelectedSeason] = useState<string | undefined>(selectedSeason);
    const [localselectedRange, setLocalSelectedRange] = useState<number>(selectedRange);
    const [localselectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags);

    const onFilter = () => {
        setSelectedCategory(localselectedCategory);
        setSelectedColors(localSelectedColors);
        setSelectedSeason(localselectedSeason);
        setSelectedRange(localselectedRange);
        setSelectedTags(localselectedTags);
    }

    return (
        <Modal
            title="סינונים"
            visible={visible}
            onOk={onClose}
            onCancel={onClose}
            footer={null}
            className="px-1"
        >
            <div className="space-y-4 px-3">
                {/* צבע */}
                <div>
                    <h3 className="text-lg mb-3">בחר צבע</h3>
                    <div className="flex gap-2 flex-wrap">
                        {colors.map(({ bg, name }) => (
                            <div
                                key={name}
                                onClick={() => {
                                    setLocalSelectedColors((prevColors) =>
                                        prevColors.includes(name)
                                            ? prevColors.filter((c) => c !== name)
                                            : [...prevColors, name]
                                    );
                                }}
                                className={`w-7 h-7 rounded-full cursor-pointer border-2 transition ${bg} ${localSelectedColors.includes(name) ? "border-blue-500" : "border-gray-300"}`}
                            />
                        ))}
                    </div>
                </div>

                {/* קטגוריה */}
                <div>
                    <h3 className="text-lg mb-3">בחר קטגוריה</h3>
                    <div className="flex gap-4">
                        {categories.map((category) => (
                            <Tag
                                key={category}
                                color={localselectedCategory === category ? "blue" : "default"}
                                onClick={() =>
                                    setLocalSelectedCategory(
                                        localselectedCategory === category ? undefined : category
                                    )
                                }
                                className="cursor-pointer"
                            >
                                {category}
                            </Tag>
                        ))}
                    </div>
                </div>

                {/* עונה */}
                <div>
                    <h3 className="text-lg mb-3">בחר עונה</h3>
                    <div className="flex gap-4">
                        {seasons.map((season) => (
                            <Tag
                                key={season}
                                color={localselectedSeason === season ? "blue" : "default"}
                                onClick={() =>
                                    setLocalSelectedSeason(
                                        localselectedSeason === season ? undefined : season
                                    )
                                }
                                className="cursor-pointer"
                            >
                                {season}
                            </Tag>
                        ))}
                    </div>
                </div>

                {/* רמת חום */}
                <div>
                    <h3 className="text-lg mb-3">בחר רמת חום</h3>
                    <Slider
                        min={1}
                        max={7}
                        value={localselectedRange}
                        onChange={(value) => setLocalSelectedRange(value)}
                        className="w-full"
                    />
                </div>

                {/* תגיות */}
                <div>
                    <h3 className="text-lg mb-3">בחר תגיות</h3>
                    <div className="flex gap-2">
                        {tags.map((tag) => (
                            <Tag
                                key={tag}
                                color={localselectedTags.includes(tag) ? "blue" : "default"}
                                onClick={() => {
                                    if (localselectedTags.includes(tag)) {
                                        setLocalSelectedTags(localselectedTags.filter((t) => t !== tag));
                                    } else {
                                        setLocalSelectedTags([...localselectedTags, tag]);
                                    }
                                }}
                                className="cursor-pointer"
                            >
                                {tag}
                            </Tag>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-6 space-x-4 gap-5">
                <button
                    onClick={() => { console.log("Cancel clicked"); onClose() }}
                    className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-gray-300 transition-colors"
                >
                    ביטול
                </button>
                <button
                    onClick={() => { console.log("Confirm clicked"); onFilter(); onClose() }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    אישור
                </button>
            </div>
        </Modal >
    );
};

export default FilterModal;
