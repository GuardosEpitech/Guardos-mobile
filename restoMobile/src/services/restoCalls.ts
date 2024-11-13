import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';

const baseURL = API_URL;
const menuDesignUrl = `${API_URL}menuDesigns/`;

export const getAllResto = async () => {
  try {
    if (baseURL === undefined) {
      throw new Error("baseUrl is not defined");
    }
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
    if (baseURL === undefined) {
      throw new Error("baseUrl is not defined");
    }
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

export const getAllRestaurantsByUserAndFilter = async (token: string, filter: string) => {
  try {
    if (baseURL === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: "POST",
      url: baseURL + 'search/restaurants/',
      data: { "token": token,"filter": filter },
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
    if (baseURL === undefined) {
      throw new Error("baseUrl is not defined");
    }
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

export const getAllRestaurantChainsByUser = async (token:string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseURL + 'restaurants/user/resto/chain',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all restaurant chains:", error);
  }
};

export const addRestaurant = async(restaurantData: any) => {
  try {
    if (baseURL === undefined) {
      throw new Error("baseUrl is not defined");
    }
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

export const deleteRestaurantByName = async (restaurantName: string, token: string) => {
  try {
    if (baseURL === undefined) {
      throw new Error("baseUrl is not defined");
    }
    await axios({
      method: 'DELETE',
      params: {key: token},
      url: baseURL +'restaurants/' + restaurantName,
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw new Error('Failed to delete restaurant');
  }
};

export const getAllMenuDesigns = async (token: string) => {
  try {
    if (menuDesignUrl === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: "GET",
      url: menuDesignUrl,
      params: {key: token}
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all menu designs:", error);
    throw new Error("Failed to fetch all menu designs");
  }
};

export const editResto = async (restoName: string, body: any, token: string) => {
  try {
    if (baseURL === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      url: baseURL + 'restaurants/' + restoName,
      method: "PUT",
      params: {key: token},
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
    if (baseURL === undefined) {
      throw new Error("baseUrl is not defined");
    }
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

export const getRestoStatistics = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseURL + 'statistics/restaurant',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching the Users:", error);
  }
};
