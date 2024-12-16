"use client";
import React, { useEffect, useState } from "react";
import useCanvasStore from "@/app/store/canvasStore";
import { fabric } from "fabric";
import { IconButton } from '@mui/material';
import { FaTrash } from 'react-icons/fa';

const DeleteButton: React.FC = () => {
  const { canvas, deleteGarment, selectedObject, setSelectedObject } = useCanvasStore();

  const handleDelete = () => {
    if (canvas && selectedObject) {
      const data = selectedObject.get('data');
      if (data) {
        canvas.remove(selectedObject);
        deleteGarment(data.garmentId)
        setSelectedObject(null);
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
