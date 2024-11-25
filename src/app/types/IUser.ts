import { Document, ObjectId } from "mongoose";
import {z} from 'zod'

export default interface IUser extends Document{
    children: ObjectId[];
    passsword: string;
    email: string;
    age: number;
    userName: string;
    gender: string;
    dateOfBirth: Date;
    city: string;
    sensitive: string;
    userDays: ObjectId[];
} 



export const userSchemaZod = z.object({
    children: z.array(z.any()), 
    passsword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(12, "Password cannot exceed 12 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    email: z.string().email("Invalid email format"),
    age: z
        .number()
        .positive("Age must be a positive number")
        .max(120, "Age cannot exceed 120"),
    userName: z
        .string()
        .regex(/^[A-Za-z]+$/, "Username must contain only letters")
        .min(2, "Username must be at least 2 characters"),
    gender: z.enum(["זכר", "נקבה"]),
    dateOfBirth: z.date().refine(
        (date) => date <= new Date(),
        { message: "Date of birth cannot be in the future" }
    ),
    city: z.string().refine(
        async (city) => {
            // Fetch the list of cities from the API and validate.
            const cities:string[] = [];
            return cities.includes(city);
        },
        { message: "City must be one of the valid cities in Israel" }
    ),
    sensitive: z.enum(["cold", "heat", "none"]),
    userDays: z.array(z.any()), // ObjectId[] יכול להיות אימות מותאם אם נדרש
});


export type IUserType = z.infer<typeof userSchemaZod> 

export type IUserTypeWithId = z.infer<typeof userSchemaZod> & {
    _id: string;
};

