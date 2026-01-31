import axios from 'axios';
import { Location } from '@/types';

// Using Nominatim (OpenStreetMap's free geocoding service)
// No API key required, but please be respectful with rate limits
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

/**
 * Search for locations by address
 * @param query - Address or place name to search for
 * @param countryCode - Optional country code to limit results (e.g., 'ca' for Canada)
 */
export async function searchAddress(
  query: string,
  countryCode: string = 'ca'
): Promise<GeocodingResult[]> {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        countrycodes: countryCode,
        limit: 5,
      },
      headers: {
        'User-Agent': 'CanadianRoadWeatherApp/1.0',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error searching address:', error);
    return [];
  }
}

/**
 * Convert a geocoding result to a Location object
 */
export function geocodingResultToLocation(result: GeocodingResult): Location {
  const city = result.address?.city || result.address?.town || result.address?.village || '';
  const state = result.address?.state || '';
  const name = city && state ? `${city}, ${state}` : result.display_name;

  return {
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
    name: name,
  };
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'CanadianRoadWeatherApp/1.0',
      },
    });

    const address = response.data.address;
    const city = address.city || address.town || address.village || '';
    const state = address.state || '';

    return city && state ? `${city}, ${state}` : response.data.display_name;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return '';
  }
}
