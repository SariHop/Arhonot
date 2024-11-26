import { Document, ObjectId } from "mongoose";
<<<<<<< HEAD
import { z } from 'zod'
=======
import {z} from 'zod'
import { fetchCities } from "../services/categoriesService";
>>>>>>> 751f08e66cdfbf8495611f25eb1a871ccd29e8f2

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
<<<<<<< HEAD
            const cities: string[] = ["ירושלים"];
            return cities.includes(city);
=======
            const cities = fetchCities();
            return (await cities).includes(city);
>>>>>>> 751f08e66cdfbf8495611f25eb1a871ccd29e8f2
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

export type IUserTypeWithId = z.infer<typeof userSchemaZod> & {
    _id: string;
};

