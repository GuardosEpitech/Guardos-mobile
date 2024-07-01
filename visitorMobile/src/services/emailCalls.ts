import axios from 'axios';
import { IContactForm, IRequestUser } from '../models/emailInterfaces';
// @ts-ignore
import { API_URL } from '@env';

const baseUrl = `${API_URL}sendEmail/`;
const featureURL =`${API_URL}featureRequest`;
const supportURL = `${API_URL}userSupport`;

export const sendEmail = async (fromData: IContactForm) => {
    try {
        const response = await axios({
            method: "POST",
            url: baseUrl,
            data: fromData,
        });
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending email");
    }
}
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
