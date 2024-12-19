"use client"
import React from 'react'
import useCanvasStore from '@/app/store/canvasStore';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

const ButtonCreateOutfit = () => {

    const router = useRouter()
    const { garments, canvas , setCanvasurl } = useCanvasStore();

    const handleCreate = ()=>{
        if (!canvas) return;

        const dataURL = canvas.toDataURL({
            format: "png",
            quality: 1,
            multiplier: 1,
        });

        setCanvasurl(dataURL)
        router.push("/pages/user/outfit_form")
    }

    return (
        <div>
            <Button
                variant="contained"
                disabled={garments.length === 0}
                onClick={handleCreate}
            >
                צור לוק
            </Button>
        </div>
    )
}

export default ButtonCreateOutfit