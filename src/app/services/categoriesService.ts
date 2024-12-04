'use server'
import axios from "axios";

const baseUrl=process.env.NEXT_PUBLIC_BASE_URL;
const apiUrl = `${baseUrl}/api/staticData`

export const fetchSeasons = async () => {
    console.log("baseUrl",baseUrl);
    try {
        const response = await axios.get(`${apiUrl}/categories`);
        return response.data.seasons;
    } catch (error) {
        console.error("Error getting seasons:", error);
        throw error;
    }
};


export const fetchTypes =async () => {
    try {
        const response = await axios.get(`${apiUrl}/categories`);
        return response.data.types;
    } catch (error) {
        console.error("Error getting types:", error);
        throw error;
    }
}


export const fetchTags =async () => {
    try {
        const response = await axios.get(`${apiUrl}/categories`);
        return response.data.tags;
    } catch (error) {
        console.error("Error getting tags:", error);
        throw error;
    }
}


export const fetchCities =async () => {
    try {
        const response = await axios.get(`${apiUrl}/cities`);
        return response.data.cities;
    } catch (error) {
        console.error("Error getting cities:", error);
        throw error;
    }
}