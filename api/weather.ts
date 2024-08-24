import axios from 'axios';
import { API_KEY, API_LOCATE_URL, API_WEATHER_URL } from '@env';

const apiKey = API_KEY;
const locationEndpoint = API_LOCATE_URL;
const weatherEndpoint = API_WEATHER_URL;

// Search Location
export const searchLocation = async (location: string) => {
    const url = `${locationEndpoint}?key=${apiKey}&q=${location}`;

    // Make the API request
    const response = await axios.get(url);

    // Return only top 3 results
    return response.data.slice(0, 3);
};

// Search forecast
export const searchForecast = async (location: string) => {
    const url = `${weatherEndpoint}&key=${apiKey}&q=${location}`;

    // Make the API request
    const response = await axios.get(url);

    // Return only top 3 results
    return response.data;
};
