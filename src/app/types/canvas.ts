import * as fabric from 'fabric';

export type CanvasContextType = {
    canvas: fabric.Canvas | null;
    addImageToCanvas: (imageUrl: string, imageId: string) => Promise<void>;
    arreyOfGarmentInCanvas: string[]
};