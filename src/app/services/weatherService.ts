import axios from "axios";
import {apiUrl} from '@/app/services/garmentService'

export const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`${apiUrl}weatherRoute`);
      return response.data;
    } catch (error) {
      console.error('Weather data fetch failed', error);
      throw error;
    }
  };