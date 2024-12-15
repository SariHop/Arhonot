import axios from "axios";
import { toast } from "react-toastify";
import { IOutfitType } from "@/app/types/IOutfit";

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

export async function createOutfit(formData: IOutfitType) {
  try {
    const response = await axios.post(`${apiUrl}outfitRoute`, formData);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      toast.error(`Server Error: ${serverError}`);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
}

export async function updateOutfitFavorite(outfitId: string, favorite: number) {
  try {
    const response = await axios.put(`${apiUrl}outfitRoute/${outfitId}`, {favorite});
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      toast.error(`Server Error: ${serverError}`);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
}
