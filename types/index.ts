export interface Location {
  lat: number;
  lng: number;
  name?: string;
}

export interface WeatherData {
  location: Location;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  icon: string;
  timestamp: number;
}

export interface RoutePoint {
  location: Location;
  weather?: WeatherData;
}
