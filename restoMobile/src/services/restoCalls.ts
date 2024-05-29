import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';

const baseURL = "http://195.90.210.111:8081/api/";

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

export const addRestaurant = async(restaurantData: any) => {
  try {
    const response = await axios({
      method: 'POST',
      url: baseURL + 'restaurants/',
      data: restaurantData,
      headers: {
        'content-type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding restaurant:', error);
    throw new Error('Failed to add restaurant');
  }
}

export const deleteRestaurantByName = async (restaurantName: string) => {
  try {
    await axios({
      method: 'DELETE',
      url: baseURL +'restaurants/' + restaurantName,
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw new Error('Failed to delete restaurant');
  }
};