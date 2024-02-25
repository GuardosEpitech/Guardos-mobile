import { IDishBE } from './dishInterfaces';
import { ILocation } from './locationInterfaces';
import { IMealType } from './mealTypeInterfaces';
import { IOpeningHours, IProduct } from './restaurantInterfaces';

export interface IIngredientsCommunication {
  name?: string;
  id?: number;
  allergens?: string[];
}

export interface IDishesCommunication {
  name?: string;
  description?: string;
  price?: number;
  products?: string[];
  pictures?: string[];
  allergens?: string[];
  category?: {
    menuGroup: string,
    foodGroup: string,
    extraGroup: string[],
  },
}

export interface IRestaurantCommunication {
  name: string;
  phoneNumber?: string;
  website?: string;
  openingHours?: IOpeningHours[];
  pictures?: string[];
  description?: string;
  dishes?: IDishBE[];
  location?: ILocation;
  mealType?: IMealType[];
  extras?: IDishBE[];
  products?: IProduct[];
}

//Communication object for BE and FE
//This is the object that is sent to the backend from the frontend
export interface ISearchCommunication {
  filterName?: string;
  range?: number;
  rating?: number[]; //2 float rating lowest and highest
  name?: string;
  location?: string;
  categories?: string[];
  allergenList?: string[];
}
