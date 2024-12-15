import React, {  useState } from 'react'
import Image from 'next/image'
import { Rate } from 'antd'
import IOutfit from '@/app/types/IOutfit'
import { updateOutfitFavorite } from '@/app/services/outfitServices'

export interface IUserOutfits{
    looks: IOutfit[];
}

const UserOutfits: React.FC<IUserOutfits> = ({looks}) => {
    const [outfits, setOutfits] = useState<IOutfit[]>(looks || []);

    // Update the outfits state when dateDetails changes
    // useEffect(() => {
    //     if (looks) {
    //     setOutfits(looks);
    //     }
    // }, [looks]);
    

    const updateRate = async (outfitId: string, value: number) => {
        try {
            // עדכון אופטימיסטי של ה-UI
            setOutfits((prevOutfits: IOutfit[]) => {
                return prevOutfits.map((outfit: IOutfit) => {
                    if (String(outfit._id) === outfitId) {
                        return {
                            ...outfit,
                            favorite: value
                        } as IOutfit;  // הוספת type assertion
                    }
                    return outfit;});
            });
            const response = await updateOutfitFavorite(outfitId, value);
        
            if (!response) {
                // שחזור המצב הקודם במקרה של כישלון
                setOutfits((prevOutfits: IOutfit[]) => {
                    return prevOutfits.map((outfit: IOutfit) => {
                        if (String(outfit._id) === outfitId) {
                            return outfit;
                        }
                        return outfit;
                    });
                });
            }

        } catch (error: unknown) {
            console.error(error);
        }
    };


  return (
    <div className="flex overflow-x-auto p-2 custom-scrollbar mb-3"
          >
            {outfits.map((look:IOutfit, index:number) => (
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
                <Rate onChange={(value:number) => updateRate(String(look._id), value)} value={look.favorite} />
              </div>
            ))}
          </div>
  )
}

export default UserOutfits