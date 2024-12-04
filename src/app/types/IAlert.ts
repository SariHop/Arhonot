import { Document, ObjectId } from "mongoose";
import {z} from 'zod'

export default interface IAlert extends Document{
    userId: ObjectId;
    desc: string;
    title: string;
    readen: boolean;
    date: Date;
}


export const alertSchemaZod = z.object({
    desc: z.string().nullable(),
    title: z.string().min(10,"Title is required"),
    readen: z.boolean(), 
    date: z.date(),
});

export type IAlertType = z.infer<typeof alertSchemaZod> 

export type IAlertTypeWithId = z.infer<typeof alertSchemaZod> & {
    _id: string;
};

