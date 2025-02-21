import { IDishFE } from './dishInterfaces';

export interface ICategoryFE {
  foodGroup: string,
  extraGroup: string[],
  menuGroup: string
}

export interface ICategories {
  name: string;
  hitRate: number;
  dishes: IDishFE[];
}

export interface ICategoryBE {
  menuGroup: string,
  foodGroup: string,
  extraGroup: string[]
}

export interface ICategory {
  name: string;
  hitRate: number;
  edited?: boolean;
}
