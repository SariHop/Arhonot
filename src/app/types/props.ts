import * as fabric from 'fabric';

export interface ModalImageProps {
    isOpen: boolean;
    onClose: () => void;
    setCloudinary: (url: string) => void
    fileWithNoBG: string | null
}

export interface ShowGalleryProps {
    canvas: fabric.Canvas |null;
  }
  