"use client";
import React from "react";
import useCanvasStore from "@/app/store/canvasStore";
import { IconButton } from '@mui/material';
import { MdMoveUp } from "react-icons/md";
import { MdMoveDown } from "react-icons/md";

const Layers: React.FC = () => {
  const { canvas, selectedObject } = useCanvasStore();
 
  const bringForward = () => {
    if (canvas && selectedObject) {
        selectedObject.bringForward();
        canvas.renderAll();
    }
  };

  const sendBackwards = () => {
    if (canvas && selectedObject) {
        selectedObject.sendBackwards();
        canvas.renderAll();
    }
  };

  return (
    <div>
      <IconButton size="medium" color="info" disabled={!selectedObject} onClick={bringForward}>
        <MdMoveUp />
      </IconButton>

      <IconButton size="medium" color="info" disabled={!selectedObject} onClick={sendBackwards}>
        <MdMoveDown />
      </IconButton>
    </div>
  );
};

export default Layers;
