export interface ModalImageProps {
    isOpen: boolean;
    onClose: () => void;
    setCloudinary: (url: string) => void
    fileWithNoBG: string | null
}

export interface OutfitFormProps {
    closeModal: () => void;
    outfitImgurl: string;
}