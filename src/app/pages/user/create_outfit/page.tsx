"use client";
import React, { useState, useEffect } from "react";
import { CanvasStateElemnt } from '@/app/hooks/useCanvasContects'
import * as fabric from 'fabric';
import ShowGallery from "@/app/components/createOutfit/ShowGallery";
import FormCreateOutfit from "@/app/components/createOutfit/FormCreateOutfit";
// import ToolBar from "@/app/components/createOutfit/ToolBar";

// export const CanvasStateElemnt = createContext<fabric.Canvas | null>(null)


const CreateOutfit = () => {

  // useref
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [shoeCreateForm, setShoeCreateForm] = useState(false);

  useEffect(() => {

    // לטפל ביחס רוחב גובה גם בין מכשירים שונים
    const width = window.innerWidth
    const height = 100

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

  // const exportCanvasAsImage = () => {
  //   if (!canvas) return;

  //   const dataURL = canvas.toDataURL({
  //     format: "png",
  //     quality: 1,
  //     multiplier: 1,
  //   });
  //   // לשמור בענן, לקבל ניתוה ואז לשלוח לשרת ליצירה

  //   const link = document.createElement("a");
  //   link.href = dataURL;
  //   link.download = "canvas_image.png";
  //   link.click();
  // };

  return (
    <div>
      {/*  לעטוף בקונטקסט */}
      {/* קנבס*/}
      <canvas id="canvas" />
      <CanvasStateElemnt.Provider value={canvas}></CanvasStateElemnt.Provider>
      {/* סרגל כלים */}
      {/* <ToolBar /> */}

      <button
        className="focus:outline-none text-white bg-magenta hover:bg-red-900 focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
        // onClick={exportCanvasAsImage}>
        onClick={() => { setShoeCreateForm(true) }}>
        שמירה </button>

      {shoeCreateForm && <FormCreateOutfit />}

      {/*גלריה והוספת תמונה*/}
      <ShowGallery canvas={canvas} />

    </div>
  )



}

export default CreateOutfit