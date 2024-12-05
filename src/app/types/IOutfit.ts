import { Document, ObjectId } from "mongoose";
import { z } from "zod";
import { fetchSeasons, fetchTypes } from "../services/categoriesService";

// ממשק IOutfit
export default interface IOutfit extends Document {
  userId: ObjectId;
  clothesId: ObjectId[];
  desc: string;
  season: string;
  category: string;
  img: string;
  favorite: number;
  rangeWheather: number;
}

// סכמת Zod
export const outfitSchemaZod = z.object({
  desc: z.string().optional(), // desc אופציונלי
  season: z.string().refine(
    async (season) => {
      const validSeasons = await fetchSeasons();
      return validSeasons.includes(season);
    },
    { message: "Invalid season" }
  ),
  category: z.string().refine(
    async (category) => {
      const validCategories = await fetchTypes();
      return validCategories.includes(category);
    },
    { message: "Invalid category" }
  ),
  img: z.string().url({ message: "Invalid image URL" }), // אימות URL לתמונה
});

// סוגים
export type IOutfitType = z.infer<typeof outfitSchemaZod>;

export type IOutfitTypeWithId = IOutfitType & {
  _id: string;
};
