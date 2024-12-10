import axios from "axios";
import { toast } from "react-toastify";


export const dayLooks = async (month: number, userId: string) => {
    try {
        const response = await axios.post(`/api/dayRoute/daysOutfits/`, {userId, month});
        return response.data.data;
      } catch (error: unknown) {
        console.error("Failed to fetch user looks:", error);
        if (axios.isAxiosError(error)) {
          const serverError = error.response?.data?.error || "Unknown server error";
          toast.error(`Server Error: ${serverError}`);
        } else {
          toast.error("An unexpected error occurred");
        }
        throw error;
      }
}