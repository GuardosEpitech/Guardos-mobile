import axios from 'axios';
// @ts-ignore

import { API_URL } from '@env';

const baseUrl = API_URL + "categories/";

export const getCategories = async (userToken: string) => {
  try {
    const response = await axios({
      method: 'GET',
      url: baseUrl,
      params: {key: userToken},
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in getFilteredRestos: ${error}`);
    throw error;
  }
}