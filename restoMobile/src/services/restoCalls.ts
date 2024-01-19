import axios from 'axios';

const baseURL = "http://195.90.210.111:8081/";

export const getAllResto = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: baseURL + 'api/restaurants/',
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all restaurants:', error);
      throw new Error('Failed to fetch all restaurants');
    }
  };