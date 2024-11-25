import IAlert from "@/app/types/IAlert";
import mongoose, { Model, Schema, Types } from "mongoose";

const AlertSchema: Schema<IAlert> = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: 'User' },
    desc: { type: String, required: false }, 
    title: { type: String, required: true },
    readen: { type: Boolean, required: true },
});

const Alart:Model<IAlert> =mongoose.models.Alart || mongoose.model<IAlert>('Alert',AlertSchema)
export default Alart;