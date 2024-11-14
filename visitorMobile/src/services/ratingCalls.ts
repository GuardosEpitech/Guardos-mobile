import axios from "axios";

// @ts-ignore
import { API_URL } from '@env';

const baseUrl =
    `${API_URL}`;



export const getRatingData = async (name: string) => {
        const response = await axios({
            method: "GET",
            url: baseUrl + `review/restaurants/${name}`,
            headers: {
                "content-type": "application/json",
            },
        });
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
};

export const getRatingDataUser = async (userName: string) =>
  axios
    .get(`${baseUrl}review/${userName}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });

export const deleteRatingDataUser = async (
  reviewId: string,
  restoName: string
) =>
  axios
    .delete(`${baseUrl}review/restaurants/${restoName}/${reviewId}`)
    .then(function (response) {
      console.log(`Deleted post with ID ${reviewId}`);
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });

export const postRatingData = async (
  name: string,
  comment: string,
  note: number,
  userName: string
) =>
  axios
    .post(`${baseUrl}review/restaurants/${name}`, { comment, note, userName })
    .then(function (response) {
      console.log(`Post with ID ${userName}`);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
