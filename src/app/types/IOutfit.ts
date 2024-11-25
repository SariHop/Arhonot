import { Document, ObjectId } from "mongoose";
import {z} from 'zod'

export default interface IOutfit extends Document{
    userId: ObjectId;
    clothesId: ObjectId[];
    desc: string;
    season: string;
    category: string;
    img: string;
}


const validSeasons = ["חורף", "אביב", "קיץ", "סתיו"] as const;
const validCategories = ["חולצה", "מכנסיים", "שוליים", "מעיל", "סוודר", "שמלה", "חצאית"] as const;

export const outfitSchemaZod = z.object({
    desc: z.string().optional(), // desc אופציונלי
    season: z.enum(validSeasons, { message: "Season must be one of the valid seasons" }), // עונות תקניות
    category: z.enum(validCategories, { message: "Category must be one of the valid categories" }), // קטגוריות תקניות
    img: z.string().url({ message: "img must be a valid URL" }), // אימות URL לתמונה
});

export type IAlertType = z.infer<typeof outfitSchemaZod> 

export type IAlertTypeWithId = z.infer<typeof outfitSchemaZod> & {
    _id: string;
};

