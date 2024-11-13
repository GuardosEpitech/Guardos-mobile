import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';
import { IProduct } from '../../../shared/models/restaurantInterfaces';
import { IProductFE } from '../../../shared/models/productInterfaces';

const baseURL = API_URL + "products/";

// export const getAllProducts = async () => {
//     try {
//       if (baseURL === undefined) {
//         throw new Error("baseUrl is not defined");
//       }
//       const response = await axios({
//         method: "GET",
//         url: baseURL,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching all products:", error);
//       throw new Error("Failed to fetch all products");
//     }
//   };

export const getProductsByUser = async (userToken: string) => {
  try {
    if (baseURL === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: "GET",
      url: baseURL + "/user/product",
      params: {key: userToken},
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all products from user:", error);
    throw new Error("Failed to fetch all products from user");
  }
};

export const addNewProduct = async (product: IProduct, restoName: string, token: string) => {
    try {
      if (baseURL === undefined) {
        throw new Error("baseUrl is not defined");
      }
      if (!product.name) {
        console.error("Error adding new product:");
        throw new Error("Failed to add new product");
      }
      console.log(token);
      const response = await axios({
        url: baseURL + restoName,
        method: "POST",
        params: {key: token},
        data: JSON.stringify({
          name: product.name,
          ingredients: product.ingredients,
          allergens: product.allergens,
          resto: restoName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding new product:", error);
      throw new Error("Failed to add new product");
    }
  };

  export const deleteProduct = async (product: any, token: string) => {
    try {
      if (baseURL === undefined) {
        throw new Error("baseUrl is not defined");
      }
      const response = await axios({
        url: baseURL + product.name,
        method: "DELETE",
        params: {key: token},
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(product),
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }
  };
  
  export const editProduct = async (product: IProductFE, originalProductName: string, token: string) => {
    try {
      if (baseURL === undefined) {
        throw new Error("baseUrl is not defined");
      }
      const response = await axios({
        url: baseURL + originalProductName,
        method: "PUT",
        params: {key: token},
        data: JSON.stringify({
          name: product.name,
          ingredients: product.ingredients,
          allergens: product.allergens,
          restaurantId: product.restaurantId
        }),
        headers: {
          "content-type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error editing product:", error);
      throw new Error("Failed to edit product");
    }
  };
