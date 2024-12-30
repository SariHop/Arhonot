import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateConnectionRequestType } from "../types/IConnectionRequest";
import { getOriginUserDataWithAuthentication } from "@/app/services/userServices";
import { Types } from "mongoose";
import useOriginUser from "@/app/store/originUserStore";
import useUser from "../store/userStore";

export const fetchUsersConnectionReq = async (
  userId: Types.ObjectId | null
) => {
  try {
    if (!userId) {
      throw new Error("userId is null or undefined.");
    }
    const response = await axios.get(`/api/connectionRequestRoute/userConnectionRequests/${userId}`);
    console.log("User connection requests:", response.data);
    return response.data.data;
  } catch (error: unknown) {
    console.error("Failed to fetch user connection requests:", error);
    throw error;
  }
};

export const updateRequestStatus = async (
  requestId: string,
  status: string
) => {
  try {
    const { _id: userId } = useUser.getState();
    const { _id: originUserId } = useOriginUser.getState();

    if (userId?.toString() === originUserId?.toString()) {
      const originUserData = await getOriginUserDataWithAuthentication();
      if (!originUserData.success) {
        return originUserData;
      }

      const response = await axios.put(
        `/api/connectionRequestRoute/${requestId}`,{status: status});
      if (response.status !== 200) throw response;
      return response.data;
    } else {
      // משתמש שאינו מורשה
      return {
        success: false,
        message: "אין לך הרשאה לבצע פעולה זו.",
        status: 403,
      };
    }
  } catch (error: unknown) {
    console.error("Failed to update connection request:", error);
    throw error;
  }
};

export const updateRequestReadable = async (requestId: string) => {
  try {
    const response = await axios.put(`/api/connectionRequestRoute/${requestId}`, {readen: true});
    if (response.status !== 200) throw response;
    return response.data;
  } catch (error: unknown) {
    console.error("Failed to update connection request:", error);
    throw error;
  }
};

export const updateConnections = async (
  senderId: string,
  receiverId: Types.ObjectId | null
) => {
  try {
    const { _id: userId } = useUser.getState();
    const { _id: originUserId } = useOriginUser.getState();

    if (userId?.toString() === originUserId?.toString()) {
      // const originUserData = await getOriginUserDataWithAuthentication();
      // if (!originUserData.success) {
      //   return originUserData;
      // }// אימות כפול, עדיף לחסוף כך שבמידה והפניה היא מלחצן אישור בקשת התחברות הפונה לפונקציית עדכון סטטוס + עדכון קשרי ילדים לא יבקש אימות כפול

      const response = await axios.put(`/api/connectionRequestRoute`, null, {
        params: { sender: senderId, receiver: receiverId },
      });
      if (response.status !== 200) throw response;

      const { sender, receiver } = response.data.data;

      if (userId?.toString() === sender._id.toString()) {
        useUser.getState().updateChildren(sender.children); // עדכון useUser
        useOriginUser.getState().updateChildren(sender.children); // עדכון useOriginUser
      } else if (userId?.toString() === receiver._id.toString()) {
        useUser.getState().updateChildren(receiver.children); // עדכון useUser
        useOriginUser.getState().updateChildren(receiver.children); // עדכון useOriginUser

        console.log(
          "User state after updateRequestStatus:",
          useUser.getState()
        );
        console.log(
          "Origin user state after updateRequestStatus:",
          useOriginUser.getState()
        );
      }
      return response.data;
    } else {
      // משתמש שאינו מורשה
      return {
        success: false,
        message: "אין לך הרשאה לבצע פעולה זו.",
        status: 403,
      };
    }
  } catch (error: unknown) {
    console.error("Failed to update connection request:", error);
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      const status = error.response?.status || 501;

      if (status === 400) {
        toast.error("שגיאה בקבלת נתונים בשרת, נסה שוב.");
      } else if(status===404){
        toast.error("פרטיך או פרטי המשתמש השני לא נמצאו במערכת")
      } else if(status===500){
        toast.error(`שגיאת שרת: ${serverError}`);
      }else{
        toast.error("אירעה שגיאה לא צפויה בשרת");
      }
    } else {
      toast.error(" אירעה שגיאה בעת עדכון החשבונות המקשורים שלכם. נסה שוב");
    }
    throw error;
  }
};
//פונקציה ליצירת בקשת התחברות חדשה
export const createNewConnectionRequest = async (
  formData: CreateConnectionRequestType
) => {
  try {
    const { _id: userId } = useUser.getState();
    const { _id: originUserId } = useOriginUser.getState();

    if (userId?.toString() === originUserId?.toString()) {
      const originUserData = await getOriginUserDataWithAuthentication();
      if (!originUserData.success) {
        return originUserData;
      }
      const response = await axios.post(
        "/api/connectionRequestRoute",
        formData
      );
      if (response.status === 200 || response.status === 201) {
        return { success: true, data: response.data };
      } else {
        const message =
          response.data?.message || "שגיאה לא ידועה בשליחת בקשת התחברות .";
        return { success: false, message, status: response.status };
      }
    } else {
      // משתמש שאינו מורשה
      return {
        success: false,
        message: "אין לך הרשאה לבצע פעולה זו.",
        status: 403,
      };
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
//פונקציה לניתוק קשר בין 2 משתמשים
export const removeConnectionRequest = async (
  senderId: Types.ObjectId,
  receiverId: string /*| null*/
) => {
  try {
    const { _id: userId } = useUser.getState();
    const { _id: originUserId } = useOriginUser.getState();

    if (userId?.toString() === originUserId?.toString()) {
      const originUserData = await getOriginUserDataWithAuthentication();
      if (!originUserData.success) {
        return originUserData;
      }
      console.log(senderId, "userIdSender", receiverId, "userIdToRemove");

      const response = await axios.put(`/api/connectionRequestRoute/userConnectionRequests`, null, {
        params: { sender: senderId, receiver: receiverId },
      });
      if (response.status == 200) {
        const updatedSender = response.data?.data?.updatedSender;
        if (!updatedSender) {
          console.error("שגיאה: הנתונים שחזרו מהשרת אינם כוללים את updatedSender");
          return { success: false, message: "נתונים חסרים מהשרת", status: 500 };
        }
        useUser.getState().updateChildren(updatedSender.children);
        useOriginUser.getState().updateChildren(updatedSender.children);
      
        return response.data;
      } else {
        console.error("שגיאה לא צפויה, סטטוס:", response.status);
        return { success: false, message: "שגיאה לא צפויה", status:500 };
      }
    } else {
      // משתמש שאינו מורשה
      return {
        success: false,
        message: "אין לך הרשאה לבצע פעולה זו.",
        status: 403,
      };
    }
  } catch (error) {
    console.error("שגיאה במהלך מחיקת ההתקשרות", error);
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "שגיאה לא צפויה";
      const status = error.response?.status || 500;
      return { success: false, message, status };
    } else {
      return { success: false, message: "שגיאה פנימית במערכת", status: 500 };
    }
  }
};
