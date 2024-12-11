"use client";
import React, { useState, useEffect, createContext, useRef } from "react";
import * as fabric from 'fabric';
import ShowGallery from "@/app/components/createOutfit/ShowGallery";
import { CanvasContextType } from "@/app/types/canvas"
import GarmentForm from "./FormCreateOutfit";
import { toast } from "react-toastify";
import ToolBox from "@/app/components/createOutfit/toolBox/ToolBox"
import "react-toastify/dist/ReactToastify.css";

export const CanvasContext = createContext<CanvasContextType | null>(null)

const Canvas = () => {
  const [outfitImgurl, setOutfitImgurl] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const showModal = () => { setOpenModal(true); };
  const closeModal = () => { setOpenModal(false); };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [arreyOfGarmentInCanvas, setArrayOfGarmentInCanvas] = useState<string[]>([]);

  useEffect(() => {

    const calcWidth:()=>number = () => {
      const min = Math.min(window.innerWidth, window.innerHeight)
      return (min*90)/100
    }

    if (canvasRef.current) {
      const len = calcWidth()
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: len,
        height: len
      })
      initCanvas.backgroundColor = "white"
      initCanvas.renderAll()
      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      }
    }
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
  };


  return (
    <div className="flex flex-col justify-center mt-3">
      <CanvasContext.Provider value={{ canvas, addImageToCanvas, arreyOfGarmentInCanvas, exportCanvasAsImage }}>

        <div className="mb-3">
          <div >
            <ShowGallery />
          </div>
        </div>

        <div className="bg-checkered-pattern flex justify-center items-center gap-5 p-5 flex-col ">
          <ToolBox />
          <canvas id="canvas" ref={canvasRef} className="shadow-lg max-w-full h-auto" />
        </div>

        {openModal && <GarmentForm closeModal={closeModal} outfitImgurl={outfitImgurl} />}
      </CanvasContext.Provider>
    </div>
  )
}

export default Canvas