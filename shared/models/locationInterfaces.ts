export interface ILocation {
  streetName: string,
  streetNumber: string,
  postalCode: string,
  country: string;
  city: string;
  latitude: string;
  longitude: string;
}

export interface ICoordinates {
  lat: number;
  lng: number;
}