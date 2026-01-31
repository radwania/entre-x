import axios from 'axios';
import { Location, WeatherData } from '@/types';

// You can get a free API key from https://openweathermap.org/api
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeatherForLocation(location: Location): Promise<WeatherData | null> {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: location.lat,
        lon: location.lng,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;

    return {
      location,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      visibility: data.visibility ? Math.round(data.visibility / 1000) : 0, // Convert to km
      icon: data.weather[0].icon,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

export async function getWeatherAlongRoute(points: Location[]): Promise<WeatherData[]> {
  const weatherPromises = points.map(point => getWeatherForLocation(point));
  const results = await Promise.all(weatherPromises);
  return results.filter((weather): weather is WeatherData => weather !== null);
}

export function getWeatherIcon(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
