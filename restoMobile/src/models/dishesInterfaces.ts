export interface Dish {
    category: {
      menuGroup: string;
      foodGroup: string;
      extraGroup: string[];
    };
    picturesId: number[];
    name: string;
    uid: number;
    description: string;
    products: string[];
    pictures: string[];
    price: number;
    allergens: string[];
    discount: number;
    validTill: string;
    combo: number[];
  }
