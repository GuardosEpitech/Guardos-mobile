import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';

const baseURL = API_URL + 'restaurants/';

export const getAllResto = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: baseURL,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all restaurants:', error);
      throw new Error('Failed to fetch all restaurants');
    }
  };