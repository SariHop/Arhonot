import { Modal } from 'antd'
import React from 'react'
import IOutfit from '../types/IOutfit';
import { IOutfitsModalProps } from '../types/IDay';
import Image from 'next/image'


const OutfitsModal: React.FC<IOutfitsModalProps> = ({isOpen, setIsOpen, dateDetails}) => {
  return (
    <Modal
          title="הלוקים ליום הנבחר"
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          footer={null}
        >
          <div className="flex overflow-x-auto p-2 custom-scrollbar"
          >

            {(dateDetails?.looks || []).map((look:IOutfit, index) => (
              <div
                key={index}
                className="m-6 flex flex-col items-center justify-center w-[150px] shrink-0"
                >
                <Image
                  src={look.img}
                  alt={`Look ${index + 1}`}
                  width={200}
                  height={300}
                />
                <span className="mt-2 text-sm">עונה: {look.season}</span>
              </div>
            ))}
          </div>
        </Modal>
  )
}

export default OutfitsModal