"use client";
import React, { useState, useEffect, createContext } from "react";
import * as fabric from 'fabric';
import ShowGallery from "@/app/components/createOutfit/ShowGallery";
import { CanvasContextType } from "@/app/types/canvas"


export const CanvasContext = createContext<CanvasContextType | null>(null)


const CreateOutfit = () => {

  // useref
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    // לטפל ביחס רוחב גובה גם בין מכשירים שונים
    const width = window.innerWidth
    const height = 200

    const c = new fabric.Canvas("canvas", {
      height: height,
      width: width,
      backgroundColor: "black",
    });

    // settings for all canvas in the app
    // fabric.FabricObject.prototype.transparentCorners = false;
    // fabric.FabricObject.prototype.cornerColor = "#2BEBC8";
    // fabric.FabricObject.prototype.cornerStyle = "rect";
    // fabric.FabricObject.prototype.cornerStrokeColor = "#2BEBC8";
    // fabric.FabricObject.prototype.cornerSize = 6;
    // למחוק אלמנט, להעתיק אלמנט

    setCanvas(c);

    return () => {
      c.dispose();
    };
  }, []);

  const addImageToCanvas = async (garmentURL: string, garmenId: string | unknown) => {
    if (!canvas) return;

    const imageUrl = garmentURL

    try {
      const img = await fabric.Image.fromURL(imageUrl, {
        crossOrigin: "anonymous",
      });
      img.set({
        left: canvas.width! / 2 - img.width! / 2,
        top: canvas.height! / 2 - img.height! / 2,
        scaleX: 0.5,
        scaleY: 0.5,
      });

      canvas.add(img);
      canvas.requestRenderAll();
    } catch (error) {
      console.error("Failed to load image:", error);
    }

    // need to update an array of garments
    // ליצור כאן את המערך ולשתף בקונטקסט
    // כנראה גם את המצביע צריך ליצור ולשתף
    console.log(garmenId)
  };

  return (
    <div>
      <CanvasContext.Provider value={{ canvas, addImageToCanvas }}>

        {/* קנבס*/}
        <canvas id="canvas" />

        {/*גלריה והוספת תמונה*/}
        {/* לשלוח פרופב בוליאני שכעת יצירת לוק */}
        <ShowGallery />

      </CanvasContext.Provider>
    </div>
  )
}

export default CreateOutfit