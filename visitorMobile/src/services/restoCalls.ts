import axios from 'axios';
import { IRestaurantFrontEnd } from '../../../shared/models/restaurantInterfaces';
// @ts-ignore
import { API_URL } from '@env';

const baseUrl = `${API_URL}filter/`;
const baseUrlResto = `${API_URL}restaurants/`;

const selectedURL = `${baseUrl}filteredlist`;

export const getFilteredRestos = async (body: any) => {
    try {
        const response = await axios({
            method: 'POST',
            url: baseUrl,
            data: JSON.stringify(body),
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

export const getSelectedFilteredRestos = async (body: any) => {
    try {
        const response = await axios({
            method: 'POST',
            url: selectedURL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const filteredRestos = response.data.filter((resto: IRestaurantFrontEnd) =>
      !!resto.location?.latitude && !!resto.location?.longitude
    );
        return filteredRestos;
    } catch (error) {
        console.error(`Error in getFilteredRestos: ${error}`);
        throw error;
    }
}

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
