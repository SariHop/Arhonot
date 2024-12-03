import IGarment from "@/app/types/IGarment";
import mongoose, { Model, Schema, Types } from "mongoose";

const GarmentSchema: Schema<IGarment> = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: "User" },  
    img: { type: String, required: true, match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i },  // אימות URL תקני
    desc: { type: String, required: false },  // אופציונלי
    season: { 
        type: String, 
        required: true
    },
    category: { 
        type: String, 
        required: true
    },
    range: { 
        type: Number, 
        min: 1, 
        max: 7, 
        required: true, 
        message: "Range must be between 1 and 7"
    },
    color: { 
        type: String, 
        required: false 
    },
    link: { 
        type: String, 
        match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i, 
        required: false 
    },
    price: { 
        type: Number, 
        required: false 
    },
    tags: { 
        type: [String], 
        required: false
    }
})

const Garment:Model<IGarment> = mongoose.models.Garment || mongoose.model<IGarment>('Garment',GarmentSchema)
export default Garment;