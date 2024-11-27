import { fetchSeasons, fetchTypes } from "@/app/services/categoriesService";
import IOutfit from "@/app/types/IOutfit";
import mongoose, { Model, Schema, Types } from "mongoose";


const OutfitSchema: Schema<IOutfit> = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: "User" }, 
    clothesId: { type: [Types.ObjectId], required: true, ref: "Garment" }, 
    desc: { type: String, required: false }, 
    season: { type: String, validate: {
        validator: async function(value: string) {
            const validSeasons = await fetchSeasons();
            return validSeasons.includes(value);
        }, message: "Season must be one of the valid seasons" }, required: true }, 
    category: { type: String, validate: {
        validator: async function(value: string) {
            const validCategories = await fetchTypes();
            return validCategories.includes(value);
        }, message: "Category must be one of the valid categories"}, required: true },
    img: { type: String, required: true, match: /^https?:\/\/.+/ }, 
});

const Outfit: Model<IOutfit> = mongoose.models.Outfit || mongoose.model<IOutfit>('Outfit', OutfitSchema);

export default Outfit;
