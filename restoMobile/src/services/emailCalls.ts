import axios from 'axios';
import { IRequestUser } from '../models/emailInterfaces';
// @ts-ignore
import { API_URL } from '@env';

const featureURL =`${API_URL}featureRequest`;
const supportURL = `${API_URL}userSupport`;

export const sendFeatureRequest = async (fromData: IRequestUser) => {
    try {
        if (featureURL === undefined) {
            throw new Error("baseUrl is not defined");
        }
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

export const sendUserSupport = async (fromData: IRequestUser) => {
    try {
        if (supportURL === undefined) {
            throw new Error("baseUrl is not defined");
        }
        const response = await axios({
            method: 'POST',
            url: supportURL,
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
