import axios from "axios";
import { toast } from "react-toastify";
import { IGarmentType } from "@/app/types/IGarment";
import { Types } from "mongoose";

export const apiUrl = "/api/";

export async function createGarment(formData: IGarmentType) {
  try {
    const response = await axios.post(`${apiUrl}garmentRoute`, formData);
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

export const fetchGarments = async (userId: Types.ObjectId) => {
  try {
    const response = await axios.get(`/api/garmentRoute/galery/${userId.toString()}`);
    console.log(response.data);
    return response.data
  } catch (error) {
    console.error("Failed to fetch garments:", error);
  }
};
