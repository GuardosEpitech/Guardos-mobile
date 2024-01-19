export interface IProductBE {
  name: string;
  id: number;
  allergens: string[];
  ingredients: string[];
  restaurantId: number[];
}

export interface IProductFE {
  name: string;
  id: number;
  allergens: string[];
  ingredients: string[];
  restaurantId: number[];
}