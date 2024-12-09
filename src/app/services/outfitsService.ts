import axios from "axios";
import { toast } from "react-toastify";
import { IOutfitType } from "@/app/types/IOutfit";

export const apiUrl = "/api/";

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

// הסרוויס של אסתי
