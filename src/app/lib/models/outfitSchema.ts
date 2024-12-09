import { validSeasons, tags } from "@/app/data/staticArrays";
import IOutfit from "@/app/types/IOutfit";
import mongoose, { Model, Schema, Types } from "mongoose";


const OutfitSchema: Schema<IOutfit> = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    clothesId: { 
        type: [Types.ObjectId], 
        required: true, 
        ref: "Garment", 
        validate: {
            validator: (value: Types.ObjectId[]) => value.length > 0,
            message: 'חייב להיות לפחות בגד אחד'
        }
    },
    desc: { type: String },
    season: { type: String, required: true, enum: validSeasons },
    tags: { 
        type: [String], 
        enum: tags, 
    },
    img: { 
        type: String, 
        required: true, 
        match: /^https?:\/\/.+/ 
    },
    favorite: { 
        type: Number, 
        enum: [0, 1, 2, 3, 4, 5], 
        default: 0
    },
    rangeWheather: { 
        type: Number, 
        required: true, 
        enum: [1, 2, 3, 4, 5, 6, 7] 
    }
});

const Outfit: Model<IOutfit> = mongoose.models.Outfit || mongoose.model<IOutfit>('Outfit', OutfitSchema);

export default Outfit;
