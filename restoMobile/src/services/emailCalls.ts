import axios from 'axios';
import { IRequestUser } from '../models/emailInterfaces';
// @ts-ignore
import { API_URL } from '@env';

const baseUrl = `${API_URL}sendEmail/`;
const featureURL =`${API_URL}featureRequest`;

export const sendFeatureRequest = async (fromData: IRequestUser) => {
    try {
        const response = await axios({
            method: 'POST',
            url: featureURL,
            data: fromData,
            headers: {
            'Content-Type': 'application/json',
            },
        });
        } catch (error) {
        console.error(`Error in Post Route: ${error}`);
        throw error;
    }
}