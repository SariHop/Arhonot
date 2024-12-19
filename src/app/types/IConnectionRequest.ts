import { Document, ObjectId } from "mongoose";
import {z} from 'zod'
import { Types  } from "mongoose";


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


export type RequestTypeFotCollapse = {
    key: string;
    sender: ObjectId;
    status: string;
    sender_name: string;
    date: Date;
    label: React.ReactNode;
    children: React.ReactNode;
    readen: boolean;
  };

  
export type IConnectionRequestType = z.infer<typeof ConnectionRequestSchemaZod> 

export type IConnectionRequestTypeWithId = z.infer<typeof ConnectionRequestSchemaZod> & {
    _id: string;
};
// טיפוס ליצירת בקשת חיבור
export type CreateConnectionRequest = {
    userIdSender:Types.ObjectId;
    userIdReciver:Types.ObjectId;
    status: string;
    readen: boolean;
    date: Date;
    sendersName: string;

  };

  const ConnectionRequestSchema = z.object({
    userIdSender: z.string(), 
    userIdReciver: z.string(), 
    status: z.string(),
    readen: z.boolean(),
    date: z.date(),
    sendersName: z.string(),
  });
  
  // יצירת טיפוס TypeScript מהסכימה
  export type IConnectionRequest2 = z.infer<typeof ConnectionRequestSchema>;
