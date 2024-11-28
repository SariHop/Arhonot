"use client";

import React, { useState } from "react";
import { FilePond } from "react-filepond";
import { FilePondFile } from 'filepond';
import "filepond/dist/filepond.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { removeBackground } from "@/app/services/image/removeBG";
import Modal from "@/app/components/imagesUploud/ModalImage";

const UploadImage = ({ setCloudinary }: { setCloudinary: (url: string) => void }) => {

  const [files, setFiles] = useState<File[]>([]);
  const [fileWithNoBG, setFileWithNoBG] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFileWithNoBG(null);
    setFiles([]);
  };

  const handleProcess = async (file: File) => {

    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");
    openModal();
    try {
      const removeBG = await removeBackground(formData) as string;
      setFileWithNoBG(removeBG);
    } catch (error) {
      closeModal()
      console.error("Error removing background:", error);
      toast.error("שגיאה בעת הסרת הרקע. נסה שנית!");
    }
  };


  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <ToastContainer />
      <FilePond
        files={files}
        // https://github.com/pqina/react-filepond/issues/245
        onupdatefiles={(fileItems: FilePondFile[]) => {
          setFiles(fileItems.map((f: FilePondFile) => f.file as File));
        }}
        allowMultiple={false}
        server={{
          process: (fieldName, file, metadata, load) => {
            const actualFile = file as unknown as File;
            handleProcess(actualFile);
            load(file.name);
          },
        }}
        name="file"
        labelIdle=' גרור ושחרר את הקובץ שלך או <span class="filepond--label-action">יבא קובץ מקומי</span>'
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          fileWithNoBG={fileWithNoBG}
          setCloudinary={setCloudinary}
        />
      )}
    </div>
  );
};

export default UploadImage;
