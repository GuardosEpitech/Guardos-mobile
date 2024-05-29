import axios from "axios";
// @ts-ignore
import { API_URL2 } from '@env';

export const getQRCodeByName = async (name: string) => {
    console.log("QR code by name:", `http://localhost:8081/api/qrcode/${name}`);
    try {
      const response = await axios({
        url: `http://localhost:8081/api/qrcode/${name}`,
        method: "GET",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching QR code by name:", error);
      throw new Error("Failed to fetch QR code by name");
    }
  };