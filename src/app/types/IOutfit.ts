import { Document, ObjectId } from "mongoose";
import { z } from "zod";
import { fetchSeasons, fetchTags } from "../services/categoriesService";

// ממשק IOutfit
export default interface IOutfit extends Document {
  userId: ObjectId;
  clothesId: ObjectId[];
  desc: string;
  season: string;
  tags: string[];
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
  tags: z.array(z.string()).refine(
    async (tags) => {
      const validTags = await fetchTags(); // פונקציה שמחזירה מערך ערכים חוקיים
      return tags.every(tag => validTags.includes(tag));
    },
    { message: "Some tags are invalid" }
  ),
  img: z.string().url({ message: "Invalid image URL" }), // אימות URL לתמונה
});

// סוגים
export type IOutfitType = z.infer<typeof outfitSchemaZod>;

export type IOutfitTypeWithId = IOutfitType & {
  _id: string;
};


export interface IOutfitProps {
  outfit: IOutfit;
  closeModal: () => void;
}