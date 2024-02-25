import axios from "axios";
// @ts-ignore
import { API_URL } from "@env";

const baseUrl = API_URL + "images/";


export const getImages = async (imageIds: number[]) => {
  try {
    const response = await axios({
      headers: {
        "content-type": "application/json",
      },
      method: "GET",
      url: baseUrl+"?imageIds="+imageIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw new Error("Failed to fetch images");
  }
};

export const deleteImageRestaurant =
  async (imageId: number, restaurantName: string) => {
    try {
      const body = {
        restaurant: restaurantName,
        imageId: imageId
      };
      const response = await axios({
        url: baseUrl,
        method: "DELETE",
        data: body,
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

export const addImageResto = async (restaurantName: string,
                                    imageName: string, contentType: string, size: number, base64: string) => {
  try {
    const body = {
      restaurant: restaurantName,
      image: {
        filename: imageName,
        contentType: contentType,
        size: size,
        base64: base64,
      },
    };
    const response = await axios({
      url: baseUrl,
      method: "POST",
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding image:", error);
    throw new Error("Failed to add image");
  }
};

export const addImageDish = async (restaurantName: string, dishName: string,
                                   imageName: string, contentType: string, size: number, base64: string) => {
  try {
    const body = {
      restaurant: restaurantName,
      dish: dishName,
      image: {
        filename: imageName,
        contentType: contentType,
        size: size,
        base64: base64,
      },
    };
    const response = await axios({
      url: baseUrl,
      method: "POST",
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  }
  catch (error) {
    console.error("Error adding image:", error);
    throw new Error("Failed to add image");
  }
};

export const deleteImageDish = async (imageId: number, restaurantName: string,
                                      dishName: string) => {
  try {
    const body = {
      restaurant: restaurantName,
      dish: dishName,
      imageId: imageId
    };
    const response = await axios({
      url: baseUrl,
      method: "DELETE",
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
};
