import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';

const baseUrlResto = `${API_URL}restaurants/`;

const newURL = `${API_URL}filter/newFilter`;

export const getAllResto = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: baseUrlResto,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all restaurants:', error);
      throw new Error('Failed to fetch all restaurants');
    }
  };

export const getFilteredRestosNew = async (body: any) => {
    try {
        const response = await axios({
            method: 'POST',
            url: newURL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error filtering restaurants:', error);
        throw new Error('Failed to filter restaurants');
    }
}
