import axios from "axios";
import { IDayWithLooks } from "../types/IDay";



export const userLooks = async (month: number, year: number, userId: string) => {
  try {
    const response = await axios.post(`/api/dayRoute/daysOutfits/`, { userId: userId, month, year });
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


export const getChildrenLooks = async (userId: string, date: string) => {
  try {
    const response = await axios.post(`/api/outfitRoute/childrensOutfits/`, {
      userId: userId,
      date
    });

    type DayWithName = IDayWithLooks & { childName: string };
    const days: DayWithName[] = response.data.days;
    const result: Record<string, IDayWithLooks> = {};

    days.forEach((day: IDayWithLooks & { childName: string }) => {
      const { childName, ...rest } = day;
      result[childName] = rest as IDayWithLooks;
    });
    return result;
  } catch (error: unknown) {
    console.error("Failed to fetch childrens looks:", error);
    throw error;
  }
};

export const getDay = async (userId: string, date: Date) => {
  try {
    const response = await axios.post(`/api/dayRoute/${userId}`, {
      date,
    });
    console.log("response: ",response);
    return response;
  } catch (error: unknown) {
    console.error("Failed to fetch day:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Server returned an error:", error.response.data);
        throw new Error(
          `Error: ${error.response.data?.error || "Unknown server error"}. Status: ${error.response.status
          }`
        );
      } else if (error.request) {
        console.error("No response received from the server:", error.request);
        throw new Error("Failed to connect to the server. Please try again later.");
      } else {
        console.error("Request error:", error.message);
        throw new Error("An error occurred while making the request.");
      }
    } else if (error instanceof Error) {
      throw new Error(`Unexpected error: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

