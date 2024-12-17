"use client";

import { useEffect } from "react";
import useCanvasStore from "@/app/store/canvasStore";
import Canvas from "@/app/components/createOutfit/Canvas";

const CreateOutfit = () => {
  const { garments } = useCanvasStore();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (garments.length > 0) {
        e.preventDefault();
        return "בטוח שאתה רוצה לעזוב? השינויים שלך לא ישמרו";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [garments]);

  return (
    <div>
      <Canvas/>
    </div>
  )
}

export default CreateOutfit