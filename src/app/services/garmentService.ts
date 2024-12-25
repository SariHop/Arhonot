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
      const status = error.response?.status || 501;

      if (status === 400) {
        toast.error("שלחת נתונים שגוים, בחר את הקטגוריות המתאימות");
      } else if(status===500){
        toast.error(`שגיאת שרת: ${serverError}`);
      }
    } else {
      toast.error("אירעה שגיאה לא צפויה בעת יצירת הבגד");
    }
    throw error;
  }
}

export async function updateGarment(formData: IGarmentType, garmentId: string) {
  try {
    const response = await axios.put(`${apiUrl}garmentRoute/${garmentId}`, formData);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      const status = error.response?.status || 501;

      if (status === 400) {
        toast.error("שגיאה בקבלת נתונים בשרת, נסה שוב.");
      } else if(status===404){
        toast.error("הבגד זה לא נמצא במערכת")
      } else if(status===500){
        toast.error(`שגיאת שרת: ${serverError}`);
      }
    } else {
      toast.error("אירעה שגיאה לא צפויה בעת הבגד");
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
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      const status = error.response?.status || 501;

      if (status === 400) {
        toast.error("שגיאה בקבלת נתונים בשרת, נסה שוב.");
      } else if(status===500){
        toast.error(`שגיאת שרת: ${serverError}`);
      } else{
        toast.error("אירעה שגיאה לא צפויה בשרת");
      }
    } else {
      toast.error(" אירעה שגיאה לא צפויה בעת טעינת הבגדים");
    }
    throw error;
  }
};

export const deleteGarment = async (garmentId: string) => {
  try {
    const response = await axios.delete(`${apiUrl}garmentRoute/${garmentId}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      const status = error.response?.status || 501;

      if (status === 400) {
        toast.error("שגיאה בקבלת נתונים בשרת, נסה שוב.");
      } else if(status===404){
        toast.error("בגד זה לא נמצא במערכת")
      } else if(status===500){
        toast.error(`שגיאת שרת: ${serverError}`);
      }else{
        toast.error("אירעה שגיאה לא צפויה בשרת");
      }
    } else {
      toast.error(" שגיאה לא צפויה בעת מחיקת הבגד זה");
    }
    throw error;
  }
}
