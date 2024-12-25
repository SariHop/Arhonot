import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "@/app/services/garmentService";
import { Position, WeatherData } from "@/app/types/IWeather";
import { Types } from "mongoose";

export const fetchWeatherData = async () => {
  try {
    const position = await new Promise<Position>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    console.log(position);
    const { latitude, longitude } = position.coords;

    const response = await axios.get(`${apiUrl}weatherRoute`, {
      params: {
        lat: latitude,
        lon: longitude,
      },
    });

    return response.data;
  } catch (error) {
    // טיפול בשגיאות במקרה של בעיות עם הגישה למיקום
    if (error instanceof Error && error.message.includes("User denied")) {
      toast.error("לא ניתן לגשת למיקום שלך. אנא אפשר את גישת המיקום.");
    } else {
      throw error;
    }
  }
};


// פונקציה לחישוב הטמפרטורה המקסימלית ליום מסוים
export const getMaxTemperatureForDate = (list: WeatherData[], targetDate: Date) => {
  // return 5;
  try{
  const dailyForecasts = list.filter((entry) => {
    // חילוץ התאריך (ללא השעה) מהשדה dt_txt
    const date = entry.dt_txt.split(" ")[0];
    return date === targetDate.toISOString().split("T")[0];
  });

  // אם אין נתונים ליום המבוקש, נחזיר null
  if (dailyForecasts.length === 0) {
    return null;
  }

  const maxTemp = dailyForecasts.reduce((max, entry) => {
    return Math.max(max, entry.main.temp_max);
  }, -Infinity);
  return maxTemp;
}catch(error){
  console.log("error geting the max temperature: ", error);
  toast.error("שגיאה בקבלת הטמפרטורה המקסימלית ליום המבוקש");
  throw error;
}
};

export const getMinTemperatureForDate = (list: WeatherData[], targetDate: Date) => {
  try{
  const dailyForecasts = list.filter((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    return date === targetDate.toISOString().split("T")[0];
  });

  // אם אין נתונים ליום המבוקש, נחזיר null
  if (dailyForecasts.length === 0) {
    return null;
  }

  const minTemp = dailyForecasts.reduce((min, entry) => {
    return Math.min(min, entry.main.temp_min); // שימוש במפתח temp_min
  }, Infinity); // ערך התחלתי חיובי אינסופי
  return minTemp;
}catch(error){
  console.log("error geting the min temperature: ", error);
  toast.error("שגיאה בקבלת הטמפרטורה המינימלית ליום המבוקש");
  throw error;
}
};


export const getAverageTemperatureForDate = (list: WeatherData[], targetDate: Date) => {
  try{
  const minTemp = getMinTemperatureForDate(list, targetDate);
  const maxTemp = getMaxTemperatureForDate(list, targetDate);

  if (minTemp === null || maxTemp === null) {
    return null; // אין נתונים ליום הזה
  }

  // להבטיח שהערכים הם מספרים
  const minTempNum = parseFloat(minTemp.toString());
  const maxTempNum = parseFloat(maxTemp.toString());

  return Math.round((minTempNum + maxTempNum) / 2);
}catch(error){
  console.log("error geting the average temperature: ", error);
  toast.error("שגיאה בקבלת הטמפרטורה הממוצעת ליום המבוקש");
}
};

export const fetchUserOutfits = async (userId: Types.ObjectId | null) => {
  try {
    const response = await axios.get(`${apiUrl}outfitRoute/userOutfits/${userId}`);
    return response.data.data;
  }
  catch (error) {
    console.log("לא הצלחנו לגשת לנתוני הלוקים שלך");
    throw error;
  }
};

