import { ILocation } from "../../../shared/models/locationInterfaces";
import { ICategories } from "../../../shared/models/categoryInterfaces";
import { IOpeningHours, IProduct } from "../../../shared/models/restaurantInterfaces";
import { IDishFE } from "../../../shared/models/dishInterfaces";


export interface ICommunication {
  allergenList?: string[];
  location?: string;
  name?: string;
  rating?: number[];
  range?: number;
  categories?: string[];
}

  export interface IRestaurantFrontEnd {
    name: string;
    uid: number;
    userID: number;
    phoneNumber: string;
    website: string;
    description: string;
    categories: ICategories[];
    location: ILocation;
    openingHours: IOpeningHours[];
    pictures: string[];
    picturesId?: number[];
    hitRate?: number;
    range: number;
    rating: number;
    ratingCount?: number;
    products: IProduct[];
    dishes: IDishFE[];
  }