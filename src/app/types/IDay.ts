import { Document, ObjectId, Types } from "mongoose";
import {z} from 'zod'
import { IDayResult } from "../services/daysService";

export default interface IDay extends Document{
    userId: ObjectId;
    date: Date;
    dayDesc: string;
    looks: Types.ObjectId [];
    comments: string;
    weather: string;
}


export const daySchemaZod = z.object({
    date: z.date(), 
    dayDesc: z.enum([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ]),
    comments: z.string().optional(), 
    weather: z.string().min(10, "Weather description is required"), 
});

export type IDayType = z.infer<typeof daySchemaZod> 

export type IDayTypeWithId = z.infer<typeof daySchemaZod> & {
    _id: string;
};

export interface IOutfitsModalProps {
    isOpen: boolean; 
    setIsOpen: (bool:boolean) => void;
    dateDetails: IDayResult;
    date: string;
  }
