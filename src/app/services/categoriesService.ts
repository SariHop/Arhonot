import axios from "axios";

const apiUrl = '/api/staticData'

export const fetchSeasons = async () => {
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


export const fetchCities =async () => {
    try {
        const response = await axios.get(`${apiUrl}/cities`);
        return response.data.types;
    } catch (error) {
        console.error("Error getting types:", error);
        throw error;
    }
}