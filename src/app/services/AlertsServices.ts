import axios from "axios";
import { Types } from "mongoose";
import { toast } from "react-toastify";


export async function fetchUserAlerts(userId: Types.ObjectId | null) {
  try {
    if (!userId) {
      throw new Error("userId is null or undefined.");
    }
    const response = await axios.get(`/api/alertRoute/userAlerts/${userId}`);
    return response.data.data;
  } catch (error: unknown) {
    console.error("Failed to fetch user alerts:", error);
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      toast.error(`Server Error: ${serverError}`);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
}

export const updateAlertStatus = async (alertId: string) => {
  try {
    const response = await axios.put(`/api/alertRoute/${alertId}`, {
      readen: true,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Failed to update alert:", error);
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      toast.error(`Server Error: ${serverError}`);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
};


