export interface IRestaurantFrontEnd {
    name: string;
    id: number;
    phoneNumber: string;
    website: string;
    description: string;
    pictures: string[];
    openingHours: string[];
    hitRate?: number;
    range: number;
    rating: number;
    ratingCount?: number;
  }