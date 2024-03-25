import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';
import {IAddDish, IDishFE} from "../../../shared/models/dishInterfaces";
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

export const changeDishByName = async (dish: IDishFE, restaurant: string) => {
    try {
        const response = await axios({
            method: "PUT",
            url: baseURL + restaurant,
            data: dish,
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log("Error 404: Not Found");
            return null;
        } else {
            console.error("Error changing dish:", error);
            return "ERROR";
        }
    }
}

export const addDish = async (dish: IAddDish, restaurant: string) => {
    try {
        const response = await axios({
            method: "POST",
            url: baseURL + restaurant,
            data: dish,
        });
        return response.data;
    } catch (error) {
        console.error("Error adding dish:", error);
        return "ERROR";
    }
}

export const getDishesByUser = async (userToken: string) => {
    try {
        const response = await axios({
            method: "GET",
            params: {key: userToken},
            url: baseURL + 'user/dish',
            headers: {
                "content-type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching all dishes from user:", error);
        throw new Error("Failed to fetch all dishes from user");
    }
};

export const getDishesByResto = async (restaurantName: string) => {
    return(await fetch(`${baseURL}${restaurantName}`));
};
