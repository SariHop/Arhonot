import axios from "axios";
import { toast } from "react-toastify";


export const fetchUsersConnectionReq = async (userId: string | null) => {
    try {
      const response = await axios.get(
        `/api/connectionRequestRoute/userConnectionRequests/${userId}`
      );
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


  export const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const response = await axios.put(`/api/connectionRequestRoute/${requestId}`, {
        status: status,
      });
      if(response.status !== 200)
        throw response;
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
      const response = await axios.put(`/api/connectionRequestRoute/${requestId}`, {
        readen: true,
      });
      if(response.status !== 200)
        throw response;
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



  export const updateConnections = async (senderId: string, receiverId: string) => {
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
  
