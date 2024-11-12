import axios from "axios";
// @ts-ignore
import { API_URL } from '@env';

const baseUrl =
    `${API_URL}qrcode`;

export const addQRCode = async (body: any) => {
    try {
        const response = await axios({
            url: baseUrl,
            method: "POST",
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding new restaurant:", error);
        throw new Error("Failed to add new restaurant");
    }
};

export const getQRCodeByNameBase64 = async (uid: string) => {
    try {
        const response = await axios({
            url: `${baseUrl}/base64/${uid}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching QR code by uid:", error);
        throw new Error("Failed to fetch QR code by uid");
    }
};

export const getQRCodeByName = async (uid: string) => {
    try {
        const response = await axios({
            url: `${baseUrl}/${uid}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching QR code by uid:", error);
        throw new Error("Failed to fetch QR code by uid");
    }
};