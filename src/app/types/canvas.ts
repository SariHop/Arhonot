import * as fabric from 'fabric';

export type CanvasContextType = {
    canvas: fabric.Canvas | null;
    addImageToCanvas: (imageUrl: string, imageId: string | unknown) => Promise<void>;
};