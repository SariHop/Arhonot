"use client";
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import ShowGallery from "@/app/components/createOutfit/ShowGallery";
import ToolBox from "@/app/components/createOutfit/toolBox/ToolBox";
import useCanvasStore from "@/app/store/canvasStore";
import { useRouter } from "next/navigation";

// אובייקט של הקנבס נשמר דרך זוסטנד בלוקלסטורג
// משום מה בטעינה מחדש של העמוד הקריאה יוסאפקט ניטענת פעמיים, כנראה קשור לריאקט
// בקריאה הראשונה הקנבס מעודכן ובקריאה השניה הוא מתרוקן
// כרגע הקוד מבולגן ועושה שמיניות באויר כדי
// להצליח לשמור את הקנבס המעודכן מהקריאה הראשונה, לטעון אותו לאלמנט קנבס בדום
// ולעדכן את הלוקלסטורג מחדש

// גישות אפשריות:
// לא לשמור את הקנבס דרך הזוסטנד, לנסות עצאית להוסיף מאזין כלשהו שיטען את 
// השינויים ויהיה לי עליו לכאורה יותר שחיטה מתי העידכונים שלו מתבצעים

// להמשיך לדבג בזוסטנג איך למנוע את הקריאה השניה המוזרה, 
// להיזהר מאדדד מהשגיאה של
// "מלבן לא מוגד"
// כי זה קרה לי שוב במעבר בין עמודים כאשר הפונקציה שטוענת מהלוקל נקראה ביוסאפק השני שטוען את הקנבס
// ולא ביוסאפקט הראשון שטוען את הקנבס כמו שקורה עכשיו ועובד היטב


const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { setCanvas, canvas } = useCanvasStore();
  const [canvasFromLocacl, setCanvasFromLocacl] = useState(null);

  const router = useRouter()

  const getCanvasfromlocaStorage = () => {
    const savedCanvas = localStorage.getItem("canvas-store");
    if (savedCanvas) {
      const savedCanvasObj = JSON.parse(savedCanvas);
      const canvasJSON = savedCanvasObj.state.canvasJSON
      if (canvasJSON && canvasJSON.objects.length > 0) {
        return canvasJSON
      }
    }
    return null;
  };

  // const getCanvasfromlocaStorage = () => {
  //   const savedCanvas = localStorage.getItem("canvas-store");
  //   if (savedCanvas) {
  //     const savedCanvasObj = JSON.parse(savedCanvas);

  //     // בדיקה שיש לעריכה
  //     if (savedCanvasObj.state.editOutfit) {
  //        //עריכת לוק
  //       const canvasJsonEdit = savedCanvasObj.state.editOutfit.canvasJSON
  //       if (canvasJsonEdit && canvasJsonEdit.objects.length > 0) {
  //         return canvasJsonEdit
  //       }
  //     } else {
  //       // יצירת לוק
  //       const canvasJSON = savedCanvasObj.state.canvasJSON
  //       if (canvasJSON && canvasJSON.objects.length > 0) {
  //         return canvasJSON
  //       }
  //     }
  //   }
  //   return null;
  // };

  useEffect(() => {
    // Calculate width of the canvas based on the window size
    const calcWidth = () => {
      const min = Math.min(window.innerWidth, window.innerHeight);
      return (min * 90) / 100;
    };

    // Load canvas data from localStorage
    const loadedCanvas = getCanvasfromlocaStorage();
    if (loadedCanvas) {
      setCanvasFromLocacl(loadedCanvas);
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
    // בדיקה שהקנבס מאותחל כדי להימנע משגיאות
    if (canvas) {
      // בדיקה שיש מצב שמור בלוקל סטורג
      if (canvasFromLocacl) {
        // פונקציית טעינת האובייקט לקנבס בדום
        canvas.loadFromJSON(canvasFromLocacl, () => {
          // בתוך הקולבק: הרצת הקנב ועדון הלוקל סטוג
          canvas.renderAll();
          const savedCanvas = localStorage.getItem("canvas-store");
          if (savedCanvas) {
            const savedCanvasObj = JSON.parse(savedCanvas);
            savedCanvasObj.state.canvasJSON = canvasFromLocacl
            localStorage.setItem("canvas-store", JSON.stringify(savedCanvasObj))
            // צריך לתפוס שגיאות בעדכון הלוקל?
          }
        },
        );
      }
    };
  }, [canvas, canvasFromLocacl]);

  return (
    <div className="flex flex-col justify-center mt-3">
      <button onClick={() => { router.push(`/pages/user`) }}>חזרה לדף הבית</button>
      <div className="bg-white">
        <ShowGallery />
        <ToolBox />
      </div>

      <div className="bg-checkered-pattern flex justify-center items-center gap-5 p-7
       flex-col">
        <canvas key="canvas" id="canvas" ref={canvasRef} className="shadow-lg max-w-full h-0 w-0" />
      </div>
    </div>
  );
};

export default Canvas;
