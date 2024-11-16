import { ICategoryBE, ICategoryFE } from './categoryInterfaces';

export interface IDishBE {
  name: string;
  uid: number;
  description: string;
  price: number;
  allergens: string[];
  pictures: string[];
  picturesId?: number[];
  products: string[];
  category: ICategoryBE;
  restoChainID: number;
}

export interface IDishFE {
  name: string;
  uid: number;
  description: string;
  price: number;
  allergens: string[];
  pictures?: string[];
  picturesId?: number[];
  category: ICategoryFE;
  resto: string;
  restoChainID: number;
  products: string[];
  fitsPreference?: boolean;
  discount: number;
  validTill: string;
  combo: number[];
}

export interface IAddDish {
  resto: string;
  dish: IDishFE;
  restoChainID: number;
}
