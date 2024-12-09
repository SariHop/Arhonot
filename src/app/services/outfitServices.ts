import axios from "axios";
// import { IGarmentType } from "@/app/types/IGarment";

export const apiUrl = "/api/";

export const fetchOutfits = async (userId: string) => {
    try {
        const response = await axios.get(`${apiUrl}outfitRoute/gallery/${userId}`);
        console.log("response:");
        console.log(response.data);
        return response.data
    } catch (error) {
        console.error("Failed to fetch outfits:", error);
    }
};