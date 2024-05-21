import axios from "axios";
// @ts-ignore
import { API_URL } from '@env';

const baseUrl = `${API_URL}login/`;
const baseUrl1 = `${API_URL}user/`;
const baseUrlEmail = `${API_URL}sendEmail/`;
const baseUrlProfile = `${API_URL}profile/`;

export const checkIfTokenIsValid = async (body: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'checkIn',
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
    const response = await axios.post(baseUrl, userData, {
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

export const sendRecoveryLinkForVisitorUser = async (body: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrlEmail + 'userVisitor/sendPasswordRecovery',
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking visitor user:", error);
    throw new Error("Error checking visitor user");
  }
}

export const checkIfVisitorUserExist = async (body: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl1 + 'userVisitorExist',
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking visitor user:", error);
    throw new Error("Error checking visitor user");
  }
};

export const deleteAccount = async (token: string) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: `${API_URL}delete/`,
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
    console.error("Error deleting the User:", error);
    throw new Error("Error deleting the User");
  }
};

export const getUserAllergens = async (token: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: API_URL + 'user/allergens/get',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching the User allergens:", error);
    throw new Error("Error fetching the User allergens");
  }
};

