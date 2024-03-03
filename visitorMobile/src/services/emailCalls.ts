import axios from 'axios';
import { IContactForm } from '../models/emailInterfaces';
// @ts-ignore
import { API_URL } from '@env';

const baseUrl = `${API_URL}sendEmail/`;

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