"use client";
import React, { useState, useEffect } from "react";
import {CanvasStateElemnt} from '@/app/hooks/useCanvasContects'
import * as fabric from 'fabric';
import ShowGallery from "@/app/components/createOutfit/ShowGallery";
// import ToolBar from "@/app/components/createOutfit/ToolBar";

// export const CanvasStateElemnt = createContext<fabric.Canvas | null>(null)


const CreateOutfit = () => {

  // useref
  const [canvas, setCanvas] = useState<fabric.Canvas|null>(null);

  useEffect(() => {

    // לטפל ביחס רוחב גובה גם בין מכשירים שונים
    const width = window.innerWidth
    const height = 300

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
    // canvas?.renderAll();

    return () => {
      c.dispose();
    };
  }, []);

  const exportCanvasAsImage = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });
    // לשמור בענן, לקבל ניתוה ואז לשלוח לשרת ליצירה

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas_image.png";
    link.click();
  };


  return (
    <div>
      {/* לנסות לעטוף בקונטקסט */}
      {/* קנבס*/}
      <canvas id="canvas" />
      <CanvasStateElemnt.Provider value={canvas}></CanvasStateElemnt.Provider>
      {/* סרגל כלים */}
      {/* <ToolBar /> */}
      
      <button onClick={exportCanvasAsImage}>Export as Image</button>

      {/*גלריה והוספת תמונה*/}
      <ShowGallery canvas={canvas}/>

    </div>
  )



}

export default CreateOutfit