"use client"
import React from 'react'
import useCanvasStore from '@/app/store/canvasStore';

const ButtonCreateOutfit = () => {

    const { saveCanvasToLocalStorage } = useCanvasStore();

    return (
        <div>
            <button
            onClick={saveCanvasToLocalStorage}
            className="m-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Save Changes
        </button>
        </div>
    )
}

export default ButtonCreateOutfit