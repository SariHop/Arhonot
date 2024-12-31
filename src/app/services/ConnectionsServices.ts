import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateConnectionRequestType } from "../types/IConnectionRequest";
import { getOriginUserDataWithAuthentication } from "@/app/services/userServices";
import { Types } from "mongoose";
import useOriginUser from "@/app/store/originUserStore";
import useUser from "../store/userStore";
import {
  isHandledError,
  markErrorAsHandled,
  printErrorsOfAuthenticationToUser,
} from "./errorServices";

export const fetchUsersConnectionReq = async (
  userId: Types.ObjectId | null
) => {
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
      printErrorsOfAuthenticationToUser(originUserData);

      const response = await axios.put(
        `/api/connectionRequestRoute/${requestId}`,
        { status: status }
      );
      if (response.status !== 200) throw response;
      return response.data;
    } else {
      // משתמש שאינו מורשה
      toast.error("אין לך הרשאה לבצע פעולה זו.");
      const error = new Error("אין לך הרשאה לבצע פעולה זו.");
      markErrorAsHandled(error);
      throw error;
    }
  } catch (error: unknown) {
    console.error("Failed to update connection request:", error);
    if (isHandledError(error)) throw error;
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      const status = error.response?.status || 501;

      if (status === 400) {
        toast.error("שגיאה בקבלת נתונים בשרת, נסה שוב.");
      } else if (status === 404) {
        toast.error("בקשת ההתחברות הזו לא נמצאת במערכת");
      } else if (status === 500) {
        toast.error(`שגיאת שרת: ${serverError}`);
      } else {
        toast.error("אירעה שגיאה לא צפויה בשרת");
      }
    } else {
      toast.error(" אירעה שגיאה בעת עדכון מצב של הבקשת התחברות, נסה שוב");
    }
    throw error;
  }
};

export const updateRequestReadable = async (requestId: string) => {
  try {
    const response = await axios.put(
      `/api/connectionRequestRoute/${requestId}`,
      { readen: true }
    );
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
      toast.error("אין לך הרשאה לבצע פעולה זו.");
      const error = new Error("אין לך הרשאה מתאימה לבצע פעולה זו.");
      markErrorAsHandled(error);
      throw error;
    }
  } catch (error: unknown) {
    console.error("Failed to update connection request:", error);
    if (isHandledError(error)) throw error;
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      const status = error.response?.status || 501;

      if (status === 400) {
        toast.error("שגיאה בקבלת נתונים בשרת, נסה שוב.");
      } else if (status === 404) {
        toast.error("פרטיך או פרטי המשתמש השני לא נמצאו במערכת");
      } else if (status === 500) {
        toast.error(`שגיאת שרת: ${serverError}`);
      } else {
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
  formData: CreateConnectionRequestType, email: string
) => {
  try {
    const { _id: userId } = useUser.getState();
    const { _id: originUserId } = useOriginUser.getState();

    if (userId?.toString() === originUserId?.toString()) {
      const originUserData = await getOriginUserDataWithAuthentication();
      printErrorsOfAuthenticationToUser(originUserData);

      const response = await axios.post(
        "/api/connectionRequestRoute",
        {formData, email}
      );
      if (
        response &&
        "status" in response &&
        response.status >= 200 &&
        response.status < 204
      ) {
        switch (response.status) {
          case 202:
            toast.info("בקשת החיבור כבר אושרה בעבר.");
            break;
          case 203:
            toast.info("בקשת החיבור כבר במצב ממתין לאישור.");
            break;
          default:
            toast.success("בקשת החיבור נשלחה בהצלחה");
            break;
        }
        return response.data;
      } else {
        throw response;
      }
    } else {
      // משתמש שאינו מורשה
      toast.error("אין לך הרשאה לבצע פעולה זו.");
      const error = new Error("אין לך הרשאה לבצע פעולה זו.");
      markErrorAsHandled(error);
      throw error;
    }
  } catch (error) {
    console.error("error during create new connection request", error);
    if (isHandledError(error)) throw error;
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      const status = error.response?.status || 501;

      if (status === 404) {
        toast.error("לא נמצא משתמש עם כתובת המייל שהוזנה");
      }else if (status === 403) {
        toast.error("המשתמש שנמצא לא תקין. חסר מזהה ייחודי.");
      }else if (status === 500) {
        toast.error(`שגיאת שרת: ${serverError}`);
      } else {
        toast.error("אירעה שגיאה לא צפויה בשרת");
      }
    } else {
      toast.error(" אירעה שגיאה בעת יצירת בקשת התחברות חדשה, נסה שוב");
    }
    throw error;
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
      printErrorsOfAuthenticationToUser(originUserData);
      console.log(senderId, "userIdSender", receiverId, "userIdToRemove");

      const response = await axios.put(
        `/api/connectionRequestRoute/userConnectionRequests`,
        null,
        { params: { sender: senderId, receiver: receiverId } }
      );
      if (response.status !== 200) throw response;
      else {
        const updatedSender = response.data?.data?.updatedSender;
        if (!updatedSender) {
          console.error(
            "שגיאה: הנתונים שחזרו מהשרת אינם כוללים את updatedSender"
          );
          toast.error("חסרים נתונים מהשרת");
          const error = new Error("חסרים נתונים מהשרת");
          markErrorAsHandled(error);
          throw error;
        }
        useUser.getState().updateChildren(updatedSender.children);
        useOriginUser.getState().updateChildren(updatedSender.children);
        return response.data;
      }
    }else {
      // משתמש שאינו מורשה
      toast.error("אין לך הרשאה לבצע פעולה זו.");
      const error = new Error("אין לך הרשאה לבצע פעולה זו.");
      markErrorAsHandled(error);
      throw error;
    }
  } catch (error) {
    console.error("שגיאה במהלך מחיקת ההתקשרות", error);
    if (isHandledError(error)) throw error;
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      const status = error.response?.status || 501;

      if (status === 400) {
        toast.error("שגיאה במחיקת נתונים בשרת, נסה שוב.");
      } else if (status === 404) {
        toast.error("תקלה שרת בקבלת המשתמש שלך או של החבר, בדוק את החיבור לאינטרנט");
      } else if (status === 405) {
        toast.error("בקשת ההתחברות הזו לא נמצאת במערכת");
      } else if (status === 500) {
        toast.error(`שגיאת שרת: ${serverError}`);
      } else {
        toast.error("אירעה שגיאה לא צפויה בשרת");
      }
    } else {
      toast.error(" אירעה שגיאה בעת מחיקת התקשרות, נסה שוב");
    }
    throw error;
  }
};
