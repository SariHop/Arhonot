import { Document, ObjectId } from "mongoose";
import {z} from 'zod'

export default interface IConnectionRequest extends Document{
    userIdSender: ObjectId;
    userIdReciver: ObjectId;
    status: string;
    readen: boolean;
    date: Date;
    sendersName: string;
}


export const ConnectionRequestSchemaZod = z.object({
    status: z.string(), 
    readen: z.boolean(), 
});

export type IConnectionRequestType = z.infer<typeof ConnectionRequestSchemaZod> 

export type IConnectionRequestTypeWithId = z.infer<typeof ConnectionRequestSchemaZod> & {
    _id: string;
};

