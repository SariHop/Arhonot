import axios from "axios";
import IDay from "../types/IDay";
import IOutfit from "../types/IOutfit";
// import { Types } from "mongoose";

export type IDayResult = IDay & {
  looks: IOutfit[];
};

export const dayLooks = async (userId: string, month: number, year: number) => {
  try {
    const response = await axios.post(`/api/dayRoute/daysOutfits/`, {
      userId: userId,
      month,
      year,
    });
    console.log("response", response.data);

    return response.data;
  } catch (error: unknown) {
    console.error("Failed to fetch user looks:", error);
    throw error;
  }
};

export const looks = async (month: number, year: number, userId: string) => {
  try {
    const days: IDayResult[] = await dayLooks(userId, month, year);

    const result: Record<string, IDayResult> = {};

    days.forEach((day: IDayResult) => {
      const formattedDate = new Date(day.date).toISOString().split("T")[0];
      console.log("day", formattedDate);
      result[formattedDate] = day;
    });
    return result;
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


      console.log("response1234567", "response", response)
    type DayWithName = IDayResult & { childName: string };
    const days: DayWithName[] = response.data.days;

    const result: Record<string, IDayResult> = {};

    days.forEach((day: IDayResult & { childName: string }) => {
      const {childName, ...rest} = day;
      result[childName] = rest as IDayResult;;
    });
    return result;
  } catch (error: unknown) {
    console.error("Failed to fetch childrens looks:", error);
      throw error;
  }
};
