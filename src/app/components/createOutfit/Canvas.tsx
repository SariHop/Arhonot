"use client";
import React, { useState, useEffect, createContext } from "react";
import * as fabric from 'fabric';
import ShowGallery from "@/app/components/createOutfit/ShowGallery";
import { CanvasContextType } from "@/app/types/canvas"
import GarmentForm from "./FormCreateOutfit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const CanvasContext = createContext<CanvasContextType | null>(null)

const Canvas = () => {
  const [openModal, setOpenModal] = useState(false);
  const [outfitImgurl, setOutfitImgurl] = useState("");
  const showModal = () => { setOpenModal(true); };
  const closeModal = () => { setOpenModal(false); };

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  const [arreyOfGarmentInCanvas, setArrayOfGarmentInCanvas] = useState<string[]>([]);


  useEffect(() => {
    // Responsive sizing
    const width = window.innerWidth < 1024 ? window.innerWidth : window.innerWidth * 0.5;
    const height = window.innerWidth < 1024 ? window.innerHeight * 0.66 : window.innerHeight;

    const c = new fabric.Canvas("canvas", {
      height: height,
      width: width,
      backgroundColor: "black",
    });

    setCanvas(c);

    // Add resize listener for responsiveness
    // const handleResize = () => {
    //   const newWidth = window.innerWidth < 1024 ? window.innerWidth : window.innerWidth * 0.5;
    //   const newHeight = window.innerWidth < 1024 ? window.innerHeight * 0.66 : window.innerHeight;

    //   c.setWidth(newWidth);
    //   c.setHeight(newHeight);
    //   c.renderAll();
    // };

    // window.addEventListener('resize', handleResize);

    return () => {
      c.dispose();
      // window.removeEventListener('resize', handleResize);
    };
  }, []);


  const addImageToCanvas = async (garmentURL: string, garmenId: string | unknown) => {
    if (!canvas) return;

    // בדיקה האם הבגד נבחר כבר ואם לא להוסיף לרשימת הבגדים ולקנבס
    if (typeof garmenId === 'string') {
      if (arreyOfGarmentInCanvas.includes(garmenId)) {
        toast.info("הבגד כבר נוסף ללוק בהצלחה!");
        return;
      } 
    } else {
      console.error("garmenId is not a string", garmenId);
      return;
    }

    try {
      const img = await fabric.Image.fromURL(garmentURL, {
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
      ) * 0.8; // 80% of max scale to leave some margin

      img.set({
        left: canvas.width / 2 - (img.width * canvasScale) / 2,
        top: canvas.height / 2 - (img.height * canvasScale) / 2,
        scaleX: canvasScale,
        scaleY: canvasScale,
      });

      canvas.add(img);
      canvas.requestRenderAll();

      setArrayOfGarmentInCanvas(prevArray => [...prevArray, garmenId]);// אם הגיע עד לפה להוסיף בגד למערך
      
    } catch (error) {
      console.error("Failed to load image:", error);
    }
  };


  const exportCanvasAsImage = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });
    setOutfitImgurl(dataURL)
    showModal()

    // const link = document.createElement("a");
    // link.href = dataURL;
    // link.download = "canvas_image.png";
    // link.click();
  };


  return (
    <div className="flex flex-col lg:flex-row w-full h-screen">
      <CanvasContext.Provider value={{ canvas, addImageToCanvas, arreyOfGarmentInCanvas }}>

        {/* Canvas with responsive sizing */}
        <div className="w-full lg:w-1/2 h-2/3 lg:h-full bg-black flex items-center justify-center">
          <canvas
            id="canvas"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Gallery and Image Addition */}
        <div className="w-full lg:w-1/2 h-1/3 lg:h-full overflow-auto">
          <ShowGallery />
          <button
            onClick={exportCanvasAsImage}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Image
          </button>
        </div>

        {openModal && <GarmentForm closeModal={closeModal} outfitImgurl={outfitImgurl} />}

      </CanvasContext.Provider>
    </div>
  )
}

export default Canvas