import { toast } from "react-toastify";

interface OriginUserData {
  success: boolean;
  status?: number;
  message?: string;
  value?: Record<string, unknown>; // או סוג מותאם אחר
};


//פונקציות עזר
export const isHandledError = (error: unknown): boolean => {
    return typeof error === "object" && error !== null && "isHandled" in error;
  };
  
export const markErrorAsHandled = (error: unknown): void => {
    if (typeof error === "object" && error !== null && !("isHandled" in error)) {
      (error as Record<string, unknown>).isHandled = true;
    }
  };
  
export const printErrorsOfAuthenticationToUser = (originUserData: OriginUserData) => {
    if (!originUserData.success) {
      if ("status" in originUserData && originUserData.status !== undefined) {
        if (originUserData.status === 403) {
          toast.error("הסיסמה שהקשת שגויה");
        } else if (originUserData.status === 400) {
          toast.error("שגיאה בקבלת פרטים בשרת, התחבר מחדש ואז נסה שוב");
        } else if (originUserData.status === 401) {
          toast.error("סיסמה לא חוקית, הקש/י סיסמה לפי הכללים.");
        } else if (originUserData.status === 404) {
          toast.error("אימייל זה כבר קיים במערכת,\nנסה אולי התחברות מחדש");
        } else if (originUserData.status === 402) {
          toast.error("");
        } else if (originUserData.status === 405) {
          toast.warn("האימות בוטל על ידי המשתמש");
        } else if ("message" in originUserData) {
          toast.error(`האימות נכשלה: \n${originUserData.message}`);
        } else {
          toast.error(" שגיאה פנימית במערכת בעת האימות");
        }
      } else {
        // console.log("", originUserData);
        toast.error("שגיאה כללית בעת האימות");
      }
      const error = new Error("שגיאה באימות");
      markErrorAsHandled(error)
      throw error;
    }
  
  }