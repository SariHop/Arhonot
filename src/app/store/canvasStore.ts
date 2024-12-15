import { create } from 'zustand';
import * as fabric from 'fabric';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type CanvasStore = {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  garments: string[]; //להשאיר כי אני עושה עליו בדיקות בלקוח
  addGarment: (garmentId: string) => void;
  addImageToCanvas: (imageUrl: string, garmentId: string | unknown) => Promise<void>;
  // saveCanvasToLocalStorage: () => void;
  // loadCanvasFromLocalStorage: () => void;
  // cleanCanvasLocalStorage: ()=>void
  
  // האם עריכה או יצירה
  // מצב הקנבס הנוכחי
  // גודל המסך?
};

const useCanvasStore = create<CanvasStore>((set, get) => ({
  canvas: null,
  setCanvas: (canvas:fabric.Canvas) => set({ canvas }),
  garments: [],
  addGarment: (garmentId) => {
    if (!get().garments.includes(garmentId)) {
      set((state) => ({ garments: [...state.garments, garmentId] }));
    }
  },
  addImageToCanvas: async (garmentURL: string, garmentId: string | unknown) => {
    
    const canvas = get().canvas; // Correctly accessing canvas from the state
    if (!canvas || typeof garmentId !== 'string') {
      return;
    }

    if (get().garments.includes(garmentId)) {
      toast.info("הבגד כבר נוסף ללוק בהצלחה!");
      return;
    }

    try {
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
      get().addGarment(garmentId);

    } catch (error) {
      console.error("Failed to load image:", error);
    }
  },
  saveCanvasToLocalStorage: () => {
    const canvas = get().canvas;
    if (!canvas) {
      console.error("Canvas not initialized.");
      return;
    }

    const json = canvas.toJSON();
    localStorage.setItem("canvasData", JSON.stringify(json));
    console.log("הקנבס נשמר בהצלחה!");
  },
  loadCanvasFromLocalStorage: () => {

    const canvas = get().canvas;
    if (!canvas) {
      console.error("Canvas not initialized.");
      return;
    }

    const json = localStorage.getItem("canvasData");
    if (!json) {return};

    canvas.loadFromJSON(
      JSON.parse(json),
      () => {
        canvas.requestRenderAll();
      }    
    );
  },
  cleanCanvasLocalStorage:()=>{
    localStorage.removeItem("canvasData");  }
}));

export default useCanvasStore;
