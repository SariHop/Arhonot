import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {CreateConnectionRequest} from "../types/IConnectionRequest";
import {getOriginUserDataWithAuthentication}from '@/app/services/userServices'
import { Types } from "mongoose";

export const fetchUsersConnectionReq = async (userId: Types.ObjectId | null) => {
  try {
    if (!userId) {
      throw new Error("userId is null or undefined.");
    }
    const response = await axios.get(
      `/api/connectionRequestRoute/userConnectionRequests/${userId}`
    );
    console.log("User connection requests:", response.data);
    return response.data.data;
  } catch (error: unknown) {
    console.error("Failed to fetch user connection requests:", error);
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      toast.error(`Server Error: ${serverError}`);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
};

export const updateRequestStatus = async (
  requestId: string,
  status: string
) => {
  try {
    const response = await axios.put(
      `/api/connectionRequestRoute/${requestId}`,
      {
        status: status,
      }
    );
    if (response.status !== 200) throw response;
    return response.data;
  } catch (error: unknown) {
    console.error("Failed to update connection request:", error);
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      toast.error(`Server Error: ${serverError}`);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
};

export const updateRequestReadable = async (requestId: string) => {
  try {
    const response = await axios.put(
      `/api/connectionRequestRoute/${requestId}`,
      {
        readen: true,
      }
    );
    if (response.status !== 200) throw response;
    return response.data;
  } catch (error: unknown) {
    console.error("Failed to update connection request:", error);
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      toast.error(`Server Error: ${serverError}`);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
};

export const updateConnections = async (
  senderId: string,
  receiverId: Types.ObjectId | null
) => {
  try {
    const response = await axios.put(`/api/connectionRequestRoute`, null, {
      params: { sender: senderId, receiver: receiverId },
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Failed to update connection request:", error);
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      toast.error(`Server Error: ${serverError}`);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
};

export const createNewConnectionRequest = async (
  formData: CreateConnectionRequest
) => {
  try {
    const originUserData = await getOriginUserDataWithAuthentication();
    if (!originUserData.success) {
      return originUserData;
    }

    const response = await axios.post("/api/connectionRequestRoute", formData);
    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    } else {
      const message =
        response.data?.message || "שגיאה לא ידועה בשליחת בקשת התחברות .";
      return { success: false, message, status: response.status };
    }
  } catch (error) {
    console.error("error during create new connection request", error);
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "שגיאה לא צפויה";
      const status = error.response?.status || 500;
      return { success: false, message, status };
    } else {
      return { success: false, message: "שגיאה פנימית במערכת", status: 500 };
    }
  }
};
