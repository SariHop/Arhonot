import axios from "axios";
import IDay from "../types/IDay";
import IOutfit from "../types/IOutfit";
// import { Types } from "mongoose";

export type IDayResult = IDay  & {
    looks: IOutfit[];
  }

export const dayLooks = async ( userId: string, month: number, year:number) => {
    try {
        const response = await axios.post(`/api/dayRoute/daysOutfits/`, {userId: "675007691ba3350d49f9b4e5", month, year});
        console.log("response",response.data);
        
        return response.data;
      } catch (error: unknown) {
        console.error("Failed to fetch user looks:", error);
        throw error;
      }
}


export const looks = async (month: number, year:number, userId: string) => {
        try {
          const days: IDayResult[] = await dayLooks(
            userId,
            month,
            year
          );
      
        //   const outfitMap: Record<string, IOutfit> = {};
        //   days.forEach((day)=>{
        //     day.looks.forEach((outfit: IOutfit) => {
        //         outfitMap[String(outfit._id)] = outfit;
        //     })
        //     });
          
      
          const result: Record<string, IDayResult> = {};

          days.forEach((day: IDayResult) => {
            const formattedDate = new Date(day.date).toISOString().split("T")[0];
            console.log("day", formattedDate);
            result[formattedDate] = day;
          });
          return result;

          
        //   days.forEach((day: IDay) => {
            // המרה של המסמך למבנה פשוט
            // const plainDay = JSON.parse(JSON.stringify(day));
            // const { date, looks, ...rest } = plainDay;
            // console.log("plainDay", plainDay);
            // console.log("date", date.toISOString());

        //     const {date, looks, ...rest} = day;
        //     result["fghj"] = {
        //       ...rest,
        //       date: new Date(date), // המרה חזרה ל-Date
        //       looks: looks.map((lookId: string) => outfitMap[String(lookId)]),
        //     };
        //   });


//     // const outfitMap: Record<string, Partial<IOutfit>> = {};
//     // outfits.forEach((outfit: IOutfit) => {
//     //   outfitMap[String(outfit._id)] = {
//     //     favorite: outfit.favorite,
//     //     tags: outfit.tags,
//     //     season: outfit.season,
//     //     desc: outfit.desc,
//     //     img: outfit.img,
//     //   };
//     // });



//     const result: Record<string, Omit<IDay, "looks"> & { looks:IOutfit[] }> = {};
//     days.forEach((day:IDay) => {

//       const { date, looks, ...rest } = day;
//       result[date.toISOString()] = {
//         ...rest, // כל התכונות של היום
//         date, // שמירה בפורמט Date
//         looks: looks.map((lookId) => outfitMap[String(lookId)]),
//       };
//     });

//     return result; // מחזיר Dictionary של ימים
//   } 
    }catch (error: unknown) {
    console.error("Failed to process user looks:", error);
    throw error;
  } 
};

