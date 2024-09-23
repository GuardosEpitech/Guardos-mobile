import axios from "axios";
// @ts-ignore
import { API_URL } from '@env';

export const getRestosMenu = async (restoId: number, allergenList: string[], dislikedIngredients: string[]) => {
  try {
    const response = await axios({
      method: "POST",
      url: API_URL + 'menu',
      data: JSON.stringify({
        restoID: restoId,
        allergenList: allergenList,
        dislikedIngredientsList: dislikedIngredients
      }),
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
    console.error("Error fetching the Users:", error);
    throw new Error("Error fetching the Users");
  }
};

export const getDishesByID = async(restoName: string, body: any) => {
  try {
    const response = await axios({
      url: API_URL + 'dishes/dishIDs',
      method: "POST",
      params: {key: restoName},
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dishes by id:", error);
  }
}
