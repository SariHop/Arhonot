
import IUser from "@/app/types/IUser";
import mongoose, { Model, Schema, Types } from "mongoose";

const UserSchema : Schema<IUser> = new Schema({
    children: {type: [Types.ObjectId], required:true, ref: "User" },
    password: { type: String, required: true, minlength: 8},
    email: { type: String, required: true, match: /\S+@\S+\.\S+/},
    age: { type: Number, required: true, min: 0, max: 120},
    userName: { type: String, required: true, match: /^[A-Za-z]{2,}$/},
    gender: { type: String, required: true, enum: ["זכר", "נקבה"]},
    dateOfBirth: { type: Date, required: true, validate: [function(value: Date) {
        return value <= new Date(); // Date of birth cannot be in the future
    }, "Date of birth cannot be in the future"] },
    city: { type: String, required: true, validate: {
        validator: async function(value: string) {
            const cities: string[] = ['ירושלים'];
            return cities.includes(value);
        },
        message: "City must be one of the valid cities in Israel",
    }
},
    sensitive: { type: String, required: true, enum: ["cold", "heat", "none"]},
    userDays: {type: [Types.ObjectId], required:true, ref: "Day" },
})

const User:Model<IUser> =mongoose.models.User || mongoose.model<IUser>('User',UserSchema)
export default User;