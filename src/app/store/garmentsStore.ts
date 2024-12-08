import { create } from "zustand";
import IGarment from "../types/IGarment";

type GarmentsStore = {
    garments: IGarment[];
    sortedGarments: IGarment[];
    selectedColors: string[];
    selectedCategory: string | undefined;
    selectedSeason: string | undefined;
    selectedRange: number;
    selectedTags: string[];

    addGarment: (garment: IGarment) => void;
    setGarments: (garments: IGarment[]) => void;
    deleteGarment: (garment: IGarment) => void;
    resetGarments: () => void;

    setSelectedColors: (colors: string[]) => void;
    setSelectedCategory: (category: string | undefined) => void;
    setSelectedSeason: (season: string | undefined) => void;
    setSelectedRange: (range: number) => void;
    setSelectedTags: (tags: string[]) => void;
};

const useGarments = create<GarmentsStore>((set) => ({
    garments: [],
    sortedGarments: [],
    selectedColors: [],
    selectedCategory: undefined,
    selectedSeason: undefined,
    selectedRange: 1,
    selectedTags: [],

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
    resetGarments: () => {
        set({
            garments: [],
            sortedGarments: [],
        });
    },
    setSelectedColors: (colors) => {
        set((state) => ({
            selectedColors: colors,
            sortedGarments: filterGarments(state.garments, { ...state, selectedColors: colors }),
        }));
    },
    setSelectedCategory: (category) => {
        set((state) => ({
            selectedCategory: category,
            sortedGarments: filterGarments(state.garments, { ...state, selectedCategory: category }),
        }));
    },
    setSelectedSeason: (season) => {
        set((state) => ({
            selectedSeason: season,
            sortedGarments: filterGarments(state.garments, { ...state, selectedSeason: season }),
        }));
    },
    setSelectedRange: (range) => {
        set((state) => ({
            selectedRange: range,
            sortedGarments: filterGarments(state.garments, { ...state, selectedRange: range }),
        }));
    },
    setSelectedTags: (tags) => {
        set((state) => ({
            selectedTags: tags,
            sortedGarments: filterGarments(state.garments, { ...state, selectedTags: tags }),
        }));
    },
}));
// פונקציה לסינון הבגדים
function filterGarments(
    garments: IGarment[],
    filters: {
        selectedColors: string[];
        selectedCategory: string | undefined;
        selectedSeason: string | undefined;
        selectedRange: number;
        selectedTags: string[];
    }
): IGarment[] {
    return garments.filter((garment) => {
        const matchesColor =
            filters.selectedColors.length === 0 ||
            (garment.color && filters.selectedColors.includes(getClosestColor(garment.color) ?? ""));
        const matchesCategory = !filters.selectedCategory || garment.category === filters.selectedCategory;
        const matchesSeason = !filters.selectedSeason || garment.season === filters.selectedSeason;
        const matchesRange = garment.range >= filters.selectedRange; // Assuming temperature is a property
        const matchesTags = filters.selectedTags.length === 0 || filters.selectedTags.some((tag) => garment.tags.includes(tag));

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
    purple: "#8B5CF6"    // bg-purple-500
};
function getClosestColor(garmentColor: string | null): string | null {
    if (!garmentColor) {
        return null;
    }
    const garmentRgb = hexToRgb(garmentColor);
    let closestColor = null;
    let minDistance = Infinity;

    // לולאה על כל הצבעים ברשימה
    for (const [name, hex] of Object.entries(colorHexMap)) {
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

export default useGarments;
