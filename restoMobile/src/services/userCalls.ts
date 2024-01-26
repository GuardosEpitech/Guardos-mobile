import axios from "axios";
// @ts-ignore
import { API_URL } from '@env';

const baseUrl = `${API_URL}login/`;

export const checkIfTokenIsValid = async (body: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'restoWeb/checkIn',
      params: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching the Users:", error);
    throw new Error("Error fetching the Users");
  }
};


export const loginUser = async (userData: any) => {
  try {
    const response = await axios.post(baseUrl + 'restoWeb', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Error logging in");
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(API_URL + "register", userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error registering user:", error);
    throw new Error("Error registering user");
  }
}
