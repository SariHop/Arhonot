"use client";
import React from "react";
import useCanvasStore from "@/app/store/canvasStore";
import { IconButton } from '@mui/material';
import { FaBroom } from "react-icons/fa6";

const ClearButton = () => {

    const { canvas, setGarments, garments } = useCanvasStore();

    const handleClear = () => {
        if (canvas) {
            canvas.getObjects().forEach((obj) => canvas.remove(obj));
            canvas.renderAll();
            setGarments([]);
        }
    }

    return (
        <div>
            <IconButton size="medium" color="warning" disabled={garments.length === 0} onClick={handleClear}>
                <FaBroom />
            </IconButton>
        </div>
    )
}

export default ClearButton;
