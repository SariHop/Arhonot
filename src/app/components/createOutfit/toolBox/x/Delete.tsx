"use client";
import React from "react";
import useCanvasStore from "@/app/store/canvasStore";
import { IconButton } from '@mui/material';
import { FaTrash } from 'react-icons/fa';

const DeleteButton: React.FC = () => {
  const { canvas, deleteGarment, selectedObject, setSelectedObject } = useCanvasStore();

  const handleDelete = () => {
    debugger;
    if (canvas && selectedObject) {
      // בדוק תחילה אם האובייקט הוא תמונה
      if (selectedObject.type === 'image') {
        // עשה Type Assertion כדי ליידע את TypeScript שמדובר ב-fabric.Image
        const imageObject = selectedObject as fabric.Image;
  
        // בדוק אם יש garmentId
        const data = imageObject.garmentId;
        if (data) {
          canvas.remove(selectedObject);
          deleteGarment(data); // השתמש ב-garmentId
          setSelectedObject(null);
        }
      }
    }
  };
  

  return (
    <div>
      <IconButton size="medium" color="error" disabled={!selectedObject} onClick={handleDelete}>
        <FaTrash />
      </IconButton>
    </div>
  );
};

export default DeleteButton;
