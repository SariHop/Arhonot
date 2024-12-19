'use client';
import { create } from "zustand";
import IOutfit from "../types/IOutfit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type DayStore = {
    selectedDate: Date | null;
    allLooks: IOutfit[];
    selectedLooks: IOutfit[];
    openGalery: boolean;
    userId: string;
    setUserId: (userId: string) => void;
    toggleDrawer: (newOpen: boolean) => void;
    selectLook: (outfit: IOutfit) => void;
    setSelectedDate: (date: Date) => void;
    addOutfit: (outfit: IOutfit) => void;
    deleteOutfit: (outfit: IOutfit) => void;
    setOutfits: (outfits: IOutfit[]) => void;
    addToAllLooks: (outfits: IOutfit[]) => void;
    resetOutfits: () => void;
}

const useDay = create<DayStore>((set) => ({
    selectedDate: null,
    allLooks: [],
    selectedLooks: [],
    openGalery: false,
    userId: "",
    setUserId: (userId: string) => {
        set({
            userId: userId,
        });
    },

    toggleDrawer: (newOpen: boolean) => set({ openGalery: newOpen }),

    setSelectedDate: (date: Date) => {
        set({
            selectedDate: date,
            allLooks: [],
            selectedLooks: [],
        });
    },

    addOutfit: (outfit: IOutfit): void => {
        console.log(outfit);
        set((state) => {
            const exists = state.allLooks.some((item) => item._id === outfit._id);
            console.log(exists);

            if (!exists) {
                // אם ה-outfit לא קיים, מוסיף אותו למערך
                return {
                    allLooks: [...state.allLooks, outfit],
                    selectedLooks: [...state.selectedLooks, outfit]
                };
            }

            // אם ה-outfit כבר קיים, מחזירים את ה-state הקיים ללא שינוי
            toast("לוק זה כבר קיים ביום זה");
            return state;
        });
    },

    setOutfits: (outfits: IOutfit[]) => {
        set({ allLooks: outfits, selectedLooks: outfits });
    },

    deleteOutfit: (outfit: IOutfit) => {
        set((state) => ({
            allLooks: state.allLooks.filter((l) => l._id !== outfit._id),  // מסנן את הבגד לפי ה-ID
            looks: state.selectedLooks.filter((l) => l._id !== outfit._id)
        }));
    },

    addToAllLooks: (outfits: IOutfit[]) => {
        console.log("outfits for store: ", outfits);
        set((state) => {
            // יצירת סט של מזהים קיימים ב-allLooks
            const existingIds = new Set(state.allLooks.map((outfit) => outfit._id));

            // סינון אאוטפיטים שאינם קיימים ב-allLooks
            const newOutfits = outfits.filter((outfit) => !existingIds.has(outfit._id));

            // החזרת מצב מעודכן
            return {
                allLooks: [...state.allLooks, ...newOutfits],
            };
        })
    },

    resetOutfits: () => {
        set({
            allLooks: [],
            selectedLooks: []
        })
    },
    selectLook: (outfit: IOutfit) => {
        console.log(outfit);
        set((state) => {
            const exists = state.selectedLooks.some((item) => item._id === outfit._id);
            console.log(exists);
            if (exists) {
                return {
                    selectedLooks: state.selectedLooks.filter((item) => item._id !== outfit._id),
                };
            } else {
                // אם ה-outfit לא קיים, מוסיף אותו למערך
                return {
                    selectedLooks: [...state.selectedLooks, outfit],
                };
            }
        });
    },
}))

export default useDay;