import { create } from "zustand";
import IOutfit from "../types/IOutfit";

type OutfitsStore = {
    outfits: IOutfit[];  // מערך בגדים
    sortedOutfits: IOutfit[];
    outfitSelectedRate: number | undefined;
    outfitSelectedSeason: string | undefined;
    outfitSelectedTags: string[];
    outfitSearchContent: string;
    outfitSelectedRange: number | undefined;

    addOutfits: (outfit: IOutfit) => void;
    setOutfits: (outfits: IOutfit[]) => void;
    deleteOutfits: (outfit: IOutfit) => void;
    resetOutfits: () => void;
    setOutfitSelectedRate: (rate: number | undefined) => void
    setOutfitSelectedSeason: (season: string | undefined) => void;
    setOutfitSelectedRange: (range: number | undefined) => void;
    setOutfitSelectedTags: (tags: string[]) => void;
    setOutfitSearchContent: (contant: string) => void;
    outfitStartFilter: (
        outfitSelectedRate: number | undefined,
        outfitSelectedSeason: string | undefined,
        outfitSelectedRange: number | undefined,
        outfitSelectedTags: string[]
    ) => void;
};

const useOutfits = create<OutfitsStore>((set) => ({
    outfits: [],
    sortedOutfits: [],
    outfitSelectedRate: undefined,
    outfitSelectedSeason: undefined,
    outfitSelectedRange: 1,
    outfitSelectedTags: [],
    outfitSearchContent: "",
    addOutfits: (outfit: IOutfit): void => {
        set((state) => ({
            outfits: [...state.outfits, outfit]
        }));
    },
    setOutfits: (outfits: IOutfit[]) => {
        set({ outfits: outfits, sortedOutfits: outfits });
    },

    deleteOutfits: (outfit: IOutfit) => {
        set((state) => ({
            outfits: state.outfits.filter((o) => o._id !== outfit._id)  // מסנן את הבגד לפי ה-ID
        }));
    },
    resetOutfits: () => {
        set({
            outfits: [],
        })
    },

    setOutfitSelectedRate: (rate) => {
        set((state) => ({
            ...state, // שומר על שאר ה-state
            outfitSelectedRate: rate, // מעדכן רק את selectedColors
        }));
    },

    setOutfitSelectedSeason: (season) => {
        set((state) => ({
            ...state,
            outfitSelectedSeason: season,
        }));
    },
    setOutfitSelectedRange: (range) => {
        set((state) => ({
            ...state,
            outfitSelectedRange: range,
        }));
    },
    setOutfitSelectedTags: (tags) => {
        set((state) => ({
            ...state,
            outfitSelectedTags: tags,
        }));
    },
    setOutfitSearchContent: (contant) => {
        // const searchLowerCase = contant.toLowerCase();
        set((state) => {
            const filteredOutfits = filterOutfits(state.outfits, { ...state })
                .filter(outfit => {
                    return (
                        outfit.desc.toLowerCase().includes(contant) ||
                        (outfit.season && outfit.season.toLowerCase().includes(contant)) ||
                        outfit.tags.some(tag => tag.toLowerCase().includes(contant))
                    );
                });

            // עדכון ה-state עם הערכים המפולטרים
            return {
                outfitSearchContent: contant,
                sortedOutfits: filteredOutfits,
            };
        });
    },
    outfitStartFilter: () => {
        set((state) => ({
            sortedOutfits: filterOutfits(state.outfits, {
                outfitSelectedRate: state.outfitSelectedRate,
                outfitSelectedSeason: state.outfitSelectedSeason,
                outfitSelectedRange: state.outfitSelectedRange,
                outfitSelectedTags: state.outfitSelectedTags,
            }),
        }));
    },
}));

function filterOutfits(
    outfits: IOutfit[],
    filters: {
        outfitSelectedRate: number | undefined,
        outfitSelectedSeason: string | undefined,
        outfitSelectedRange: number | undefined,
        outfitSelectedTags: string[]
    }
): IOutfit[] {
    return outfits.filter((outfit) => {
        const matchesRate = !filters.outfitSelectedRate || outfit.favorite === filters.outfitSelectedRate;
        const matchesSeason = !filters.outfitSelectedSeason || outfit.season === filters.outfitSelectedSeason;
        const matchesRange = filters.outfitSelectedRange !== undefined
            ? outfit.rangeWheather >= filters.outfitSelectedRange
            : true;
        const matchesTags = filters.outfitSelectedTags.length === 0 || filters.outfitSelectedTags.some((tag) => outfit.tags.includes(tag));

        return matchesRate && matchesSeason && matchesRange && matchesTags;
    });
}

export default useOutfits;
