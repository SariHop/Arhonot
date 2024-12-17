import { create } from "zustand";
// import { persist } from "zustand/middleware";
import { fabric } from "fabric";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IOutfit from "../types/IOutfit";

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
  // הוספת בגד לקנבס
  loadImage: (garmentURL: string, garmentId: string) => Promise<void>;
  // הוספת בגד ללוק מהגלריה
  addImageToCanvasFromGallery: (garmentURL: string, garmentId: string | unknown) => Promise<void>;
};

const useCanvasStore = create<CanvasStore>()(
  // persist(
    (set, get) => ({
      canvas: null,
      setCanvas: (canvas: fabric.Canvas) => set({ canvas }),

      garments: [],
      addGarment: (garmentId: string) => {
        if (!get().garments.includes(garmentId)) {
          set((state) => ({ garments: [...state.garments, garmentId] }));
        }
      },
      deleteGarment: (garmentId: string) => {
        set((state) => ({
          garments: state.garments.filter((id) => id !== garmentId),
        }));
      },
      setGarments: (newGarments: string[]) => set({ garments: newGarments }),

      selectedObject: null,
      setSelectedObject: (obj: fabric.Object | null) => {
        set({ selectedObject: obj });
      },

      editOutfit: null,
      setEditOutfit: (outfit: IOutfit | null) => set({ editOutfit: outfit }),

      loadImage: async (garmentURL: string, garmentId: string) => {
        const canvas = get().canvas;
        if (!canvas) return;

        const img = await fabric.Image.fromURL(
          garmentURL,
          (img) => {
            img.set({
              left: 50,
              top: 50,
              scaleX: 0.5,
              scaleY: 0.5,
            });
            img.set({ data: { garmentId } });
            canvas.add(img);
            canvas.setActiveObject(img);
          },
          { crossOrigin: "anonymous" }
        );
        canvas.requestRenderAll();
      },

      addImageToCanvasFromGallery: async (
        garmentURL: string,
        garmentId: string | unknown
      ) => {
        const canvas = get().canvas;
        if (!canvas || typeof garmentId !== "string") {
          return;
        }

        if (get().garments.includes(garmentId)) {
          toast.info("הבגד כבר נוסף ללוק בהצלחה!");
          return;
        }

        try {
          await get().loadImage(garmentURL, garmentId);
          get().addGarment(garmentId);
        } catch (error) {
          console.error("Failed to load image:", error);
        }
      },
    }),
    // {
    //   name: "canvas-store", 
    //   partialize: (state) => ({
    //     garments: state.garments,
    //     editOutfit: state.editOutfit,
    //     canvasJSON: state.canvas?.toJSON()
    //   }),
    // }
  // )
);

export default useCanvasStore;
