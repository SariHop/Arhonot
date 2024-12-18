"use client";
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

import ShowGallery from "@/app/components/createOutfit/ShowGallery";
import ToolBox from "@/app/components/createOutfit/toolBox/ToolBox";
import useCanvasStore from "@/app/store/canvasStore";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { setCanvas, canvas } = useCanvasStore();
  const [canvasFromLocacl, setCanvasFromLocacl] = useState(null);

  const canvasJsonFromLS = () => {
    const savedCanvasJSON = localStorage.getItem("canvasJSON");
    if (savedCanvasJSON) {
      return JSON.parse(savedCanvasJSON);
    }
    return null;
  };

  useEffect(() => {
    // Calculate width of the canvas based on the window size
    const calcWidth = () => {
      const min = Math.min(window.innerWidth, window.innerHeight);
      return (min * 90) / 100;
    };

    // Load canvas data from localStorage
    const loadedCanvasJson = canvasJsonFromLS();
    if (loadedCanvasJson) {
      setCanvasFromLocacl(loadedCanvasJson);  // Only set `y` if we have data
    }

    if (canvasRef.current) {
      const len = calcWidth();
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: len,
        height: len,
        backgroundColor: "white",
      });
      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, [setCanvas]);


  useEffect(() => {
    if (canvas) {
      const json = canvasJsonFromLS();
      if (json) {
        canvas.loadFromJSON(canvasFromLocacl, () => {
          canvas.renderAll();
          console.log("Canvas loaded");
        },
          // (o, object) => {
          //   console.log(o, object);
          // }
        );
      }
    };
  }, [canvas, canvasFromLocacl]);

  const saveto = () => {
    localStorage.setItem("canvasJSON", JSON.stringify(canvas?.toJSON()))
  }

  return (
    <div className="flex flex-col justify-center mt-3">
      <div className="bg-white">
        <ShowGallery />
        <ToolBox />

        <button onClick={saveto}>שמירה בלוקל</button>

      </div>

      <div className="bg-checkered-pattern flex justify-center items-center gap-5 p-5 flex-col">
        <canvas key="canvas" id="canvas" ref={canvasRef} className="shadow-lg max-w-full h-0 w-0" />
      </div>
    </div>
  );
};

export default Canvas;
