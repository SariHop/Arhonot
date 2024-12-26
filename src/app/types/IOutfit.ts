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
  // canvasJson:object
}

// סכמת Zod
export const outfitSchemaZod = z.object({
  userId: z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "מזהה משתמש אינו תקין" }), 
  clothesId: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "מזהה בגד אינו תקין" })), 
  desc: z.string().optional(), 
  season: z.string().refine(
    async (season) => {
      const validSeasons = await fetchSeasons();
      return validSeasons.includes(season);
    },
    { message: "עונה אינה תקפה" }
  ),
  tags: z.array(z.string()).refine(
    async (tags) => {
      const validTags = await fetchTags();
      return tags.every(tag => validTags.includes(tag));
    },
    { message: "ישנם תגיות שאינן תקפות" }
  ),
  img: z.string().url({ message: "כתובת URL של תמונה אינה תקפה" }),
  favorite: z.number().int().min(0, { message: "הדירוג חייב להיות לפחות 0" }).max(5, { message: "הדירוג חייב להיות עד 5" }), 
  rangeWheather: z.number().min(1, { message: "הטווח חייב להיות לפחות 1" }).max(7, { message: "הטווח חייב להיות עד 7" }), 
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