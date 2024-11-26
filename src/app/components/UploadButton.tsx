"use client"
import React, { useState } from 'react'
import { CldUploadWidget, CldImage } from 'next-cloudinary';

const UploadButton = () => {
  const [publicID, setPublicID] = useState("");

  return (
    <div className='w-32 m-10'>
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"

        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
        options={{ sources: ['local', 'camera', 'url', 'google_drive'] }}

        onSuccess={(result, options) => {
          if (result.info && typeof result.info === 'object' && 'public_id' in result.info) {
            setPublicID(result.info.public_id as string);
            options.close()
          }
        }}
      >
        {({ open }) => {
          return (
            <button className='button-submit' onClick={() => open()}>
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>

      {/* send this public id in props to save in DB */}
      {publicID && (
        <CldImage
          width="300"
          height="300"
          src={publicID}
          sizes="100vw"
          alt="Uploaded image"
          className="mt-4 object-cover"
        />
      )}
    </div>
  );
}

export default UploadButton;