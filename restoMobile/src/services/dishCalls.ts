import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';
import {IAddDish, IDishFE} from "../../../shared/models/dishInterfaces";
const baseURL = API_URL + "dishes/";

export const deleteDishByName = async (restaurant: string, name: string, token: string) => {
    try {
        if (baseURL === undefined) {
            throw new Error("baseUrl is not defined");
        }
        const data = {name : name}
        const response = await axios({
          method: "DELETE",
          params: {key: token},
          url: baseURL + restaurant,
          data: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting dish:", error);
        throw new Error("Failed to delete dish");
    }
}

export const changeDishByName = async (dish: IDishFE, restaurant: string, token: string, oldName: string) => {
    try {
        if (baseURL === undefined) {
            throw new Error("baseUrl is not defined");
        }
        const response = await axios({
            method: "PUT",
            params: {key: token},
            url: baseURL + restaurant,
            data: JSON.stringify({
              oldName: oldName,
              name: dish.name,
              uid: dish.uid,
              description: dish.description,
              price: dish.price,
              allergens: dish.allergens,
              picturesId: dish.picturesId,
              category: dish.category,
              resto: dish.category,
              products: dish.products,
              discount: dish.discount,
              validTill: dish.validTill,
              combo: dish.combo,
              restoChainID: dish.restoChainID,
            }),
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log("Error 404: Not Found");
            return null;
        } else {
            console.error("Error changing dish:", error);
            return "ERROR";
        }
    }
}

export const addDish = async (dish: IAddDish, restaurant: string, token: string) => {
    try {
        if (baseURL === undefined) {
            throw new Error("baseUrl is not defined");
        }
        const response = await axios({
            method: "POST",
            params: {key: token},
            url: baseURL + restaurant,
            data: dish,
        });
        return response.data;
    } catch (error) {
        console.error("Error adding dish:", error);
        return "ERROR";
    }
}

export const getDishesByUser = async (userToken: string) => {
    try {
        if (baseURL === undefined) {
            throw new Error("baseUrl is not defined");
        }
        const response = await axios({
            method: "GET",
            params: {key: userToken},
            url: baseURL + 'user/dish',
            headers: {
                "content-type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching all dishes from user:", error);
        throw new Error("Failed to fetch all dishes from user");
    }
};

export const getDishesByResto = async (restaurantName: string) => {
    if (baseURL === undefined) {
        throw new Error("baseUrl is not defined");
    }
    return(await fetch(`${baseURL}${restaurantName}`));
};

export const addDiscount = async (body: any, token: string) => {
    try {
      const response = await axios({
        url: baseURL + 'addDiscount',
        method: "POST",
        params: {key: token},
        data: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding dish discount:", error);
    }
  };
  
  export const removeDiscount = async (body: any, token: string) => {
    try {
      const response = await axios({
        url: baseURL + 'removeDiscount',
        method: "POST",
        params: {key: token},
        data: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting dish discount:", error);
    }
  };

  export const getDishesByResto2 = async (name: string) => {
    try {
      const response = await axios({
        method: "GET",
        url: baseURL + name,
        headers: {
          "content-type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching dishes by resto:", error);
    }
  }
  
  export const addCombo = async (token: string, body: any) => {
    try {
      const response = await axios({
        url: baseURL + 'addCombo',
        method: "POST",
        params: {key: token},
        data: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching dishes by resto:", error);
    }
  }
  
  export const removeCombo = async (token: string, body: any) => {
    try {
      const response = await axios({
        url: baseURL + 'removeCombo',
        method: "POST",
        params: {key: token},
        data: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching dishes by resto:", error);
    }
  }
  
  export const getDishesByID = async(restoName: string, body: any) => {
    try {
      const response = await axios({
        url: baseURL + 'dishIDs',
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
