// import { create } from 'zustand';
// import * as fabric from 'fabric';

// type CanvasStore = {
//   canvas: fabric.Canvas | null;
//   setCanvas: (canvas: fabric.Canvas) => void;
//   garments: string[];
//   addGarment: (garmentId: string) => void;
//   saveCanvasState: () => void;
//   loadCanvasState: () => void;
// }

// const useCanvasStore = create<CanvasStore>((set, get) => ({
//   canvas: null,
//   setCanvas: (canvas) => set({ canvas }),
//   garments: [],
//   addGarment: (garmentId) => {
//     if (!get().garments.includes(garmentId)) {
//       set((state) => ({ garments: [...state.garments, garmentId] }));
//     }
//   },
//   saveCanvasState: () => {
//     const canvas = get().canvas;
//     if (canvas) {
//       const canvasData = canvas.toJSON();
//       localStorage.setItem('canvasState', JSON.stringify(canvasData));
//     }
//   },
//   loadCanvasState: () => {
//     const canvas = get().canvas;
//     const savedState = localStorage.getItem('canvasState');
//     if (savedState && canvas) {
//       canvas.loadFromJSON(savedState, () => canvas.renderAll());
//     }
//   },
// }));
