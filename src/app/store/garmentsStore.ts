'use client';
import { create } from "zustand";
import IGarment from "../types/IGarment";

type GarmentsStore = {
    garments: IGarment[];
    sortedGarments: IGarment[];
    garmentSelectedColors: string[];
    garmentSelectedCategory: string | undefined;
    garmentSelectedSeason: string | undefined;
    garmentSelectedRange: number;
    garmentSelectedTags: string[];
    garmentSearchContent: string;

    addGarment: (garment: IGarment) => void;
    setGarments: (garments: IGarment[]) => void;
    deleteGarment: (garment: IGarment) => void;
    resetGarments: () => void;
    updateGarment:(garment:IGarment) => void;

    setGarmentSelectedColors: (colors: string[]) => void;
    setGarmentSelectedCategory: (category: string | undefined) => void;
    setGarmentSelectedSeason: (season: string | undefined) => void;
    setGarmentSelectedRange: (range: number) => void;
    setGarmentSelectedTags: (tags: string[]) => void;
    setGarmentSearchContent: (contant: string) => void;

    garmentsStartFilter: (
        garmentSelectedColors: string[],
        garmentSelectedCategory: string | undefined,
        garmentSelectedSeason: string | undefined,
        garmentSelectedRange: number,
        garmentSelectedTags: string[]
    ) => void;
};

const useGarments = create<GarmentsStore>((set) => ({
    garments: [],
    sortedGarments: [],
    garmentSelectedColors: [],
    garmentSelectedCategory: undefined,
    garmentSelectedSeason: undefined,
    garmentSelectedRange: 1,
    garmentSelectedTags: [],
    garmentSearchContent: "",

    addGarment: (garment: IGarment) => {
        set((state) => {
            const newGarments = [...state.sortedGarments, garment];
            return {
                garments: [...state.garments, garment],
                sortedGarments: filterGarments(newGarments, state),
            };
        });
    },
    setGarments: (garments: IGarment[]) => {
        set((state) => ({
            garments,
            sortedGarments: filterGarments(garments, state),
        }));
    },
    deleteGarment: (garment: IGarment) => {
        set((state) => {
            const updatedGarments = state.garments.filter((g) => g._id !== garment._id);
            return {
                garments: updatedGarments,
                sortedGarments: filterGarments(updatedGarments, state),
            };
        });
    },
    updateGarment: (garment: IGarment) => {
        set((state) => {
            const updatedGarments = state.garments.map((g) =>
                g._id === garment._id ? garment : g
            );
            return {
                garments: updatedGarments,
                sortedGarments: filterGarments(updatedGarments, state),
            };
        });
    },
    resetGarments: () => {
        set({
            garments: [],
            sortedGarments: [],
        });
    },
    setGarmentSelectedColors: (colors) => {
        set((state) => ({
            ...state, // שומר על שאר ה-state
            garmentSelectedColors: colors, // מעדכן רק את selectedColors
        }));
    },

    setGarmentSelectedCategory: (category) => {
        set((state) => ({
            ...state,
            garmentSelectedCategory: category,
        }));
    },
    setGarmentSelectedSeason: (season) => {
        set((state) => ({
            ...state,
            garmentSelectedSeason: season,
        }));
    },
    setGarmentSelectedRange: (range) => {
        set((state) => ({
            ...state,
            garmentSelectedRange: range,
        }));
    },
    setGarmentSelectedTags: (tags) => {
        set((state) => ({
            ...state,
            garmentSelectedTags: tags,
        }));
    },

    setGarmentSearchContent: (contant) => {
        // const searchLowerCase = contant.toLowerCase();
        set((state) => {
            const filteredGarments = filterGarments(state.garments, { ...state })
            const searchFilteredGarments = filterGarmentsByContent(filteredGarments, contant);
            // עדכון ה-state עם הערכים המפולטרים
            return {
                garmentSearchContent: contant,
                sortedGarments: searchFilteredGarments,
            };
        });
    },

    garmentsStartFilter: () => {
        set((state) => {
            const filteredGarments = filterGarments(state.garments, state);
            const searchFilteredGarments = filterGarmentsByContent(filteredGarments, state.garmentSearchContent);
            return {
                sortedGarments: searchFilteredGarments,
            };
        });
    }

}));
// פונקציה לסינון הבגדים
function filterGarments(
    garments: IGarment[],
    filters: {
        garmentSelectedColors: string[];
        garmentSelectedCategory: string | undefined;
        garmentSelectedSeason: string | undefined;
        garmentSelectedRange: number;
        garmentSelectedTags: string[];
    }
): IGarment[] {
    return garments.filter((garment) => {
        const matchesColor =
            filters.garmentSelectedColors.length === 0 ||
            (garment.color
                ? filters.garmentSelectedColors.includes(getClosestColor(garment.color) ?? "")
                : filters.garmentSelectedColors.includes("transparent"));
        const matchesCategory = !filters.garmentSelectedCategory || garment.category === filters.garmentSelectedCategory;
        const matchesSeason = !filters.garmentSelectedSeason || garment.season === filters.garmentSelectedSeason;
        const matchesRange = garment.range >= filters.garmentSelectedRange; // Assuming temperature is a property
        const matchesTags = filters.garmentSelectedTags.length === 0 || filters.garmentSelectedTags.some((tag) => garment.tags.includes(tag));

        return matchesColor && matchesCategory && matchesSeason && matchesRange && matchesTags;
    });
}
function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}
function colorDistance(c1: { r: number, g: number, b: number }, c2: { r: number, g: number, b: number }) {
    const rDiff = c1.r - c2.r;
    const gDiff = c1.g - c2.g;
    const bDiff = c1.b - c2.b;
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}
const colorHexMap: { [key: string]: string } = {
    red: "#EF4444",      // bg-red-600
    blue: "#60A5FA",     // bg-blue-400
    green: "#10B981",    // bg-green-500
    yellow: "#F59E0B",   // bg-yellow-400
    black: "#000000",    // bg-black
    white: "#FFFFFF",    // bg-white
    orange: "#F97316",   // bg-orange-500
    pink: "#EC4899",     // bg-pink-500
    gray: "#6B7280",     // bg-gray-500
    purple: "#8B5CF6",    // bg-purple-500
    transparent: ""
};
function getClosestColor(garmentColor: string | null): string | null {
    if (!garmentColor) {
        return "transparent";
    }
    const garmentRgb = hexToRgb(garmentColor);
    let closestColor = "transparent";
    let minDistance = Infinity;

    // לולאה על כל הצבעים ברשימה
    for (const [name, hex] of Object.entries(colorHexMap)) {
        if (!hex) {
            continue; // דלג על צבעים ללא hex (כמו transparent)
        }
        const colorRgb = hexToRgb(hex);
        const distance = colorDistance(garmentRgb, colorRgb);

        // עדכון הצבע הקרוב ביותר
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = name;
        }
    }

    return closestColor;
}

function filterGarmentsByContent(outfits: IGarment[], content: string): IGarment[] {
    return outfits.filter(outfit => {
        return (
            outfit.desc.toLowerCase().includes(content) ||
            (outfit.season && outfit.season.toLowerCase().includes(content)) ||
            outfit.tags.some((tag: string) => tag.toLowerCase().includes(content))
        );
    });
}
export default useGarments;
