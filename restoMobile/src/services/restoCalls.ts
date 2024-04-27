import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';
import { faA } from '@fortawesome/free-solid-svg-icons';

const baseURL = API_URL;
const menuDesignUrl = `${API_URL}menuDesigns/`;

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

export const getAllMenuDesigns = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: menuDesignUrl
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all menu designs:", error);
    throw new Error("Failed to fetch all menu designs");
  }
};

export const editResto = async (restoName: string, body: any) => {
  try {
    const response = await axios({
      url: baseURL + 'restaurants/' + restoName,
      method: "PUT",
      data: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error editing restaurant:", error);
    throw new Error("Failed to edit restaurant");
  }
};

export const getRestoByName = async (restoName: string) => {
  try {
    const response = await axios({
      url: baseURL + 'restaurants/' + restoName,
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing restaurant:", error);
    throw new Error("Failed to edit restaurant");
  }
};

export const updateRestoCategories = async (userToken: string, uid: number, newCategories: any) => {
  try {
    const response = await axios({
      url: baseURL + 'restaurants/updateCategories', 
      method: 'POST',
      data: {
        userToken: userToken,
        uid: uid,
        newCategories: newCategories
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user categories:', error);
    throw new Error('Failed to update user categories');
  }
};