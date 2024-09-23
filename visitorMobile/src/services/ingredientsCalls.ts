import axios from "axios";
// @ts-ignore
import { API_URL } from "@env";

const baseUrl = API_URL + "ingredients/";

export const getAllIngredients = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all ingredients:", error);
  }
};

export const addIngredient = async (ingredient: string) => {
  try {
    await axios({
      url: baseUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        name: ingredient
      }),
    });
    return true;
  } catch (error) {
    console.error("Error adding ingredient:", error);
  }
};
