import IOutfit from "../types/IOutfit";
import { WeatherData } from "../types/IWeather"
import { fetchUserOutfits, getMaxTemperatureForDate } from "./weatherService"

export const recommendedLooks = async (list: WeatherData[], date: Date, userId: string, sensitive: string) => {
  try {
    const dailyWeather = getMaxTemperatureForDate(list, date) || 15;
    const outfits = await fetchUserOutfits(userId);

    if (!outfits || outfits.length === 0) {
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

      if (dailyWeather >= hotLevel && rangeWheather >= 5) {
        suitableForWeather = season === "קיץ" ? 1 : 0;
      } else if (dailyWeather >= warmLevel && rangeWheather >= 4 && rangeWheather <= 6) {
        suitableForWeather = season === "אביב" || season === "סתיו" ? 1 : 0;
      } else if (dailyWeather >= coolLevel && rangeWheather >= 2 && rangeWheather <= 5) {
        suitableForWeather = season === "אביב" || season === "סתיו" ? 1 : 0;
      } else if (dailyWeather < coolLevel && rangeWheather <= 2) {
        suitableForWeather = season === "חורף" ? 1 : 0;
      } else {
        return []; // לא מתאים למזג האוויר הנוכחי
      }

      const rate = 0.5 * (appearanceCount || 0) + 0.3 * favorite + 0.2 * suitableForWeather;
      rateOutfits.push({ rate, outfit: rest as IOutfit });
    });
    console.log(rateOutfits);
    
    // מיון לפי ציון ודירוג חמשת המובילים
    const topOutfits = rateOutfits.sort((a, b) => b.rate - a.rate).slice(0, 5).map(({ outfit }) => outfit); // מחזירים רק את האאוטפיטים

    return topOutfits;
  } catch (error) {
    console.error("Error in recommendedLooks function:", error);
    throw new Error("Failed to get recommended looks");
  }
};
