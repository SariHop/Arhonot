import { create } from 'zustand';
import * as fabric from 'fabric';
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
    if (!canvas) return

    const img = await fabric.FabricImage.fromURL(garmentURL, {
      crossOrigin: "anonymous",
    });

    // Ensure canvas width and height are valid
    if (!canvas.width || !canvas.height) {
      console.error("Canvas dimensions are invalid.");
      return;
    }

    // Calculate scale to fit canvas while maintaining aspect ratio
    const canvasScale = Math.min(
      canvas.width / img.width,
      canvas.height / img.height
    ) * 0.5; // 50% of max scale to leave some margin

    img.set({
      left: canvas.width / 2 - (img.width * canvasScale) / 2,
      top: canvas.height / 2 - (img.height * canvasScale) / 2,
      scaleX: canvasScale,
      scaleY: canvasScale,
    });

    canvas.add(img);
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
