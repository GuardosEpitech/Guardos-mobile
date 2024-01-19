import {ISearchCommunication} from './communicationInterfaces';
import {IRestaurantFrontEnd} from './restaurantInterfaces';

export interface IFilterObj {
  savedFilter: ISearchCommunication;
  savedRestaurants: IRestaurantFrontEnd[][];
}

export interface IFilterObject {
  allergenList?: string[];
  location?: string;
  name?: string;
  rating?: number[];
  range?: number;
  categories?: string[];
  dishes?: any;
}
