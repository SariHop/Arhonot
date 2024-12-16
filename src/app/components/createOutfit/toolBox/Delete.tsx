import React from 'react'

const Delete = () => {
  return (
    <div>Delete</div>
  )
}

export default Delete

// "use client";
// import React, { useEffect, useState } from "react";
// import useCanvasStore from "@/app/store/canvasStore";
// import * as fabric from 'fabric';
// import { IconButton } from '@mui/material';
// import { FaTrash } from 'react-icons/fa';


// const DeleteButton: React.FC = () => {
//     const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
//     const { canvas } = useCanvasStore();

//     useEffect(() => {
//         if (!canvas) return;

//         const handleSelectionCreated = (event: fabric.IEvent) => {
//             if (event.selected && event.selected.length > 0) {
//                 handleObjectSelection(event.selected[0]);
//             }
//         };

//         const handleSelectionUpdated = (event: fabric.IEvent) => {
//             if (event.selected && event.selected.length > 0) {
//                 handleObjectSelection(event.selected[0]);
//             }
//         };

//         const handleSelectionCleared = () => clearSelection();

//         canvas.on("selection:created", handleSelectionCreated);
//         canvas.on("selection:updated", handleSelectionUpdated);
//         canvas.on("selection:cleared", handleSelectionCleared);

//         return () => {
//             canvas.off("selection:created", handleSelectionCreated);
//             canvas.off("selection:updated", handleSelectionUpdated);
//             canvas.off("selection:cleared", handleSelectionCleared);
//         };
//     }, [canvas]);

//     const handleObjectSelection = (object: fabric.Object) => {
//         setSelectedObject(object);
//     };

//     const clearSelection = () => {
//         setSelectedObject(null);
//     };

//     const handleDelete = () => {
//         if (canvas && selectedObject) {
//             canvas.remove(selectedObject);
//             clearSelection();
//         }
//     };

//     return (
//         <div>
//             <IconButton color="error" disabled={!selectedObject} onClick={handleDelete}>
//                 <FaTrash />
//             </IconButton>
//         </div>
//     );
// };

// export default DeleteButton;
