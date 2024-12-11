"use client";
import React, {useEffect, useRef } from "react";
import * as fabric from 'fabric';
import ShowGallery from "@/app/components/createOutfit/ShowGallery";
import ToolBox from "@/app/components/createOutfit/toolBox/ToolBox"
import useCanvasStore from "@/app/store/canvasStore";

const Canvas = () => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { canvas, setCanvas } = useCanvasStore();

  useEffect(() => {

    const calcWidth: () => number = () => {
      const min = Math.min(window.innerWidth, window.innerHeight)
      return (min * 90) / 100
    }

    if (canvasRef.current) {
      const len = calcWidth()
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: len,
        height: len
      })
      initCanvas.backgroundColor = "white"

      const savedState = localStorage.getItem("canvasState");
      if (savedState && canvas) {
        canvas.loadFromJSON(savedState, () => {
          canvas.renderAll();
          console.log("Canvas state loaded!");
        });
      }

      initCanvas.renderAll()
      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      }
    }
  }, []);

  return (
    <div className="flex flex-col justify-center mt-3">

        <ShowGallery />
        <ToolBox />

        <div className="bg-checkered-pattern flex justify-center items-center gap-5 p-5 flex-col ">
          <canvas id="canvas" ref={canvasRef} className="shadow-lg max-w-full h-auto" />
        </div>
    </div>
  )
}

export default Canvas