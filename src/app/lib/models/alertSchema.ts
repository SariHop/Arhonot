import IAlert from "@/app/types/IAlert";
import mongoose, { Model, Schema, Types } from "mongoose";

const AlertSchema: Schema<IAlert> = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: 'User' },
    desc: { type: String, required: false }, 
    title: { type: String, required: true },
    readen: { type: Boolean, required: true },
    date: { type: Date, required: true, validate: [function(value: Date) {
        return value <= new Date(); 
    }, "Date of alert must be in the past"] },
});

const Alert:Model<IAlert> =mongoose.models.Alert || mongoose.model<IAlert>('Alert',AlertSchema)
export default Alert;