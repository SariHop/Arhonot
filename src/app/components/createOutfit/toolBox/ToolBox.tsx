"use client";
import React, { useEffect } from "react";
import ButtonCreateOutfit from "@/app/components/createOutfit/toolBox/create/CreateOutfit";
import DeleteButton from "./x/Delete";
import useCanvasStore from "@/app/store/canvasStore";

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
  }, [canvas]);


  return (
    <div
      className="flex overflow-x-auto whitespace-nowrap p-3 gap-5 m-1 "
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
    </div>
  );
};

export default ToolBox;
