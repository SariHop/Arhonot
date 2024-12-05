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
        const matchesColor = filters.selectedColors.length === 0 || filters.selectedColors.includes(garment.color);
        const matchesCategory = !filters.selectedCategory || garment.category === filters.selectedCategory;
        const matchesSeason = !filters.selectedSeason || garment.season === filters.selectedSeason;
        const matchesRange = garment.range >= filters.selectedRange; // Assuming temperature is a property
        const matchesTags = filters.selectedTags.length === 0 || filters.selectedTags.some((tag) => garment.tags.includes(tag));

        return matchesColor && matchesCategory && matchesSeason && matchesRange && matchesTags;
    });
}
export default useGarments;
