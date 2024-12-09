import { Document, ObjectId } from "mongoose";
import { z } from 'zod';
import { fetchSeasons, fetchTags, fetchTypes } from "../services/categoriesService";

export default interface IGarment extends Document {
  userId: ObjectId;
  img: string;
  desc: string;
  season: string;
  range: number;
  category: string;
  color: string
  link: string
  price: number;
  tags: string[];
}


export const garmentSchemaZod = z.object({
  desc: z.string().optional(),
  season: z.string().refine(
    async (season) => {
      const validSeasons = await fetchSeasons();
      return validSeasons.includes(season);
    },
    { message: "Invalid season" }
  ),
  category: z.string().refine(
    async (category) => {
      const validCategories = await fetchTypes();
      return validCategories.includes(category);
    },
    { message: "Invalid category" }
  ),
  range: z.number().min(1, { message: "Range must be at least 1" }).max(7, { message: "Range must be at most 7" }),
  color: z.string().optional(), // אופציונלי
  link: z.string().url({ message: "יש להזין לינק בפורמט חוקי" }).or(z.literal("").optional()),
  price: z.number().optional(),
  tags: z.array(z.string()).refine(
    async (tags) => {
      const validTags = await fetchTags(); // פונקציה שמחזירה מערך ערכים חוקיים
      return tags.every(tag => validTags.includes(tag));
    },
    { message: "Some tags are invalid" }
  ),
});

export type IGarmentType = z.infer<typeof garmentSchemaZod>;

export type IGarmentTypeWithId = IGarmentType & {
  _id: string;
};

export interface GarmentProps {
  garment: IGarment;
  closeModal: () => void;
}

export interface IFilterModalProps {
  visible: boolean;
  onClose: () => void;
  activeTab: string;
}

type TabType = "garments" | "outfits"; // הגדרת טיפוס מותאם אישית
export interface IGalleryHeaderProps {
  activeTab: string;
  setActiveTab: (tab: TabType) => void;
  isForOutfit: boolean;
}