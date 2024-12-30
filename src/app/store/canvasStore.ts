import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fabric } from "fabric";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type CanvasStore = {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  OpenGallery: boolean,
  toggleOpenGallery: (flag: boolean) => void,
  garments: string[];
  addGarment: (garmentId: string) => void;
  deleteGarment: (garmentId: string) => void;
  setGarments: (newGarments: string[]) => void;
  selectedObject: fabric.Object | null;
  setSelectedObject: (obj: fabric.Object | null) => void;
  canvasUrl: string
  setCanvasurl: (url: string) => void
  loadImage: (garmentURL: string, garmentId: string) => Promise<void>;
  addImageToCanvasFromGallery: (garmentURL: string, garmentId: string | unknown) => Promise<void>;
};

const useCanvasStore = create<CanvasStore>()(
  persist(
    (set, get) => ({
      // קנבס
      canvas: null,
      setCanvas: (canvas: fabric.Canvas | null) => set({ canvas }),
      // הצג גלריה
      OpenGallery: false, // הצגת גלריה
      toggleOpenGallery: (flag: boolean) => set({ OpenGallery:flag }),
      // מערך בגדים נבחרים
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
      // אובייקט נבחר בקנבס לעריכה
      selectedObject: null,
      setSelectedObject: (obj: fabric.Object | null) => {
        set({ selectedObject: obj });
      },
      // ייצוא של הקנבס לתמונה
      canvasUrl: "",
      setCanvasurl: async (url: string) => set({ canvasUrl: url }),
      // הוספת בגד לקנבס
      loadImage: async (garmentURL: string, garmentId: string) => {
        const canvas = get().canvas;
        if (!canvas) return;

        await fabric.Image.fromURL(
          garmentURL,
          (img) => {
            img.set({
              left: 50,
              top: 50,
              scaleX: 0.5,
              scaleY: 0.5,
              garmentId: garmentId
            });
            canvas.add(img);
            canvas.setActiveObject(img);
          },
          { crossOrigin: "anonymous" }
        );
        canvas.requestRenderAll();
      },
      // הוספת בגד ללוק מהגלריה
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
          get().toggleOpenGallery(false)
        } catch (error) {
          console.error("Failed to load image:", error);
        }
      },
    }),
    {
      name: "canvas-store",
      partialize: (state) => ({
        canvasUrl: state.canvasUrl,
        garments: state.garments,
        canvasJSON: state.canvas?.toJSON(["garmentId"])
      }),
    }
  )
);

export default useCanvasStore;
