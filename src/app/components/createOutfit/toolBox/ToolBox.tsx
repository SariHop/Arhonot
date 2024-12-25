"use client";
import React, { useEffect } from "react";
import ButtonCreateOutfit from "@/app/components/createOutfit/toolBox/CreateOutfit";
import DeleteButton from "./Delete";
import useCanvasStore from "@/app/store/canvasStore";
import ClearButton from "./Clear";
import Layers from "@/app/components/createOutfit/toolBox/Layers"

const ToolBox = () => {
  const { canvas, setSelectedObject } = useCanvasStore();

  useEffect(() => {
    if (!canvas) return;
    // יצירת מאזינים לבחירה של אלמנט על הקנבס ושמירת האובייקט הנבחר בסטור

    const handleSelectionCreated = (event: fabric.IEvent) => {
      if (event.selected && event.selected.length > 0) {
        setSelectedObject(event.selected[0]);
      }
    };
    const handleSelectionUpdated = (event: fabric.IEvent) => {
      if (event.selected && event.selected.length > 0) {
        setSelectedObject(event.selected[0]);
      }
    };
    const handleSelectionCleared = () => setSelectedObject(null);

    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionUpdated);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionUpdated);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvas, setSelectedObject]);



  return (
    <div
      className="flex justify-center p-3 gap-7 m-1"
      style={{ scrollbarWidth: "thin" }}
    >
      <ButtonCreateOutfit />

      <div
        className="flex flex-col items-center flex-shrink-0"
        style={{ minWidth: "fit-content" }}
      >
        <DeleteButton />
        <p className="text-sm">מחיקה</p>
      </div>

      <div
        className="flex flex-col items-center flex-shrink-0"
        style={{ minWidth: "fit-content" }}
      >
        <ClearButton />
        <p className="text-sm">ניקוי</p>
      </div>

      <div
        className="flex flex-col items-center flex-shrink-0"
        style={{ minWidth: "fit-content" }}
      >
        <Layers />
        <p className="text-sm">ניהול שכבות</p>
      </div>

    </div>
  );
};

export default ToolBox;
