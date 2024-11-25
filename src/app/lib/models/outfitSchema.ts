import IOutfit from "@/app/types/IOutfit";
import mongoose, { Model, Schema, Types } from "mongoose";

// רשימת העונות והקטגוריות
const validSeasons = ["חורף", "אביב", "קיץ", "סתיו"] as const;
const validCategories = ["חולצה", "מכנסיים", "שוליים", "מעיל", "סוודר", "שמלה", "חצאית"] as const;

const OutfitSchema: Schema<IOutfit> = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: "User" }, 
    clothesId: { type: [Types.ObjectId], required: true, ref: "Garment" }, 
    desc: { type: String, required: false }, 
    season: { type: String, enum: validSeasons, required: true }, 
    category: { type: String, enum: validCategories, required: true },
    img: { type: String, required: true, match: /^https?:\/\/.+/ }, 
});

const Outfit: Model<IOutfit> = mongoose.models.Outfit || mongoose.model<IOutfit>('Outfit', OutfitSchema);

export default Outfit;
