"use client";
import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

import ShowGallery from "@/app/components/createOutfit/ShowGallery";
import ToolBox from "@/app/components/createOutfit/toolBox/ToolBox"
import useCanvasStore from "@/app/store/canvasStore";

const Canvas = () => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { setCanvas } = useCanvasStore();

  useEffect(() => {
    const calcWidth: () => number = () => {
      const min = Math.min(window.innerWidth, window.innerHeight)
      return (min * 90) / 100
    }
  
    if (canvasRef.current) {
      const len = calcWidth();
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: len,
        height: len,
        backgroundColor: "white"
      });

      initCanvas.renderAll()
      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  return (
    <div className="flex flex-col justify-center mt-3">

      <div className="bg-white">
        <ShowGallery />
        <ToolBox />
      </div>

      <div className="bg-checkered-pattern flex justify-center items-center gap-5 p-5 flex-col ">
        <canvas key="canvas" id="canvas" ref={canvasRef} className="shadow-lg max-w-full h-0 w-0" />
      </div>
    </div>
  )
}

export default Canvas