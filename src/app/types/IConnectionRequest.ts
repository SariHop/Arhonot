import { Document, ObjectId } from "mongoose";
import {z} from 'zod'

export default interface IConnectionRequest extends Document{
    userIdSender: ObjectId;
    userIdReciver: ObjectId;
    status: boolean;
    readen: boolean;
}


export const ConnectionRequestSchemaZod = z.object({
    status: z.boolean(), 
    readen: z.boolean(), 
});

export type IConnectionRequestType = z.infer<typeof ConnectionRequestSchemaZod> 

export type IConnectionRequestTypeWithId = z.infer<typeof ConnectionRequestSchemaZod> & {
    _id: string;
};

