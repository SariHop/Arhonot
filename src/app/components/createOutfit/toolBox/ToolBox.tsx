"use client";
import React from "react";
import { IconButton, Typography } from "@mui/material";
import {
  FaTrash,
  FaLayerGroup,
  FaLock,
  FaUndo,
  FaRedo,
  FaSave,
  FaImage,
  FaCrop,
} from "react-icons/fa";
import {
  AiOutlineClear,
  AiOutlineZoomIn,
  AiOutlineZoomOut,
  AiOutlineRotateLeft,
} from "react-icons/ai";
import ButtonCreateOutfit from "@/app/components/createOutfit/toolBox/create/CreateOutfit";

const ToolBox = () => {
  const tools = [
    { icon: <FaTrash />, label: "מחיקה" },
    { icon: <FaLayerGroup />, label: "שכבה עליונה" },
    { icon: <FaLock />, label: "נעילה" },
    { icon: <FaUndo />, label: "ביטול פעולה" },
    { icon: <FaRedo />, label: "חזרה" },
    { icon: <AiOutlineClear />, label: "ניקוי לוח" },
    { icon: <AiOutlineZoomIn />, label: "הגדלה" },
    { icon: <AiOutlineZoomOut />, label: "הקטנה" },
    { icon: <AiOutlineRotateLeft />, label: "סיבוב" },
    { icon: <FaSave />, label: "שמירה" },
    { icon: <FaImage />, label: "תמונה" },
    { icon: <FaCrop />, label: "חיתוך" },
  ];

  return (
    <div
      className="flex overflow-x-auto whitespace-nowrap p-3 gap-5 m-1 "
      style={{ scrollbarWidth: "thin" }}
    >

      <ButtonCreateOutfit />

      {tools.map((tool, index) => (
        <div
          key={index}
          className="flex flex-col items-center flex-shrink-0"
          style={{ minWidth: "fit-content" }}
        >
          <IconButton size="medium">{React.cloneElement(tool.icon)}</IconButton>
          <Typography variant="caption">{tool.label}</Typography>
        </div>
      ))}
    </div>
  );
};

export default ToolBox;
