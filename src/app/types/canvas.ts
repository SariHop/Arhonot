import * as fabric from 'fabric';

export type CanvasContextType = {
    canvas: fabric.Canvas | null;
    addImageToCanvas: (imageUrl: string, imageId: string | unknown) => Promise<void>;
    arreyOfGarmentInCanvas: string[]
    exportCanvasAsImage: () => void
} | null;

export interface OutfitFormProps {
    closeModal: () => void;
    outfitImgurl: string;
}

export interface WindowSize {
    width: number,
    height: number,
}

