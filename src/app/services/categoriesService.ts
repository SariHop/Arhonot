'use server'
import axios from "axios";
import { toast } from "react-toastify";



const baseUrl=process.env.NEXT_PUBLIC_BASE_URL;
const apiUrl = `${baseUrl}/api/staticData`

export const fetchSeasons = async () => {
    try {
        const response = await axios.get(`${apiUrl}/categories`);
        return response.data.seasons;
    } catch (error) {
        console.error("Error getting seasons:", error);
        toast.error("שגיאה בקבלת עונות");
        return [];
    }
};


export const fetchTypes =async () => {
    try {
        const response = await axios.get(`${apiUrl}/categories`);
        return response.data.types;
    } catch (error) {
        console.error("Error getting types:", error);
        toast.error("שגיאה בקבלת קטגוריות לבוש");
        return [];
    }
}


export const fetchTags =async () => {
    try {
        const response = await axios.get(`${apiUrl}/categories`);
        return response.data.tags;
    } catch (error) {
        console.error("Error getting tags:", error);
        toast.error("שגיאה בקבלת תגיות");
        return [];
    }
}


export const fetchCities =async () => {
    try {
        const response = await axios.get(`${apiUrl}/cities`);        
        return response.data.cities;
    } catch (error) {
        console.error("Error getting cities:", error);
        toast.error("שגיאה בקבלת ערי ישראל");
        return [];
    }
}
