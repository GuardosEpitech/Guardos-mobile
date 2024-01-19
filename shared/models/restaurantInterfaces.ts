import { ICategories } from './categoryInterfaces';
import {IDishBE, IDishFE} from './dishInterfaces';
import { ILocation } from './locationInterfaces';
import { IMealType } from './mealTypeInterfaces';

export interface IProduct {
  name: string;
  allergens: string[];
  ingredients: string[];
}

export interface IIngredient {
  name: string;
}

export interface IAction {
  actionName: string;
  actionIcon: any;
  actionRedirect: string;
  redirectProps?: any;
}

export interface IRestoName {
  name: string;
}

//0 == Monday, 1 == Tuesday, 2 == Wednesday, 3 == Thursday, 4 == Friday, 5 == Saturday, 6 == Sunday
// 7 == All days
export interface IOpeningHours {
  open?: string;
  close?: string;
  day?: number;
}

export interface IRestaurantFrontEnd {
  name: string;
  id: number;
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

export interface IRestaurantBackEnd {
  id: number;
  name: string;
  phoneNumber: string;
  website: string;
  rating: number;
  ratingCount: number;
  openingHours: IOpeningHours[];
  pictures: string[];
  picturesId?: number[];
  description: string;
  dishes: IDishBE[];
  location: ILocation;
  mealType: IMealType[];
  extras: IDishBE[];
  products: IProduct[];
}
