import mongoose, { Document, ObjectId } from "mongoose";

import { z } from 'zod'
// import { fetchCities } from "../services/categoriesService";

export default interface IUser extends Document {
    children: ObjectId[];
    password: string;
    email: string;
    age: number;
    userName: string;
    gender: string;
    dateOfBirth: Date;
    city: string;
    sensitive: string;
    userDays: ObjectId[];
}

export interface IToken extends Document {
    userId: mongoose.Types.ObjectId; // מצביע על ה-ObjectId של משתמש
    token: string;
    createdAt: Date;
}

export const passwordSchemaZod = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(12, "Password cannot exceed 12 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string()
        .min(8, "Confirm Password must be at least 8 characters") // לפי דרישת אורך דומה לסיסמה
        .max(12, "Confirm Password cannot exceed 12 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // מציין את השדה שבו נופלת השגיאה
});

export const userSchemaZod = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(12, "Password cannot exceed 12 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string()
        .min(8, "Confirm Password must be at least 8 characters") // לפי דרישת אורך דומה לסיסמה
        .max(12, "Confirm Password cannot exceed 12 characters"),
    email: z.string().email("Invalid email format"),
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
            const cities: string[] = ["ירושלים"];
            return cities.includes(city);

        },
        { message: "City must be one of the valid cities in Israel" }
    ),
    sensitive: z.enum(["cold", "heat", "none"]),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"], // מציין את השדה שבו נופלת השגיאה
    });

export type IUserType = z.infer<typeof userSchemaZod>

export type IUserTypeWithId = Omit<z.infer<typeof userSchemaZod>, 'confirmPassword'> & {
    _id: string;
};

export type ResetPasswordResponse =
    | string // אם זה שגיאה
    | {
        message?: string;
        error?: string;
    } // אם זה אובייקט של הצלחה עם הודעה
    | undefined; // אם לא מוחזר כלום במקרה של הצלחה