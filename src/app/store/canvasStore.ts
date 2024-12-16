import { create } from 'zustand';
import { fabric } from "fabric";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IOutfit from '../types/IOutfit';

type CanvasStore = {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  garments: string[];
  addGarment: (garmentId: string) => void,
  setGarments: (newGarments: string[]) => void
  editOutfit: IOutfit | null,
  setEditOutfit: (outfit: IOutfit | null) => void;
  loadImage: (garmentURL: string) => Promise<void>; 
  addImageToCanvasFromGallery: (imageUrl: string, garmentId: string | unknown) => Promise<void>;
};

const useCanvasStore = create<CanvasStore>((set, get) => ({
  canvas: null,
  setCanvas: (canvas: fabric.Canvas) => set({ canvas }),
  garments: [],
  addGarment: (garmentId) => {
    if (!get().garments.includes(garmentId)) {
      set((state) => ({ garments: [...state.garments, garmentId] }));
    }
  },
  setGarments: (newGarments: string[]) => set({ garments: newGarments }),
  editOutfit: null,
  setEditOutfit: (outfit: IOutfit | null) => set({ editOutfit: outfit }),
  loadImage: async (garmentURL: string) => {
    const canvas = get().canvas;
    if (!canvas) return;

    // הגדרת תמיכה ב-CORS
    const img = await fabric.Image.fromURL(
        garmentURL,
        (img) => {
            // שינוי תכונות התמונה לפי הצורך
            img.set({
                left: 50, // מיקום X
                top: 50, // מיקום Y
                scaleX: 0.5, // שינוי גודל התמונה בציר X
                scaleY: 0.5, // שינוי גודל התמונה בציר Y
            });

            // הוספת התמונה לקנבס
            canvas.add(img);

            // אופציונלי: הצגת התמונה במצב "נבחר"
            canvas.setActiveObject(img);
        },
        { crossOrigin: "anonymous" } // הוספת תמיכה ב-CORS
    );

    canvas.requestRenderAll();
},

  addImageToCanvasFromGallery: async (garmentURL: string, garmentId: string | unknown) => {

    const canvas = get().canvas;
    if (!canvas || typeof garmentId !== 'string') {
      return;
    }

    if (get().garments.includes(garmentId)) {
      toast.info("הבגד כבר נוסף ללוק בהצלחה!");
      return;
    }

    try {
      await get().loadImage(garmentURL)
      get().addGarment(garmentId);

    } catch (error) {
      console.error("Failed to load image:", error);
    }

  },

}));


export default useCanvasStore;
