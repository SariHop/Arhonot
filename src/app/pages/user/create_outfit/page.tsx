"use client";
import React, { useState, useEffect } from "react";
import * as fabric from 'fabric';

const CreateOutfit = () => {

  // useref
  const [canvas, setCanvas] = useState<fabric.Canvas>();

  useEffect(() => {
   
    // לטפל ביחס רוחב גובה גם בין מכשירים שונים
    const width = 300
    const height = 450
  
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

  const addImage = async () => {
    // אסתי תשלח ניתוב
    // לשמור במערך גם את הID של התמונה בשביל לשמור בדאטבייס
    if (!canvas) return;

    const imageUrl =
      "https://images.pexels.com/photos/1340389/pexels-photo-1340389.jpeg?auto=compress&cs=tinysrgb&w=400";

    try {
      const img = await fabric.Image.fromURL(imageUrl, {
        crossOrigin: "anonymous", // Enable cross-origin for the image
      });
      img.set({
        left: canvas.width! / 2 - img.width! / 2, // מיקום במרכז
        top: canvas.height! / 2 - img.height! / 2,
        scaleX: 0.5, // להקטין את התמונה לגודל מתאים
        scaleY: 0.5,
      });

      canvas.add(img);
      canvas.requestRenderAll();
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
    // לשמור בענן, לקבל ניתוה ואז לשלוח לשרת ליצירה

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas_image.png";
    link.click();
  };


  return (
    <div>
      {/* עיצוב רספונסיבי */}
      {/* סרגל כלים */}
      {/* גלריה */}
      <button onClick={exportCanvasAsImage}>Export as Image</button>
      <button onClick={addImage}>Add Image</button>
      <canvas id="canvas" />
    </div>
  )



}

export default CreateOutfit