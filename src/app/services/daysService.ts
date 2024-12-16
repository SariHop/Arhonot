import axios from "axios";
import { IDayWithLooks } from "../types/IDay";



export const userLooks = async (month: number, year: number, userId: string) => {
  try {
    const response = await axios.post(`/api/dayRoute/daysOutfits/`, {userId: userId, month, year});
    const days: IDayWithLooks[] = response.data;
    console.log(response)
    const daysMap: Record<string, IDayWithLooks> = {};

    days.forEach((day: IDayWithLooks) => {
      const formattedDate = new Date(day.date).toISOString().split("T")[0];
      console.log("day", formattedDate);
      daysMap[formattedDate] = day;
    });
    return daysMap;
  } catch (error: unknown) {
    console.error("Failed to process user looks:", error);
    throw error;
  }
};


export const getChildrenLooks = async ( userId: string, date :string) => {
  try {
      const response = await axios.post(`/api/outfitRoute/childrensOutfits/`, {
        userId: userId,
        date
      });


    type DayWithName = IDayWithLooks & { childName: string };
    const days: DayWithName[] = response.data.days;
    const result: Record<string, IDayWithLooks> = {};

    days.forEach((day: IDayWithLooks & { childName: string }) => {
      const {childName, ...rest} = day;
      result[childName] = rest as IDayWithLooks;
    });
    return result;
  } catch (error: unknown) {
    console.error("Failed to fetch childrens looks:", error);
      throw error;
  }
};
