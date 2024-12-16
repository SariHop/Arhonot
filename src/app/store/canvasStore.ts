import { create } from 'zustand';
import { fabric } from "fabric";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IOutfit from '../types/IOutfit';

type CanvasStore = {
  // קנבס
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  // מערך בגדים נבחרים
  garments: string[];
  addGarment: (garmentId: string) => void;
  deleteGarment: (garmentId: string) => void;
  setGarments: (newGarments: string[]) => void;
  // אובייקט נבחר בקנבס לעריכה
  selectedObject: fabric.Object | null;
  setSelectedObject: (obj: fabric.Object | null) => void;
  // אאוטפיט קיים פתוח לעריכה
  editOutfit: IOutfit | null;
  setEditOutfit: (outfit: IOutfit | null) => void;
  // טעינת תמונה לקנבס
  loadImage: (garmentURL: string, garmentId: string) => Promise<void>;
  // הוספת בגד ללוק מהגלריה
  addImageToCanvasFromGallery: (garmentURL: string, garmentId: string | unknown) => Promise<void>;
};

const useCanvasStore = create<CanvasStore>((set, get) => ({
  // קנבס
  canvas: null,
  setCanvas: (canvas: fabric.Canvas) => set({ canvas }),

  // מערך בגדים נבחרים
  garments: [],
  addGarment: (garmentId: string) => { if (!get().garments.includes(garmentId)) { set((state) => ({ garments: [...state.garments, garmentId] })); } },
  deleteGarment: (garmentId: string) => { set((state) => ({ garments: state.garments.filter((id) => id !== garmentId) })); },
  setGarments: (newGarments: string[]) => set({ garments: newGarments }),

  // אובייקט נבחר בקנבס לעריכה
  selectedObject: null,
  setSelectedObject: (obj: fabric.Object | null) => { set({ selectedObject: obj })},

  // אאוטפיט קיים פתוח לעריכה
  editOutfit: null,
  setEditOutfit: (outfit: IOutfit | null) => set({ editOutfit: outfit }),

  //טעינת תמונה לקנבס
  loadImage: async (garmentURL: string, garmentId: string) => {
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
        // הוספת ה-ID של הבגד כתכונה מותאמת אישית של התמונה
        img.set({ data: { garmentId } });
        canvas.add(img);
      },
      { crossOrigin: "anonymous" } // הוספת תמיכה ב-CORS
    );

    canvas.requestRenderAll();
  },

  // הוספת בגד ללוק מהגלריה
  addImageToCanvasFromGallery: async (garmentURL: string, garmentId: string | unknown) => {
    const canvas = get().canvas;
    if (!canvas || typeof garmentId !== 'string') {
      return;
    }

    // אם הבגד כבר קיים בלוק, הצגת הודעה
    if (get().garments.includes(garmentId)) {
      toast.info("הבגד כבר נוסף ללוק בהצלחה!");
      return;
    }

    try {
      // טוען את התמונה לקנבס ומוסיף את הבגד ללוק
      await get().loadImage(garmentURL, garmentId);
      get().addGarment(garmentId);
    } catch (error) {
      console.error("Failed to load image:", error);
    }
  },

}));

export default useCanvasStore;
