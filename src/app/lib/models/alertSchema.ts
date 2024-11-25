import IAlert from "@/app/types/IAlert";
import mongoose, { Model, Schema } from "mongoose";

const AlertSchema : Schema<IAlert> = new Schema({
    userId: {type: String, required: true},
    desc: {type: String},
    title: {type:String, required:true},
    readen: {type:Boolean, required:true }
})

const Alart:Model<IAlert> =mongoose.models.Alart || mongoose.model<IAlert>('Recipe',AlertSchema)
export default Alart;