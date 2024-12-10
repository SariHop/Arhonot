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
    const isMobile = window.innerWidth < 1100; // Typical mobile breakpoint
    const width = isMobile
      ? window.innerWidth
      : window.innerWidth / 2;

    const height = width; // Keep it square

    const c = new fabric.Canvas("canvas", {
      height: height - 30,
      width: width - 30,
      backgroundColor: 'rgba(0,0,0,0.1)',
    });

    // Ensure canvas is visible immediately
    const canvasElement = document.getElementById("canvas");
    if (canvasElement) {
      canvasElement.style.visibility = 'visible';
      canvasElement.style.backgroundColor = 'rgba(0,0,0,0.1)'; // Slight visibility
    }

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
    <div className="flex flex-col xl:flex-row w-full justify-center mt-3">
      <CanvasContext.Provider value={{ canvas, addImageToCanvas, arreyOfGarmentInCanvas }}>

        <div>
          <button
            onClick={exportCanvasAsImage}
            className="m-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Image
          </button>

          <div>
            <ShowGallery />
          </div>
        </div>


        <div className="m-auto my-3">
          <canvas id="canvas" />
        </div>


        {openModal && <GarmentForm closeModal={closeModal} outfitImgurl={outfitImgurl} />}

      </CanvasContext.Provider>
    </div>
  )
}

export default Canvas