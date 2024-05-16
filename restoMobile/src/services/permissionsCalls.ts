import axios from "axios";
// @ts-ignore
import { API_URL } from '@env';

const baseUrl = `${API_URL}permissions/resto`;

export const getRestoUserPermission = async (token: string) => {
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
    console.error("Error fetching the User Permissions:", error);
    throw new Error("Error fetching the User Permissions");
  }
};

export const addRestoUserPermissions = async (token: string, permissions: string[]) => {
  try {
    if (baseUrl === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: 'POST',
      url: baseUrl + '/addPermissions',
      params: {key: token},
      data: {
        permissions: permissions
      },
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding user permissions:", error);
    throw new Error("Error adding user permissions");
  }
};

export const removeRestoUserPermissions = async (token: string, permissions: string[]) => {
  try {
    if (baseUrl === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: "PUT",
      url: baseUrl + '/removePermissions',
      params: {key: token},
      data: {
        permissions: permissions
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
    console.error("Error removing user permissions:", error);
    throw new Error("Error removing user permissions");
  }
};

export const deleteAllRestoUserPermissions = async (token: string) => {
  try {
    if (baseUrl === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: 'DELETE',
      url: baseUrl + '/deleteAllPermissions',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting all user permissions:", error);
    throw new Error("Error deleting all user permissions");
  }
};
