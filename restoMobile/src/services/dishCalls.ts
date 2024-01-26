import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';
const baseURL = API_URL + "dishes/";


export const getAllDishes = async () => {
    try {
        const response = await axios({
        method: "GET",
        url: baseURL,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching all dishes:", error);
        throw new Error("Failed to fetch all dishes");
    }
}

export const deleteDishByName = async (restaurant: string, name: string) => {
    try {
        const data = {name : name}
        const response = await axios({
        method: "DELETE",
        url: baseURL + restaurant,
        data: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting dish:", error);
        throw new Error("Failed to delete dish");
    }
}