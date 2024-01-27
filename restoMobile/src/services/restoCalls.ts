import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';

const baseURL = API_URL;

export const getAllResto = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: baseURL + 'restaurants/',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all restaurants:', error);
    throw new Error('Failed to fetch all restaurants');
  }
};

export const getAllRestaurantsByUser = async (body: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseURL + 'restaurants/user/resto',
      params: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    throw new Error("Failed to fetch all restaurants");
  }
};

export const getRestaurantByName = async(name: string) => {
  try {
    const response = await axios({
      method: 'GET',
      url: baseURL + 'restaurants/'+name,
      headers: {
        'content-type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    throw new Error('Failed to fetch restaurant');
  }
}
