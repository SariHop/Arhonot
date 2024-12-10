import React, { useState, useEffect, useContext } from "react";
import { Button, IconButton } from "@mui/material";
import * as fabric from 'fabric';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { CanvasContext } from "@/app/components/createOutfit/Canvas";


const calcFullSize: () => number = () => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  let size;
  if (height > width) {
    size = width;
  } else {
    size = height / 2;
  }
  return size - 100;
};

function CanvasSettings() {

  const [canvasLen, setCanvasLen] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [precent, setPrecent] = useState(100);

  const context = useContext(CanvasContext);
  const canvas:fabric.Canvas|null|undefined = context?.canvas;

  useEffect(() => {
    if (canvas) {
      if (!canvasLen) {
        const size = calcFullSize();
        canvas.setWidth(size);
        canvas.setHeight(size);
        setCanvasLen(size);
        setOriginalSize(size);
      } else {
        canvas.setWidth(canvasLen);
        canvas.setHeight(canvasLen);
      }
      canvas.renderAll();
    }
  }, [canvasLen, canvas]);


  const handleReset = () => {
    setCanvasLen(originalSize);
    setPrecent(100)
  };

  const handleZoomIn = () => {
      setCanvasLen(len => (len*115)/100);
      setPrecent(precent=> precent+15)
  };

  const handleZoomOut = () => {
     setCanvasLen(len => (len*85)/100);
     setPrecent(precent=> precent-15)
  };

  return (
    <div> 
      <p>{precent}%</p>
      <IconButton onClick={handleZoomOut} disabled={canvasLen<100}>
        <ZoomOutIcon />
      </IconButton>
      <IconButton onClick={handleZoomIn} disabled={window.innerWidth<(canvasLen*115)/100}>
        <ZoomInIcon />
      </IconButton>
      <Button onClick={handleReset}>Reset</Button>
    </div>
  );
}

export default CanvasSettings;