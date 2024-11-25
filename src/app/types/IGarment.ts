import { Document, ObjectId } from "mongoose";
import { z } from 'zod';

export default interface IGarment extends Document {
    userId: ObjectId;
    img: string;
    desc: string;
    season: string;
    category: string;
}

const validSeasons = ["חורף", "אביב", "קיץ", "סתיו"] as const; 
const validCategories = ["חולצה", "מכנסיים", "שוליים", "מעיל", "סוודר", "שמלה", "חצאית"] as const;  

export const garmentSchemaZod = z.object({
    desc: z.string().optional(), // אפשרות להיות ריק או לא להימסר
    season: z.enum(validSeasons, { message: "Season must be one of the valid seasons" }), 
    category: z.enum(validCategories, { message: "Category must be one of the valid categories" }),
});

export type IGarmentType = z.infer<typeof garmentSchemaZod>;

export type IGarmentTypeWithId = IGarmentType & {
    _id: string;
};
