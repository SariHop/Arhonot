"use client"

import React from 'react'
import { CldUploadWidget } from 'next-cloudinary';

const UploadButton = () => {
  

  return (

    <div className='w-32 m-10'>
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        uploadPreset = {process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
        options={{ sources: ['local', 'camera',  'url', 'google_drive'] }}
      >
        {({ open }) => {
          return (
            <button className='button-submit' onClick={() => open()}>
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
    </div>

  )
}

export default UploadButton