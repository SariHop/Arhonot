"use client"
import React, { useState } from "react";
import { Collapse } from "antd";
import * as fabric from 'fabric';
import { ShowGalleryProps } from "@/app/types/props";

const ShowGallery: React.FC<ShowGalleryProps> = ({ canvas }) => {
  const [activeKey, setActiveKey] = useState<string[]>([]);
  const handleCollapseChange = (key: string[]) => {
    setActiveKey(key);
  };

  const addImage = async () => {

    // recive in functhion the url and the garmentID 
    // sent the functhion to gallery component

    // need to update an array of garments

    if (!canvas) return;

    const imageUrl =
      "https://images.pexels.com/photos/1340389/pexels-photo-1340389.jpeg?auto=compress&cs=tinysrgb&w=400";

    try {
      const img = await fabric.Image.fromURL(imageUrl, {
        crossOrigin: "anonymous",
      });
      img.set({
        left: canvas.width! / 2 - img.width! / 2,
        top: canvas.height! / 2 - img.height! / 2,
        scaleX: 0.5,
        scaleY: 0.5,
      });

      canvas.add(img);
      canvas.requestRenderAll();
    } catch (error) {
      console.error("Failed to load image:", error);
    }
  };

  return (
    <div>
      {/* Warning: [rc-collapse] `children` will be removed in next major version. Please use `items` instead.
      warning from antD */}
      <Collapse
        ghost
        expandIconPosition="end"
        activeKey={activeKey}
        onChange={handleCollapseChange}
        style={{
          backgroundColor: '#F2F996',
          // position: 'absolute',
          bottom: '20%',
          width: '100%',
          borderRadius: '0'
        }}
      >
        <Collapse.Panel header="בחירת פריט מהגלריה" key="1"  >
          <div className="p-4">
            {/* gallery addimage */}
            <button onClick={addImage}>Add Image</button>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

export default ShowGallery