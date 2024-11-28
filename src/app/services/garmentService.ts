import axios from "axios";
import { toast } from "react-toastify";
import { IGarmentType } from "@/app/types/IGarment";

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
