import { create } from "zustand";
import IGarment from "../types/IGarment";

type GarmentsStore = {
    garments: IGarment[];  // מערך בגדים
    addGarment: (garment: IGarment) => void;
    setGarments: (garments: IGarment[]) => void;
    deleteGarment: (garment: IGarment) => void;
    resetGarments: () => void;
};

const useGarments = create<GarmentsStore>((set) => ({
    garments: [],
    addGarment: (garment: IGarment): void => {
        // נוסיף את הבגד למערך garments בצורה בלתי משתנה
        set((state) => ({
            garments: [...state.garments, garment]  // יוצר מערך חדש עם הבגד החדש
        }));
    },
    setGarments: (garments: IGarment[]) => {
        set({ garments });
    },
    deleteGarment: (garment: IGarment) => {
        set((state) => ({
            garments: state.garments.filter((g) => g._id !== garment._id)  // מסנן את הבגד לפי ה-ID
        }));
    },
    resetGarments: () => {
        set({
            garments: [],
        })
    },
}));

export default useGarments;
