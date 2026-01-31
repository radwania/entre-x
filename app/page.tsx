'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import RouteInput from '@/components/RouteInput';
import WeatherSummary from '@/components/WeatherSummary';
import { Location, WeatherData } from '@/types';
import { getWeatherAlongRoute } from '@/lib/weather';
import { getRouteWeatherPoints } from '@/lib/route';

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  const [waypoints, setWaypoints] = useState<Location[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRouteSubmit = async (newWaypoints: Location[]) => {
    setLoading(true);
    setError(null);

    try {
      setWaypoints(newWaypoints);

      // Calculate intermediate points along the route (every 100km)
      const weatherPoints = getRouteWeatherPoints(newWaypoints, 100);

      // Fetch weather data for all points
      const weather = await getWeatherAlongRoute(weatherPoints);

      setWeatherData(weather);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to fetch weather data. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🚗 Canadian Road Weather
          </h1>
          <p className="text-lg text-gray-600">
            Plan your journey and see weather conditions along your route
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <RouteInput onRouteSubmit={handleRouteSubmit} loading={loading} />
            {weatherData.length > 0 && <WeatherSummary weatherData={weatherData} />}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4" style={{ height: '800px' }}>
              {waypoints.length > 0 ? (
                <MapComponent waypoints={waypoints} weatherData={weatherData} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <p className="text-lg">Enter your route to see the map and weather</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-600">
          <p>
            Weather data provided by OpenWeatherMap. Map data © OpenStreetMap contributors.
          </p>
          <p className="mt-2">
            Get your free API key at{' '}
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenWeatherMap
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
