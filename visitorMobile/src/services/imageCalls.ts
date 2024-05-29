import axios from "axios";
// @ts-ignore
import { API_URL } from "@env";

const baseUrl = "http://195.90.210.111:8081/api/" + "images/";


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

