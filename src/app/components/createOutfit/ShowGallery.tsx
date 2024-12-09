"use client"
import React, { useState } from "react";
import { Collapse } from "antd";
import Gallery from "../galery/Galery";

const ShowGallery: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string[]>([]);
  const handleCollapseChange = (key: string[]) => {
    setActiveKey(key);
  };

  return (
    <div>
      {/* Warning: [rc-collapse] `children` will be removed in next major version. Please use `items` instead.
      warning from antD */}
      {/* לקלוד היה עצוב מאד יפה לגלריה */}
      <Collapse
        ghost
        expandIconPosition="end"
        activeKey={activeKey}
        onChange={handleCollapseChange}
        style={{
          backgroundColor: '#F2F996',
          bottom: '20%',
          width: '100%',
          borderRadius: '0'
        }}
      >
        <Collapse.Panel header="בחירת פריט מהגלריה" key="1"  >
          <div className="p-4">

            {/* gallery addimage */}
            <Gallery isForOutfit={true}/>
            
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

export default ShowGallery