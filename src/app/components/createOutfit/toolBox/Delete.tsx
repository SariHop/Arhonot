"use client";
import React from "react";
// import useCanvasStore from "@/app/store/canvasStore";
// import { IconButton } from '@mui/material';
// import { FaTrash } from 'react-icons/fa';
// import { fabric } from "fabric";

// Type error: Property 'garmentId' does not exist on type 'Image'.
//   18 |
//   19 |         // בדוק אם יש garmentId
// > 20 |         const data = imageObject.garmentId;
//      |                                  ^
//   21 |         if (data) {
//   22 |           canvas.remove(imageObject);
//   23 |           deleteGarment(data); // השתמש ב-garmentId
// Error: Command "npm run build" exited with 1

const DeleteButton: React.FC = () => {
  // const { canvas, deleteGarment, selectedObject, setSelectedObject } = useCanvasStore();

  // const handleDelete = () => {
  //   debugger;
  //   if (canvas && selectedObject) {
  //     // בדוק אם האובייקט הוא מסוג fabric.Image
  //     if (selectedObject instanceof fabric.Image) {
  //       const imageObject = selectedObject;

  //       // בדוק אם יש garmentId
  //       const data = imageObject.garmentId;
  //       if (data) {
  //         canvas.remove(imageObject);
  //         deleteGarment(data); // השתמש ב-garmentId
  //         setSelectedObject(null);
  //       }
  //     }
  //   }
  // };

  return (
    <div>
      {/* <IconButton size="medium" color="error" disabled={!selectedObject} onClick={handleDelete}>
        <FaTrash />
      </IconButton> */}
    </div>
  );
};

export default DeleteButton;
