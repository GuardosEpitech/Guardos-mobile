export interface Dish {
  category: {
    menuGroup: string;
    foodGroup: string;
    extraGroup: string[];
  };
  picturesId: string[];
  name: string;
  uid: number;
  description: string;
  products: string[];
  pictures: string[];
  price: number;
  allergens: string[];
}

export interface ICategoryFE {
  foodGroup: string,
  extraGroup: string[],
  menuGroup: string
}

export interface IDishFE {
  name: string;
  uid: number;
  description: string;
  price: number;
  allergens: string[];
  fitsPreference?: boolean;
  pictures?: string[];
  picturesId?: number[];
  category: ICategoryFE;
  resto: string;
  products: string[];
  discount: number;
  validTill: string;
  combo: number[];
}
