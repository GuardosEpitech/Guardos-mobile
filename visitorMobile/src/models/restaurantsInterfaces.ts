export interface ICommunication {
  allergenList?: string[];
  location?: string;
  name?: string;
  rating?: number[];
  range?: number;
  categories?: string[];
}

export interface IRestaurantFrontEnd {
    name: string;
    uid: number;
    phoneNumber: string;
    website: string;
    description: string;
    pictures: string[];
    hitRate?: number;
    range: number;
    rating: number;
    ratingCount?: number;
    isFavouriteResto?: boolean;
  }
