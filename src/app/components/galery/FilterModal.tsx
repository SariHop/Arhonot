import React, { useState } from "react";
import { Modal, Slider, Tag, Rate } from "antd";
import { IFilterModalProps } from "@/app/types/IGarment";
import useGarments from '../../store/garmentsStore';
import useOutfit from '../../store/outfitsStore';

const FilterModal: React.FC<IFilterModalProps> = ({ visible, onClose, activeTab }) => {
    const { garmentSelectedColors, garmentSelectedCategory, garmentSelectedSeason, garmentSelectedRange, garmentSelectedTags, setGarmentSelectedColors, setGarmentSelectedCategory, setGarmentSelectedSeason, setGarmentSelectedRange, setGarmentSelectedTags, garmentsStartFilter } = useGarments();
    const { outfitSelectedRate, outfitSelectedSeason, outfitSelectedTags, outfitSelectedRange, setOutfitSelectedRate, setOutfitSelectedSeason, setOutfitSelectedRange, setOutfitSelectedTags, outfitStartFilter } = useOutfit();
    const [localOutfitSelectedSeason, setOutfitLocalSelectedSeason] = useState<string | undefined>(outfitSelectedSeason);
    const [localOutfitSelectedRange, setOutfitLocalSelectedRange] = useState<number | undefined>(outfitSelectedRange);
    const [localOutfitSelectedTags, setOutfitLocalSelectedTags] = useState<string[]>(outfitSelectedTags);
    const [localOutfitSelectedRate, setOutfitLocalSelectedRate] = useState<number | undefined>(outfitSelectedRate);

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
        { bg: "bg-purple-500", name: "purple" },
        { bg: "bg-transparent", name: "transparent" }
    ];

    const [localGarmentSelectedColors, setGarmentLocalSelectedColors] = useState<string[]>(garmentSelectedColors);
    const [localGarmentSelectedCategory, setGarmentLocalSelectedCategory] = useState<string | undefined>(garmentSelectedCategory);
    const [localGarmentSelectedSeason, setGarmentLocalSelectedSeason] = useState<string | undefined>(garmentSelectedSeason);
    const [localGarmentSelectedRange, setGarmentLocalSelectedRange] = useState<number>(garmentSelectedRange);
    const [localGarmentSelectedTags, setGarmentLocalSelectedTags] = useState<string[]>(garmentSelectedTags);

    const onFilter = () => {
        if (activeTab === "garments") {
            setGarmentSelectedCategory(localGarmentSelectedCategory);
            setGarmentSelectedColors(localGarmentSelectedColors);
            setGarmentSelectedSeason(localGarmentSelectedSeason);
            setGarmentSelectedRange(localGarmentSelectedRange);
            setGarmentSelectedTags(localGarmentSelectedTags);
            garmentsStartFilter(localGarmentSelectedColors, localGarmentSelectedCategory, localGarmentSelectedSeason, localGarmentSelectedRange, localGarmentSelectedTags);
        } else {
            setOutfitSelectedSeason(localOutfitSelectedSeason);
            setOutfitSelectedRange(localOutfitSelectedRange);
            setOutfitSelectedTags(localOutfitSelectedTags);
            setOutfitSelectedRate(localOutfitSelectedRate);
            outfitStartFilter(localOutfitSelectedRate, localOutfitSelectedSeason, localOutfitSelectedRange, localOutfitSelectedTags,);
        }
    }

    return (
        <Modal
            title="סינון בגדים"
            visible={visible}
            onOk={onClose}
            onCancel={onClose}
            footer={null}
            className="px-1"
        >
            <div className="space-y-4 px-3">
                {/* צבע */}
                {activeTab === "garments" &&
                    <div>
                        <h3 className="text-lg mb-3">בחר צבע</h3>
                        <div className="flex gap-2 flex-wrap">
                            {colors.map(({ bg, name }) => (
                                <div
                                    key={name}
                                    onClick={() => {
                                        const updatedColors = localGarmentSelectedColors.includes(name)
                                            ? localGarmentSelectedColors.filter((c) => c !== name)
                                            : [...localGarmentSelectedColors, name];

                                        setGarmentLocalSelectedColors(updatedColors);
                                    }}
                                    className={`w-7 h-7 rounded-full cursor-pointer border-2 transition ${bg} ${localGarmentSelectedColors.includes(name) ? "border-blue-500" : "border-gray-300"}`}
                                />
                            ))}
                        </div>

                    </div>
                }

                {/* קטגוריה */}
                {activeTab === "garments" &&
                    <div>
                        <h3 className="text-lg mb-3">בחר קטגוריה</h3>
                        <div className="flex gap-4">
                            {categories.map((category) => (
                                <Tag
                                    key={category}
                                    color={localGarmentSelectedCategory === category ? "blue" : "default"}
                                    onClick={() =>
                                        setGarmentLocalSelectedCategory(
                                            localGarmentSelectedCategory === category ? undefined : category
                                        )
                                    }
                                    className="cursor-pointer"
                                >
                                    {category}
                                </Tag>
                            ))}
                        </div>
                    </div>
                }

                {/* עונה */}
                <div>
                    <h3 className="text-lg mb-3">בחר עונה</h3>
                    <div className="flex gap-4">
                        {seasons.map((season) => (
                            <Tag
                                key={season}
                                color={localGarmentSelectedSeason === season ? "blue" : "default"}
                                onClick={() =>
                                    activeTab === "outfits" ?
                                        setGarmentLocalSelectedSeason(
                                            localGarmentSelectedSeason === season ? undefined : season
                                        )
                                        :
                                        setOutfitLocalSelectedSeason(
                                            localOutfitSelectedSeason === season ? undefined : season
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
                        value={activeTab === "outfits" ? localGarmentSelectedRange : localOutfitSelectedRange}
                        onChange={activeTab === "outfits" ? (value) => setGarmentLocalSelectedRange(value) : (value) => setOutfitLocalSelectedRange(value)}
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
                                color={localGarmentSelectedTags.includes(tag) ? "blue" : "default"}
                                onClick={() => {
                                    if (activeTab === "outfits") {
                                        if (localOutfitSelectedTags.includes(tag)) {
                                            setOutfitLocalSelectedTags(localOutfitSelectedTags.filter((t) => t !== tag));
                                        } else {
                                            setOutfitLocalSelectedTags([...localOutfitSelectedTags, tag]);
                                        }
                                    } else {
                                        if (localGarmentSelectedTags.includes(tag)) {
                                            setGarmentLocalSelectedTags(localGarmentSelectedTags.filter((t) => t !== tag));
                                        } else {
                                            setGarmentLocalSelectedTags([...localGarmentSelectedTags, tag]);
                                        }
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
            {/* רמת דירוג */}

            {activeTab === "outfits" &&
                <div>
                    <h3 className="text-lg mb-3">בחר רמת דירוג</h3>
                    <Rate
                        value={localOutfitSelectedRate}
                        onChange={(value) => setOutfitLocalSelectedRate(value)}
                        className="w-full"
                    />
                </div>
            }

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
