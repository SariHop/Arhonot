import { IUserType, ResetPasswordResponse } from "../types/IUser";
import axios from "axios";
import useUser from "@/app/store/userStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useOriginUser from "@/app/store/originUserStore";
import { Types } from "mongoose";

export const apiUrl = "/api/userRoute";

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

function calculateAge(birthDate: Date): number {
  const today = new Date(); // התאריך הנוכחי
  let age = today.getFullYear() - birthDate.getFullYear(); // הפרש בשנים
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  // אם החודש הנוכחי קטן מחודש הלידה או אותו חודש אך היום עדיין לא עבר את יום ההולדת, מפחיתים שנה אחת
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
}

export const signup = async (formData: IUserType) => {
  const { setUser } = useUser.getState();
  const { setOriginUser } = useOriginUser.getState();
  try {
    const encryptedPassword = await hashPassword(formData.password); // השתמש ב-await כדי לקבל את התוצאה המגובבת
    const { confirmPassword, ...rest } = formData; // מסננים את confirmPassword
    const data = {
      ...rest, // כל הערכים מ- formData, מלבד confirmPassword
      password: encryptedPassword, // עדכון password
      age: calculateAge(formData.dateOfBirth),
    };
    console.log("confirmPassword", confirmPassword);
    console.log("data:", data);
    const response = await axios.post(`${apiUrl}`, data);

    if ((response.data && response.status === 201) || response.status === 200) {
      console.log("Response Data after signup:", response.data.data);
      setUser(response.data.data); // עדכון ה-store
      console.log("User state after signup:", useUser.getState());
      setOriginUser(response.data.data); //עדכון הUserOriginStore
      console.log("Origin user state after signup:", useOriginUser.getState());

      return { success: true, data: response.data };
    } else {
      const message =
        response.data?.message || "Unknown error occurred during signup";
      return { success: false, message, status: response.status };
    }
  } catch (error) {
    console.error("Error during signup:", error);
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "שגיאה לא צפויה";
      const status = error.response?.status || 500;
      return { success: false, message, status };
    } else {
      return { success: false, message: "שגיאה פנימית במערכת", status: 500 };
    }
  }
};

export const signin = async (email: string, password: string) => {
  const { setUser } = useUser.getState();
  const { setOriginUser } = useOriginUser.getState();
  try {
    const encryptedPassword = await hashPassword(password);
    console.log(email, encryptedPassword);
    const response = await axios.post("/api/signIn", {
      email,
      password: encryptedPassword,
    });

    if ((response.data && response.status === 201) || response.status === 200) {
      console.log("Response Data after signin:", response.data.data);
      console.log("Login successful:", response.data);
      setUser(response.data.data); // עדכון ה-store
      console.log("User state after signin:", useUser.getState());
      setOriginUser(response.data.data); //עדכון הUserOriginStore
      console.log("Origin user state after signup:", useOriginUser.getState());
      return { success: true, data: response.data };
    } else {
      const message =
        response.data?.message || "Unknown error occurred during signup.";
      return { success: false, message, status: response.status };
    }
  } catch (error) {
    console.error("Error during login:", error);
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "שגיאה לא צפויה";
      const status = error.response?.status || 500;
      return { success: false, message, status };
    } else {
      // אם מדובר בשגיאה שאינה קשורה ל-axios
      return { success: false, message: "שגיאה פנימית במערכת", status: 500 };
    }
  }
};

