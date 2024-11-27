"use client";

import React, { useState } from "react";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { removeBackground } from "@/app/services/imageService"
import Image from 'next/image'

const UploadImage = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [fileWithNoBG, setFileWithNoBG] = useState<string | null>(null);

  const handleProcess = async (file: File) => {
    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    const removeBG = await removeBackground(formData) as string
    setFileWithNoBG(removeBG)
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        server={{
          // process: (fieldName, file, metadata, load, error, progress, abort) => {
            process: (fieldName, file, metadata, load) => {
            const actualFile = file as unknown as File;
            handleProcess(actualFile);
            load(file.name);
          },
        }}
        name="file"
        labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
      />

      {
        fileWithNoBG ?
          <Image
            src={fileWithNoBG}
            width={500}
            height={500}
            alt="Picture of the author"
          /> : <h6>העלה תמונה</h6>
      }
    </div>
  );
};

export default UploadImage;
