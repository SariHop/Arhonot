import axios from "axios";
import { toast } from "react-toastify";
import { IOutfitType } from "@/app/types/IOutfit";
import { Types } from "mongoose";

export const apiUrl = "/api/";

export const fetchOutfits = async (userId: Types.ObjectId) => {
    try {
        const response = await axios.get(`${apiUrl}outfitRoute/gallery/${userId.toString()}`);
        return response.data
    } catch (error) {
        console.error("Failed to fetch outfits:", error);
        if (axios.isAxiosError(error)) {
          const serverError = error.response?.data?.error || "Unknown server error";
          const status = error.response?.status || 501;
    
          if (status === 400) {
            toast.error("שגיאה בקבלת נתונים בשרת, נסה שוב.");
          } 
          else if(status===500){
            toast.error(`שגיאת שרת: ${serverError}`);
          }
          else{
            toast.error("אירעה שגיאה לא צפויה בשרת");
          }
        } else {
          toast.error(" אירעה שגיאה לא צפויה בעת טעינת הלוקים ");
        }
        throw error;
    }
};

export async function updateOutfit(formData: IOutfitType, id:string) {
  try {
    const response = await axios.put(`${apiUrl}outfitRoute/${id}`, formData);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      const status = error.response?.status || 501;

      if (status === 400) {
        toast.error("שגיאה בקבלת נתונים בשרת, נסה שוב.");
      } else if(status===404){
        toast.error("הלוק לא נמצא במערכת")
      } else if(status===500){
        toast.error(`שגיאת שרת: ${serverError}`);
      }else{
        toast.error("אירעה שגיאה לא צפויה בשרת");
      }
    } else {
      toast.error(" אירעה שגיאה לא צפויה בעת עדכון הלוק");
    }
    throw error;
  }
}

export async function createOutfit(formData: IOutfitType) {
  try {
    const response = await axios.post(`${apiUrl}outfitRoute`, formData);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      const status = error.response?.status || 501;

      if(status===500){
        toast.error(`שגיאת שרת: ${serverError}`);
      } else{
        toast.error("אירעה שגיאה לא צפויה בשרת");
      }
    } else {
      toast.error("אירעה שגיאה לא צפויה בעת יצירת הלוק");
    }
    throw error;
  }
}

export async function updateOutfitFavorite(outfitId: string, favorite: number) {
  try {
    const response = await axios.put(`${apiUrl}outfitRoute/${outfitId}`, {favorite});
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      const status = error.response?.status || 501;

      if (status === 400) {
        toast.error("שגיאה בקבלת נתונים בשרת, נסה שוב.");
      } else if(status===404){
        toast.error("לוק זה לא נמצא במערכת")
      } else if(status===500){
        toast.error(`שגיאת שרת: ${serverError}`);
      } else{
        toast.error("אירעה שגיאה לא צפויה בשרת");
      }
    } else {
      toast.error(" אירעה שגיאה לא צפויה בעת עדכון הדירוג ללוק זה");
    }
    throw error;
  }
}

export const deleteOutfit = async (outfitId: string) => {
  try {
    const response = await axios.delete(`${apiUrl}outfitRoute/${outfitId}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      const status = error.response?.status || 501;

      if (status === 400) {
        toast.error("שגיאה בקבלת נתונים בשרת, נסה שוב.");
      } else if(status===404){
        toast.error("לוק זה לא נמצא במערכת")
      } else if(status===500){
        toast.error(`שגיאת שרת: ${serverError}`);
      }else{
        toast.error("אירעה שגיאה לא צפויה בשרת");
      }
    } else {
      toast.error(" שגיאה לא צפויה בעת מחיקת לוק זה");
    }
    throw error;
  }
}
