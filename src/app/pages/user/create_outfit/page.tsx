"use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import useCanvasStore from "@/app/store/canvasStore";
import Canvas from "@/app/components/createOutfit/Canvas";

const CreateOutfit = () => {
  // const router = useRouter();
  // const { garments } = useCanvasStore();

  // useEffect(() => {
  //   // Handle browser back/forward/close events
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     if (garments.length > 0) {
  //       e.preventDefault();
  //       return "בטוח שאתה רוצה לעזוב? השינויים שלך לא ישמרו";
  //     }
  //   };

  //   // Handle browser history navigation (popstate)
  //   const handlePopState = (e: PopStateEvent) => {
  //     if (garments.length > 0) {
  //       e.preventDefault();
  //       const confirmLeave = window.confirm("בטוח שאתה רוצה לעזוב? השינויים שלך לא ישמרו");
  //       if (!confirmLeave) {
  //         // Revert to current page
  //         window.history.pushState(null, '', window.location.href);
  //       }
  //     }
  //   };

  //   // Add event listeners
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   window.addEventListener("popstate", handlePopState);

  //   // Intercept Next.js router navigation
  //   const originalPush = router.push;
  //   router.push = (...args) => {
  //     if (garments.length > 0) {
  //       const confirmLeave = window.confirm("בטוח שאתה רוצה לעזוב? השינויים שלך לא ישמרו");
  //       if (!confirmLeave) {
  //         return Promise.resolve(false);
  //       }
  //     }
  //     return originalPush(...args);
  //   };

  //   // Cleanup function
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     window.removeEventListener("popstate", handlePopState);
      
  //     // Restore original router.push method
  //     router.push = originalPush;
  //   };
  // }, [garments, router]);

  return (
    <div>
      <Canvas/>
    </div>
  );
}

export default CreateOutfit;