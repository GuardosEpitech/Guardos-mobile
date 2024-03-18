import axios from 'axios';

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/favourites/`;

export const addRestoAsFavourite = async (userToken: string, restoID: number) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}resto?key=${userToken}`,
      data: JSON.stringify({ restoID: restoID }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in addRestoAsFavourite: ${error}`);
    throw error;
  }
};

export const addDishAsFavourite = async (userToken: string, restoID: number, dishID: number) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}dish?key=${userToken}`,
      data: JSON.stringify({
        restoID: restoID,
        dishID: dishID
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in addDishAsFavourite: ${error}`);
    throw error;
  }
};

export const deleteRestoFromFavourites = async (userToken: string, restoID: number) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `${baseUrl}resto?key=${userToken}`,
      data: JSON.stringify({ restoID: restoID }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in deleteRestoFromFavourites: ${error}`);
    throw error;
  }
};

export const deleteDishFromFavourites = async (userToken: string, restoID: number, dishID: number) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `${baseUrl}dish?key=${userToken}`,
      data: JSON.stringify({
        restoID: restoID,
        dishID: dishID
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in deleteDishFromFavourites: ${error}`);
    throw error;
  }
};

export const getRestoFavourites = async (userToken: string) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}resto?key=${userToken}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in getRestoFavourites: ${error}`);
    throw error;
  }
};

export const getDishFavourites = async (userToken: string) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}dish?key=${userToken}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in getDishFavourites: ${error}`);
    throw error;
  }
};
