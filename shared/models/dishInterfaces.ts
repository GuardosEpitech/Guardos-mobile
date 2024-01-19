import { ICategoryBE, ICategoryFE } from './categoryInterfaces';

export interface IDishBE {
  name: string;
  id: number;
  description: string;
  price: number;
  allergens: string[];
  pictures: string[];
  picturesId?: number[];
  products: string[];
  category: ICategoryBE;
}

export interface IDishFE {
  name: string;
  description: string;
  price: number;
  allergens: string[];
  pictures?: string[];
  picturesId?: number[];
  category: ICategoryFE;
  resto: string;
  products: string[];
}
