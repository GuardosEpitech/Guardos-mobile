export interface Dish {
    category: {
      menuGroup: string;
      foodGroup: string;
      extraGroup: string[];
    };
    picturesId: number[];
    name: string;
    description: string;
    products: string[];
    pictures: string[];
    price: number;
    allergens: string[];
  }