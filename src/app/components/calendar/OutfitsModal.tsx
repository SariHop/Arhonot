import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { IOutfitsModalProps } from '../../types/IDay';
import UserOutfits from './UserOutfits';
import { getChildrenLooks, IDayResult } from '@/app/services/daysService';
import axios from 'axios';
import { toast } from 'react-toastify';



const OutfitsModal: React.FC<IOutfitsModalProps> = ({isOpen, setIsOpen, dateDetails, date}) => {

  const [childrensLooks, setChildrensLooks] = useState<Record<string, IDayResult>>({});

    
    useEffect(() => {
      console.log("the date is", date)
        loadDayLooks();
        console.log("date details", dateDetails);
        
    }, [dateDetails]);

    const loadDayLooks = async () => {
      try {
        // const response = await getChildrenLooks( String(dateDetails.userId), date); // החלף ב-ID של המשתמש
        const response = await getChildrenLooks("675007691ba3350d49f9b4e5", date); // החלף ב-ID של המשתמש

        const  days  = response; // נניח ש-days מחזיק את נתוני הימים
        setChildrensLooks(days);
      } 
      catch (error) {
        console.error("Failed to process user looks:", error);
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data?.error || "Unknown server error";
        toast.error(`Server Error: ${serverError}`);
      } else {
        toast.error("An unexpected error occurred");
      }
      }
    };
  return (
    <Modal
          title="הלוקים שלך "
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          footer={null}
        >
          <UserOutfits looks={dateDetails?.looks || []}/>
          {Object.entries(childrensLooks).map(([name, child], index) => {
            if(child?.looks.length>0){
            return (<div key={index}>
              <p className='font-semibold'>הלוקים של {name}</p>
              <UserOutfits  looks={child?.looks || []}/>
            </div>)
            }
          })}

        </Modal>
  )
}

export default OutfitsModal