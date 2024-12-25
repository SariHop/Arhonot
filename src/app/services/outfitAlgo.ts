import { Types } from "mongoose";
import IOutfit from "../types/IOutfit";
import { WeatherData } from "../types/IWeather"
import { fetchUserOutfits, getMaxTemperatureForDate } from "./weatherService"
import axios from 'axios';
import useAlertsCounter from "@/app/store/alertsCounterStore"

const AlertsSetCounter = () => {
  const { increase } = useAlertsCounter();
  increase();
}
const sendNoOutfitsAlert = async (userId: Types.ObjectId | null) => {
  try {
    const response = await axios.post('/api/alertRoute', {
      userId: userId, // הנח שהמשתנה userId קיים ומכיל את מזהה המשתמש
      title: "נראה שלא יצרת עדיין לוקים",
      desc: "נא ליצור לוקים על מנת שנוכל להתאים לך לבוש בהתאמה למזג האויר",
      date: new Date(),
      readen: false,
    });
    AlertsSetCounter();
    console.log('Alert created successfully:', response.data);
  } catch (error) {
    // בדוק אם השגיאה היא מסוג AxiosError
    if (axios.isAxiosError(error)) {
      console.error('Axios error creating alert:', error.response?.data || error.message);
    } else {
      // טיפל בשגיאות אחרות
      console.error('Unknown error creating alert:', error);
    }
  }
};

const sendLitlOutfitsAlert = async (userId: Types.ObjectId | null) => {
  try {
    const response = await axios.post('/api/alertRoute', {
      userId: userId, // הנח שהמשתנה userId קיים ומכיל את מזהה המשתמש
      title: "כמות קטנה של לוקים",
      desc: "לא נמצאו מספיק לוקים המתאימים למזג האויר, מומלץ לך להוסיף לוקים מותאמים כדי לאפשר לעצמך גיוון",
      date: new Date(),
      readen: false,
    });
    AlertsSetCounter();
    console.log('Alert created successfully:', response.data);
  } catch (error) {
    // בדוק אם השגיאה היא מסוג AxiosError
    if (axios.isAxiosError(error)) {
      console.error('Axios error creating alert:', error.response?.data || error.message);
    } else {
      // טיפל בשגיאות אחרות
      console.error('Unknown error creating alert:', error);
    }
  }
};


export const recommendedLooks = async (list: WeatherData[], date: Date, userId: Types.ObjectId | null, sensitive: string) => {
  try {
    const dailyWeather = getMaxTemperatureForDate(list, date) || 15;
    console.log("daily weather", dailyWeather);
    const outfits = await fetchUserOutfits(userId);

    if (!outfits || outfits.length === 0) {
      sendNoOutfitsAlert(userId);
      throw new Error("No outfits found for the user");
    }

    const hotLevel = 30;
    const warmLevel = sensitive === "heat" ? 20 : sensitive === "cold" ? 28 : 24;
    const coolLevel = sensitive === "heat" ? 15 : sensitive === "cold" ? 19 : 17;

    const rateOutfits: { rate: number; outfit: IOutfit }[] = [];

    outfits.forEach((outfit: IOutfit & { appearanceCount: number }) => {

      const { appearanceCount, ...rest } = outfit;
      const { favorite, season, rangeWheather } = rest;
      let suitableForWeather = 0;

      if (dailyWeather >= hotLevel && rangeWheather <= 3) {
        suitableForWeather = season === "קיץ" || season === "כללי" ? 1 : 0;
      } else if (dailyWeather >= warmLevel && rangeWheather >= 2 && rangeWheather <= 4) {
        suitableForWeather = season === "אביב" || season === "סתיו" || season === "כללי" ? 1 : 0;
      } else if (dailyWeather >= coolLevel && rangeWheather > 4 && rangeWheather <= 5) {
        suitableForWeather = season === "אביב" || season === "סתיו" || season === "כללי" ? 1 : 0;
      } else if (dailyWeather < coolLevel && rangeWheather >= 5) {
        suitableForWeather = season === "חורף" || season === "כללי" ? 1 : 0;
      } else {
        return []; // לא מתאים למזג האוויר הנוכחי
      }

      const rate = 0.5 * (appearanceCount || 0) + 0.3 * favorite + 0.2 * suitableForWeather;
      rateOutfits.push({ rate, outfit: rest as IOutfit });
    });
    console.log(rateOutfits);

    // מיון לפי ציון ודירוג חמשת המובילים
    const topOutfits = rateOutfits.sort((a, b) => b.rate - a.rate).slice(0, 5).map(({ outfit }) => outfit); // מחזירים רק את האאוטפיטים
    if (topOutfits.length < 5) {
      sendLitlOutfitsAlert(userId);
    }
    return topOutfits;
  } catch (error) {
    console.error("Error in recommendedLooks function:", error);
    sendNoOutfitsAlert(userId);
    throw new Error("Failed to get recommended looks");
  }
};