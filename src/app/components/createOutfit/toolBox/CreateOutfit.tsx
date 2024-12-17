"use client"
import React, { useState } from 'react'
import OutfitForm from '@/app/components/createOutfit/FormCreateOutfit';
import useCanvasStore from '@/app/store/canvasStore';
import { Button } from '@mui/material';

const ButtonCreateOutfit = () => {
    const [outfitImgurl, setOutfitImgurl] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const showModal = () => { setOpenModal(true); };
    const closeModal = () => { setOpenModal(false); };

    const { canvas, garments } = useCanvasStore();

    const exportCanvasAsImage = () => {
        if (!canvas) return;

        const dataURL = canvas.toDataURL({
            format: "png",
            quality: 1,
            multiplier: 1,
        });
        setOutfitImgurl(dataURL)
        showModal()
    };


    return (
        <div>
            <Button
                variant="contained"
                disabled={garments.length === 0}
                onClick={exportCanvasAsImage}
            // className="m-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                צור לוק
            </Button>
            {openModal && <OutfitForm closeModal={closeModal} outfitImgurl={outfitImgurl} />}
        </div>
    )
}

export default ButtonCreateOutfit