export const resetPassword = async (
  token: string,
  password: string
): Promise<ResetPasswordResponse> => {
  const encryptedPassword = await hashPassword(password);
  try {
    console.log("token   ", token, "en  ", encryptedPassword);
    const response = await axios.put(`/api/reset-password`, {
      token: token,
      password: encryptedPassword,
    });
    console.log("response:", response);
    if (response.status === 200) {
      return { message: "Password reset successful" };
    } else {
      // אם יש שגיאה כלשהי שנחזקה בתגובה, מכניסים אותה לכאן
      return { error: response.data.error || "Unexpected error occurred" };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          console.error("Validation error:", data.error);
          return data.error; // החזרת הודעת שגיאה ללקוח
        } else if (status === 404) {
          console.error("User not found:", data.message);
          return data.message; // החזרת הודעת שגיאה ללקוח
        } else if (status === 500) {
          console.error("Server error:", data.error);
          return "Internal server error. Please try again later.";
        }
      } else {
        console.error("Request failed:", error.message);
        return "Network error. Please check your connection.";
      }
    } else {
      console.error("Unexpected error:", error);
      return "An unexpected error occurred. Please try again.";
    }
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post("/api/reset-password", {
      email: email,
    });
    if (response.status === 200) {
      return { message: "Password reset successful" };
    } else {
      return { error: response.data.error || "Unexpected error occurred" };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          console.error("Validation error:", data.error);
          return data.error; // החזרת הודעת שגיאה ללקוח
        } else if (status === 404) {
          console.error("User not found:", data.message);
          return data.message; // החזרת הודעת שגיאה ללקוח
        } else if (status === 500) {
          console.error("Server error:", data.error);
          return "Internal server error. Please try again later.";
        }
      } else {
        console.error("Request failed:", error.message);
        return "Network error. Please check your connection.";
      }
    } else {
      console.error("Unexpected error:", error);
      return "An unexpected error occurred. Please try again.";
    }
  }
};
//פונקציה להתנתקות מהאתר
export const logout = async (): Promise<void> => {
  const { resetUser } = useUser.getState();
  const { resetOriginUser } = useOriginUser.getState();

  try {
    //שליחת בקשה לשרת למחיקת הטוקן
    await axios.post("/api/logoutRoute", null, { withCredentials: true });
    // איפוס המשתמשים ב-Store
    resetUser();
    resetOriginUser();

    console.log("User has been logged-out successfully.");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
//פונקציה לעדכון פרטי משתמש
export const updateUser = async (_id: Types.ObjectId|null, body: object) => {
  const { setUser } = useUser.getState();
  const { setOriginUser } = useOriginUser.getState();

  try {
    const response = await axios.put(`${apiUrl}/${_id}`, body, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("User updated successfully:", response.data);
    setUser(response.data.data); // עדכון ה-store
    console.log("User state after signup:", useUser.getState());
    setOriginUser(response.data.data); //עדכון הUserOriginStore
    console.log("Origin user state after signup:", useOriginUser.getState());
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

export const createSubAccont = async (formData: IUserType) => {
  const { _id: creatorId,  email: creatorEmail, } =  useOriginUser.getState();
  console.log(creatorId,'creatorId',creatorEmail,'creatorEmail' );
  
  try {
    if (!creatorEmail||creatorEmail==="") {
      return { success: false, message: "האימייל של המשתמש המקורי לא נמצא", status: 400 };
    }
    const enteredPassword = prompt("אנא הזן את סיסמתך לאימות:");
    if (!enteredPassword) {
      return { success: false, message: "האימות בוטל על ידי המשתמש", status: 401 };
    }
    const encryptedPassword = await hashPassword(enteredPassword);
    const authResponse = await axios.post("/api/signIn", {
      email: creatorEmail,
      password: encryptedPassword,
    });
    if (authResponse.status !== 200 && authResponse.status !== 201) {
      return { success: false, message: "אימות הסיסמה נכשל", status: authResponse.status };
    }
    const encryptedNewPassword = await hashPassword(formData.password);

    // הכנת הנתונים ליצירת חשבון משני
    const { confirmPassword, ...rest } = formData;
    console.log("confirmPassword", confirmPassword);
    const data = {
      ...rest,
      password: encryptedNewPassword,
      age: calculateAge(formData.dateOfBirth),
      creatorId,
    };
    console.log("data:", data);

    // שליחת הנתונים לשרת
    const response = await axios.post("/api/userExtraPermissions", data);
    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    } else {
      const message =
        response.data?.message || "שגיאה לא ידועה ביצירת חשבון המשני.";
      return { success: false, message, status: response.status };
    }
  } catch (error) {
    console.error("Error during create sub account:", error);

    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "שגיאה לא צפויה";
      const status = error.response?.status || 500;
      return { success: false, message, status };
    } else {
      return { success: false, message: "שגיאה פנימית במערכת", status: 500 };
    }
  }
};
//פונקציה לחיפוש משתמש עפ"י מייל
export const getUserByEmail = async (emailInput:string)=>{

  try {
    const response = await axios.get(`${apiUrl}/searchRoute/${emailInput}`
    );
    return response.data.data; 
  } catch (error) {
    console.error("שגיאה בחיפוש משתמש:", error);
    return null;
  }
};

