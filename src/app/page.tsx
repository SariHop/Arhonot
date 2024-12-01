"use client"
import React, { useState } from 'react';
import { ToastContainer} from "react-toastify";
import UploadImage from './components/imagesUploud/UploudButton';

const ExamplePage: React.FC = () => {
  const [x, setX]=useState("")

  return (
    <div className="p-4">
      {/*react-toastify הצגת שגיאות עם שימוש בספריה */}
      <ToastContainer />
      <UploadImage setCloudinary={setX}/>


    </div>
  );
};

export default ExamplePage;
