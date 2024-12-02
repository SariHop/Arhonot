"use client"
import React, { useState } from 'react';
import { ToastContainer } from "react-toastify";
import Image from 'next/image';
import UploadImage from './components/imagesUploud/UploudButton';

const ExamplePage: React.FC = () => {
  const [x, setX] = useState('')

  return (
    <div className="p-4">
      {/*react-toastify הצגת שגיאות עם שימוש בספריה */}
      <ToastContainer />

      <UploadImage setCloudinary={setX}></UploadImage>

      {x && <Image
        width={300}
        height={300}
        src={x}
        alt='smthing'
      />
      }
    </div>
  );
};

export default ExamplePage;
