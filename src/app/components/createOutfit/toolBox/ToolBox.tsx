import React, { useContext } from 'react'
import { CanvasContext } from "@/app/components/createOutfit/Canvas";

const ToolBox = () => {

  const context = useContext(CanvasContext);
  const exportCanvasAsImage = context?.exportCanvasAsImage || (() => console.warn("Export function is not provided"));

  return (
    <div>
      <button
        onClick={exportCanvasAsImage}
        className="m-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Image
      </button>
    </div>
  )
}

export default ToolBox