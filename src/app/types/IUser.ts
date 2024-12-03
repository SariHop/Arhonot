import { Document, ObjectId } from "mongoose";
import {z} from 'zod'
// import { fetchCities } from "../services/categoriesService";

export default interface IUser extends Document {
    _id: string;
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
        .min(8, "סיסמה חייבת להכיל לפחות 8 תווים")
        .max(12, "אורך הסיסמה לא יחרוג מ12 תווים")
        .regex(/[A-Z]/, "הסיסמה חייבת להכיל לפחות אות גדולה אחת באנגלית")
        .regex(/[a-z]/, "הסיסמה חייבת להכיל לפחות אות קטנה אחת באנגלית")
        .regex(/\d/, "הסיסמה חייבת להכיל לפחות ספרה אחת")
        .regex(/[^A-Za-z0-9]/, "הסיסמה חייבת להכיל לפחות תו מיוחד אחד"),
    confirmPassword: z.string()
        .min(8, "אימות סיסמה חייב להכיל לפחות 8 תווים") // לפי דרישת אורך דומה לסיסמה
        .max(12, "אורך אימות הסיסמה לא יחרוג מ12 תווים"),
    email: z.string().email("כתובת מייל לא חוקית"),
    userName: z
        .string()
        .regex(/^[A-Za-z]+$/, "שם משתמש חייב להיות באנגלית ובאותיות בלבד")
        .min(2, "שם משתמש חייב להכיל 2 אותיות לפחות"),
    gender: z.enum(["זכר", "נקבה"]),
    age:z.number().min(0,'גיל לא יקטן מ0').max(120,'גיל לא יחרוג מ120'),
    dateOfBirth: z.date().refine(
        (date) => date <= new Date(),
        { message: "תאריך לידה לא יכול להיות עתידי" }
    ),
    city: z.string().refine(
        async (city) => {
            // Fetch the list of cities from the API and validate.
            const cities: string[] = ["ירושלים"];
            return cities.includes(city);

        },
        { message: "עיר חייבת להבחר מרשימת הערים בישראל" }
    ),
    sensitive: z.enum(["cold", "heat", "none"]),

})
    .refine((data) => data.password === data.confirmPassword, {
        message: "הסיסמאות חייבות להיות תואמות",
        path: ["confirmPassword"], // מציין את השדה שבו נופלת השגיאה
    });

//טיפוסים עבור סכמת הzod
export type IUserType = z.infer<typeof userSchemaZod>;
export type IUserTypeWithId = Omit<IUserType, "confirmPassword"> & { _id: string };


// טיפוס ליצירת משתמש (ללא _id ועם שדות נדרשים בלבד)
export type CreateUserType = Omit<IUser, "_id"/* | "children" | "userDays"*/>;

// טיפוס לעדכון יוזר בסטור (כולל ה-ID, כל השדות אופציונליים)
export type UpdateUserTypeForStore = Partial<IUser> & { _id: string };

// טיפוס לעדכון משתמש (כל השדות אופציונליים מלבד _id)- צריך לעדכן אילו שדות ניתן להשאיר ריקים ואלו לא
export type UpdateUserDBType = Omit<Partial<IUser>, "_id"> & { _id: string };


