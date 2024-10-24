import axios from "axios";
// @ts-ignore
import { API_URL } from '@env';

const baseUrl =
  `${API_URL}profile/resto/`;

export const getProfileDetails = async (token: string) => {
  try {
    if (baseUrl === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: "GET",
      url: baseUrl,
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching the User Details:", error);
    throw new Error("Error fetching the User Details");
  }
};

export const editProfileDetails = async (token: string, body: any) => {
  try {
    if (baseUrl === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: "PUT",
      url: baseUrl,
      params: {key: token},
      data: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200 || response.status === 207) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error editing the User Details:", error);
    throw new Error("Error editing the User Details");
  }
};

export const changePassword = async (token: string, oldPassword: string,
                                     newPassword: string) => {
  try {
    if (baseUrl === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: "PUT",
      url: baseUrl + 'password',
      params: {key: token},
      data: {
        oldPassword: oldPassword,
        newPassword: newPassword
      },
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error changing the password of the Users:", error);
    throw new Error("Error changing the password of the Users");
  }
};

export const changeTwoFactor = async (token: string,
                                      twoFactor: string) => {
  try {
    const response = await axios({
      method: 'PUT',
      url: baseUrl + 'setTwoFactorAuth',
      params: {key: token},
      data: {twoFactor: twoFactor},
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error changing third party token:", error);
  }
};
