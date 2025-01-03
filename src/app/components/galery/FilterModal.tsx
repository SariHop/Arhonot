import React, { useState } from "react";
import { Slider, Tag, Rate } from "antd";
import { IFilterModalProps } from "@/app/types/IGarment";
import useGarments from '../../store/garmentsStore';
import useOutfit from '../../store/outfitsStore';
import { tags, validSeasons, typeCategories } from '../../data/staticArrays'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent } from "@mui/material";



const FilterModal: React.FC<IFilterModalProps> = ({ visible, onClose, activeTab }) => {
    const { garmentSelectedColors, garmentSelectedCategory, garmentSelectedSeason, garmentSelectedRange, garmentSelectedTags, setGarmentSelectedColors, setGarmentSelectedCategory, setGarmentSelectedSeason, setGarmentSelectedRange, setGarmentSelectedTags, garmentsStartFilter } = useGarments();
    const { outfitSelectedRate, outfitSelectedSeason, outfitSelectedTags, outfitSelectedRange, setOutfitSelectedRate, setOutfitSelectedSeason, setOutfitSelectedRange, setOutfitSelectedTags, outfitStartFilter } = useOutfit();
    const [localOutfitSelectedSeason, setOutfitLocalSelectedSeason] = useState<string | undefined>(outfitSelectedSeason);
    const [localOutfitSelectedRange, setOutfitLocalSelectedRange] = useState<number | undefined>(outfitSelectedRange);
    const [localOutfitSelectedTags, setOutfitLocalSelectedTags] = useState<string[]>(outfitSelectedTags);
    const [localOutfitSelectedRate, setOutfitLocalSelectedRate] = useState<number | undefined>(outfitSelectedRate);


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
            debugger;
            garmentsStartFilter(localGarmentSelectedColors, localGarmentSelectedCategory, localGarmentSelectedSeason, localGarmentSelectedRange, localGarmentSelectedTags);
        } else {
            setOutfitSelectedSeason(localOutfitSelectedSeason);
            setOutfitSelectedRange(localOutfitSelectedRange);
            setOutfitSelectedTags(localOutfitSelectedTags);
            setOutfitSelectedRate(localOutfitSelectedRate);
            outfitStartFilter(localOutfitSelectedRate, localOutfitSelectedSeason, localOutfitSelectedRange, localOutfitSelectedTags);
        }
    }
    const onCleere = async () => {
        if (activeTab === "garments") {
            setGarmentLocalSelectedColors([]);
            setGarmentLocalSelectedCategory('');
            setGarmentLocalSelectedSeason('');
            setGarmentLocalSelectedRange(1);
            setGarmentLocalSelectedTags([]);
            setGarmentSelectedColors([]);
            setGarmentSelectedCategory('');
            setGarmentSelectedSeason('');
            setGarmentSelectedRange(1);
            setGarmentSelectedTags([]);
            garmentsStartFilter([], '', '', 1, []);
        }
        else {
            setOutfitLocalSelectedSeason('');
            setOutfitLocalSelectedRange(undefined);
            setOutfitLocalSelectedTags([]);
            setOutfitLocalSelectedRate(undefined);
            setOutfitSelectedSeason('');
            setOutfitSelectedRange(undefined);
            setOutfitSelectedTags([]);
            setOutfitSelectedRate(undefined);
            outfitStartFilter(undefined, '', undefined, []);
        }
    }

    return (
        <Dialog
            open={visible}
            onClose={onClose}
        >

            <DialogTitle>{activeTab === "garments" ? " סינון בגדים" : "סינון לוקים"}</DialogTitle>
            <DialogContent>
                {/* צבע */}
                <div >

                    {/* צבע */}
                    {activeTab === "garments" &&
                        <div>
                            <h3 className="text-sm mb-3">בחר צבע/ים</h3>
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
                            <h3 className="text-sm my-3">בחר קטגוריה</h3>
                            <div className="flex gap-2 flex-wrap">
                                {typeCategories.map((category) => (
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
                        <h3 className="text-sm my-3">בחר עונה</h3>
                        <div className="flex gap-2 flex-wrap">
                            {validSeasons.map((season) => (
                                <Tag
                                    key={season}
                                    color={activeTab === "garments" ? localGarmentSelectedSeason === season ? "blue" : "default" : localOutfitSelectedSeason === season ? "blue" : "default"}
                                    onClick={() =>
                                        activeTab === "garments" ?
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

                    <div className="pl-3">
                        <h3 className="text-sm my-3">התאמה למזג אויר:</h3>
                        <div className="w-full">
                            {/* תוויות מעל הסליידר */}
                            <div className="flex justify-between text-xs mb-1">
                                <span>קר</span>
                                <span>חם</span>
                            </div>
                            {/* רכיב ה-Slider */}
                            <Slider
                                min={1}
                                max={7}
                                value={activeTab === "garments" ? localGarmentSelectedRange : localOutfitSelectedRange}
                                onChange={
                                    activeTab === "garments"
                                        ? (value) => setGarmentLocalSelectedRange(value)
                                        : (value) => setOutfitLocalSelectedRange(value)
                                }
                                className="w-full"
                            />
                        </div>
                    </div>



                    {/* תגיות */}
                    <div>
                        <h3 className="text-sm mb-3">בחר תגיות</h3>
                        <div className="flex gap-2 flex-wrap">
                            {tags.map((tag) => (
                                <Tag
                                    key={tag}
                                    color={
                                        activeTab === "outfits"
                                            ? (localOutfitSelectedTags.includes(tag) ? "blue" : "default")
                                            : (localGarmentSelectedTags.includes(tag) ? "blue" : "default")
                                    }
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
                {
                    activeTab === "outfits" &&
                    <div className="pt-3">
                        <h3 className="text-sm mb-3">בחר רמת דירוג</h3>
                        <Rate
                            value={localOutfitSelectedRate}
                            onChange={(value) => setOutfitLocalSelectedRate(value)}
                        // className="w-full"
                        />
                    </div>
                }

                <div className="flex flex-row-reverse gap-3 mt-6 px-4">
                    <button
                        onClick={() => { console.log("cleer clicked"); onCleere(); onClose(); }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-gray-300 transition-colors"
                    >
                        נקה בחירה
                    </button>
                    <button
                        onClick={() => { console.log("Cancel clicked"); onClose() }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-gray-300 transition-colors"
                    >
                        ביטול
                    </button>
                    <button
                        onClick={() => { console.log("Confirm clicked"); onFilter(); onClose() }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg  hover:bg-blue-600 transition-colors"
                    >
                        אישור
                    </button>

                </div>
            </DialogContent>
        </Dialog>

    );
};

export default FilterModal;
