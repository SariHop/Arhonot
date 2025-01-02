"use client";
import React, { useState } from 'react';
import useCanvasStore from '@/app/store/canvasStore';
import { Button, Dialog, DialogContent, CircularProgress, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { cloudinaryUploud } from '@/app/services/image/saveToCloudinary';
import { toast } from 'react-toastify';

const ButtonCreateOutfit = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { garments, canvas, setCanvasurl } = useCanvasStore();

    const handleCreate = () => {
        if (!canvas) return;
        setLoading(true);

        const saveImageToCloudinary = async () => {
            // שמירת הקנבס כניתוב לתמונה ושמירת הניתוב כקובץ תמונה בענן
            try {
                const dataURL = canvas.toDataURL({
                    format: "png",
                    quality: 1,
                    multiplier: 1,
                });
                const imageUrl = await cloudinaryUploud(dataURL);
                setCanvasurl(imageUrl.imageUrl);
                router.push("/pages/user/outfit_form");
            } catch (error) {
                console.error("Image upload error:", error);
                toast.error("שגיאה בטעינת הלוק");
            } finally {
                setLoading(false);
            }
        };
        saveImageToCloudinary();
    };

    return (
        <div className="my-auto">
            <Button
                variant="contained"
                disabled={garments.length === 0 || loading}
                onClick={handleCreate}
            >
                צור לוק
            </Button>

            {/* מודל לטעינה */}
            <Dialog open={loading} PaperProps={{ style: { textAlign: "center" } }}>
                <DialogContent>
                    <CircularProgress />
                    <Typography variant="body1" style={{ marginTop: 16 }}>
                        טוען, אנא המתן...
                    </Typography>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ButtonCreateOutfit;
