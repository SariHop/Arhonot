
import IGarment from "@/app/types/IGarment";
import mongoose, { Model, Schema, Types } from "mongoose";

const GarmentSchema: Schema<IGarment> = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: "User" },  
    img: { type: String, required: true, match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i },  // אימות URL תקני
    desc: { type: String, required: false },  // אופציונלי
    season: { 
        type: String, 
        required: true, 
        enum: ["חורף", "אביב", "קיץ", "סתיו"],  // עונות חובה
        message: "Season must be one of the valid seasons" 
    },
    category: { 
        type: String, 
        required: true, 
        enum: ["חולצה", "מכנסיים", "שוליים", "מעיל", "סוודר", "שמלה", "חצאית"],  // קטגוריות חובה
        message: "Category must be one of the valid categories"
    },
})

const Garment:Model<IGarment> = mongoose.models.Garment || mongoose.model<IGarment>('Garment',GarmentSchema)
export default Garment;