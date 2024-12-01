export interface IModalProps {
    isOpen: boolean;
    onClose: () => void;
    setCloudinary: (url: string) => void
    fileWithNoBG: string | null
}