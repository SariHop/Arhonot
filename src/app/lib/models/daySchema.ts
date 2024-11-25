import IDay from "@/app/types/IDay";
import mongoose, { Model, Schema, Types } from "mongoose";

const daySchema: Schema<IDay> = new Schema({
    date: { type: Date, required: true }, 
    dayDesc: {
        type: String,
        enum: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
        required: true,
    }, 
    looks: { type: [Types.ObjectId], required: true, ref: "Outfit"  }, 
    comments: { type: String }, // שדה אופציונלי
    weather: { type: String, required: true, minlength: 10 }, // מזג אוויר, אורך מינימום 10 תווים
});



const Day:Model<IDay> = mongoose.models.Day || mongoose.model<IDay>('Day',daySchema);

export default Day;