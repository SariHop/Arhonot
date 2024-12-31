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
    deleteOutfit: (outfit: IOutfit) => void;
    resetOutfits: () => void;
    updateOutfitS: (outfit: IOutfit) => void

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

    deleteOutfit: (outfit: IOutfit) => {
        set((state) => {
            const updatedOutfits = state.outfits.filter((o) => o._id !== outfit._id);
            return {
                outfits: updatedOutfits,
                sortedOutfits: filterOutfits(updatedOutfits, state),
            };
        });
    },
    resetOutfits: () => {
        set({
            outfits: [],
        })
    },
    updateOutfitS: (outfit: IOutfit) => {
        set((state) => {
            const updatedOutfits = state.outfits.map((g) =>
                g._id === outfit._id ? outfit : g
            );
            return {
                outfits: updatedOutfits,
                sortedOutfits: filterOutfits(updatedOutfits, state),
            };
        });
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

    setOutfitSearchContent: (content) => {
        set((state) => {
            const filteredOutfits = filterOutfits(state.outfits, state);
            const searchFilteredOutfits = filterOutfitsByContent(filteredOutfits, content);
            // עדכון ה-state עם הערכים המפולטרים
            return {
                outfitSearchContent: content,
                sortedOutfits: searchFilteredOutfits,
            };
        });
    },
    outfitStartFilter: () => {
        set((state) => {
            const filteredOutfits = filterOutfits(state.outfits, state);
            const searchFilteredOutfits = filterOutfitsByContent(filteredOutfits, state.outfitSearchContent); // משתמש ב-content מה-state
            return {
                ...state, // ודא שאתה משאיר את יתר ה-state ללא שינוי
                sortedOutfits: searchFilteredOutfits,
            };
        });
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

function filterOutfitsByContent(outfits: IOutfit[], content: string): IOutfit[] {
    return outfits.filter(outfit => {
        return (
            outfit.desc.toLowerCase().includes(content) ||
            (outfit.season && outfit.season.toLowerCase().includes(content)) ||
            outfit.tags.some((tag: string) => tag.toLowerCase().includes(content))
        );
    });
}


export default useOutfits;
