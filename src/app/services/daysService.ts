import axios from "axios";
import { IDayWithLooks } from "../types/IDay";
import IOutfit from "../types/IOutfit";
import { Types } from "mongoose";
import { getMinTemperatureForDate, getMaxTemperatureForDate } from "./weatherService"
import { WeatherData } from "../types/IWeather";
import { AxiosError } from 'axios';

export const userLooks = async (month: number, year: number, userId: Types.ObjectId | null) => {
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

export const getDay = async (userId: Types.ObjectId | null, date: Date) => {
  try {
    const response = await axios.post(`/api/dayRoute/${userId}`, {
      date,
    });
    console.log("response: ", response);
    return response;
  } catch (error: unknown) {
    console.error("Failed to fetch day:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 404) {
          console.warn("No record found for the provided user ID and date.");
          throw new Error("No record found for the provided user ID and date.");
        }
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

type ServerResponse = {
  success: boolean;
  data?: IOutfit; // או טיפוס מתאים למה שהשרת מחזיר
  error?: string;
};

export const setLooksForDay = async (
  list: WeatherData[],
  userId: Types.ObjectId,
  date: Date,
  looks: IOutfit[]
): Promise<ServerResponse> => {
  try {
    const minTemp = getMinTemperatureForDate(list, date);
    const maxTemp = getMaxTemperatureForDate(list, date);
    const weather = `${minTemp}-${maxTemp}`;

    const response = await axios.put('/api/dayRoute', {
      userId,
      date,
      looks,
      weather,
    });

    // אם סטטוס התגובה מציין הצלחה
    if (response.status === 200 || response.status === 201 || response.status === 202) {
      return { success: true, data: response.data };
    } else {
      // אם הסטטוס לא מציין הצלחה, החזר שגיאה
      return { success: false, error: `Error: ${response.status} - ${response.statusText}` };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      // טיפול בשגיאות שנגרמו על ידי Axios
      console.error('Axios error:', error.response?.data);
      return { success: false, error: error.response?.data?.message || 'Unknown error' };
    } else {
      // טיפול בשגיאות כלליות שלא נגרמו על ידי Axios
      console.error('Unexpected error:', error);
      return { success: false, error: 'Unknown error' };
    }
  }
};
