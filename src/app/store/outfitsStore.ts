import { create } from "zustand";
import IOutfit from "../types/IOutfit";

type OutfitsStore = {
    outfits: IOutfit[];  // מערך בגדים
    addOutfits: (outfit: IOutfit) => void;
    setOutfits: (outfits: IOutfit[]) => void;
    deleteOutfits: (outfit: IOutfit) => void;
    resetOutfits: () => void;
};

const useOutfits = create<OutfitsStore>((set) => ({
    outfits: [],
    addOutfits: (outfit: IOutfit): void => {
        set((state) => ({
            outfits: [...state.outfits, outfit]
        }));
    },
    setOutfits: (outfits: IOutfit[]) => {
        set({ outfits });
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
}));

export default useOutfits;
