"use client";

import React, { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { FilePondFile } from 'filepond';
import "filepond/dist/filepond.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { removeBackground } from "@/app/services/image/removeBG";
import Modal from "@/app/components/imagesUploud/ModalImage";

registerPlugin( FilePondPluginFileValidateType);

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

      <FilePond
        files={files}
        // https://github.com/pqina/react-filepond/issues/245
        onupdatefiles={(fileItems: FilePondFile[]) => {
          setFiles(fileItems.map((f: FilePondFile) => f.file as File));
        }}
        allowMultiple={false}
        acceptedFileTypes={["image/*"]}
        labelIdle=' גרור ושחרר את הקובץ שלך או <span class="filepond--label-action">ייבא קובץ מקומי</span>'
        server={{
          process: (fieldName, file, metadata, load) => {
            const actualFile = file as unknown as File;
            handleProcess(actualFile);
            load(file.name);
          },
        }}
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
