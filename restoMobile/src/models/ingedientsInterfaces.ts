export interface IIngredients {
    name: string;
}

export interface Restaurant {
    id: string;
    name: string;
    // Other properties...
  }

  export interface Product {
    id: string;
    name: string;
    // Other properties...
  }

  // export interface ISearchCommunication {
  //   range?: number;
  //   rating?: number[]; //2 float rating lowest and highest
  //   categories?: string[];
  //   allergenList?: string[];
  // }

  export interface ISearchCommunication {
    range?: any;
    rating?: any; //2 float rating lowest and highest
    categories?: any;
    allergenList?: any;
  }
  