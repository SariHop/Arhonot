import { Document, ObjectId } from "mongoose";
import { z } from 'zod';
import { fetchSeasons, fetchTypes } from "../services/categoriesService";

export default interface IGarment extends Document {
    userId: ObjectId;
    img: string;
    desc: string;
    season: string;
    category: string;
}


export const garmentSchemaZod = z.object({
    desc: z.string().optional(), // אפשרות להיות ריק או לא להימסר
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
});

export type IGarmentType = z.infer<typeof garmentSchemaZod>;

export type IGarmentTypeWithId = IGarmentType & {
    _id: string;
};
