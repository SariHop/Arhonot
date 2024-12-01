import { Document, ObjectId } from "mongoose";
import { z } from 'zod';
import { fetchSeasons, fetchTags, fetchTypes } from "../services/categoriesService";

export default interface IGarment extends Document {
    userId: ObjectId;
    img: string;
    desc: string;
    season: string;
    range: number;
    category: string;
    color: string
    link: string
    price: number;
    tags: string[];
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
    range: z.number().min(1, { message: "Range must be at least 1" }).max(7, { message: "Range must be at most 7" }),
    color: z.string().optional(), // אופציונלי
    link: z.string().url({ message: "Invalid URL format" }).optional(), // לינק חוקי
    price: z.string().refine((val) => /^[0-9]*$/.test(val), {
      message: "Price must be a number",
    }).transform((val) => (val === "" ? 0 : parseFloat(val))), 
    tags: z.array(z.string()).refine(
        async (tags) => {
            const validTags = await fetchTags(); // פונקציה שמחזירה מערך ערכים חוקיים
            return tags.every(tag => validTags.includes(tag));
        },
        { message: "Some tags are invalid" }
    ),
});

export type IGarmentType = z.infer<typeof garmentSchemaZod>;

export type IGarmentTypeWithId = IGarmentType & {
    _id: string;
};
