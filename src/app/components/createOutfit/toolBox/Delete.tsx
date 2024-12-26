"use client";
import React from "react";
import useCanvasStore from "@/app/store/canvasStore";
import { IconButton } from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import { fabric } from "fabric";

const DeleteButton: React.FC = () => {
  const { canvas, deleteGarment, selectedObject, setSelectedObject } = useCanvasStore();

  const handleDelete = () => {
    if (canvas && selectedObject) {
      if (selectedObject instanceof fabric.Image) {
        const imageObject = selectedObject;
        const garmentId = imageObject.garmentId;
        if (garmentId) {
          canvas.remove(imageObject);
          deleteGarment(garmentId);
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
