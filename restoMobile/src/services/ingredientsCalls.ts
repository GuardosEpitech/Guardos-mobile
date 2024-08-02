import axios from "axios";
// @ts-ignore
import { API_URL } from '@env';

const baseUrl = `${API_URL}ingredients/`;

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

export const addIngredient = async (ingredient: any, timeout = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: ingredient
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('This request took too long to complete. Please try again or check for a spelling mistake.');
    } else {
      throw new Error(`Failed to add ingredient: ${error.message}`);
    }
  }
};

// import axios from "axios";
//
// const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/ingredients/`;
//
// export const getAllIngredients = async () => {
//   try {
//     const response = await axios({
//       method: "GET",
//       url: baseUrl + "api/ingredients" + "/",
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching all ingredients:", error);
//   }
// };