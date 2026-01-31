'use client';

import { WeatherData } from '@/types';
import { getWeatherIcon } from '@/lib/weather';

interface WeatherSummaryProps {
  weatherData: WeatherData[];
}

export default function WeatherSummary({ weatherData }: WeatherSummaryProps) {
  if (weatherData.length === 0) {
    return null;
  }

  const avgTemp = Math.round(
    weatherData.reduce((sum, w) => sum + w.temperature, 0) / weatherData.length
  );

  const minTemp = Math.min(...weatherData.map(w => w.temperature));
  const maxTemp = Math.max(...weatherData.map(w => w.temperature));

  const avgWindSpeed = Math.round(
    weatherData.reduce((sum, w) => sum + w.windSpeed, 0) / weatherData.length
  );

  const minVisibility = Math.min(...weatherData.map(w => w.visibility));

  // Get unique weather conditions
  const conditions = [...new Set(weatherData.map(w => w.condition))];

  // Check for hazardous conditions
  const hasSnow = weatherData.some(w => w.condition.toLowerCase().includes('snow'));
  const hasRain = weatherData.some(w => w.condition.toLowerCase().includes('rain'));
  const hasStorm = weatherData.some(w =>
    w.condition.toLowerCase().includes('storm') ||
    w.condition.toLowerCase().includes('thunder')
  );
  const hasFog = weatherData.some(w =>
    w.condition.toLowerCase().includes('fog') ||
    w.condition.toLowerCase().includes('mist')
  );
  const poorVisibility = minVisibility < 5;

  const warnings = [];
  if (hasStorm) warnings.push('⚠️ Thunderstorms expected');
  if (hasSnow) warnings.push('❄️ Snow conditions');
  if (hasRain) warnings.push('🌧️ Rain expected');
  if (hasFog || poorVisibility) warnings.push('🌫️ Reduced visibility');
  if (avgWindSpeed > 50) warnings.push('💨 High winds');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Weather Summary</h2>

      {warnings.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">Travel Advisories</h3>
          <ul className="space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className="text-sm text-yellow-700">{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Temperature Range</div>
          <div className="text-2xl font-bold text-gray-800">
            {minTemp}° - {maxTemp}°C
          </div>
          <div className="text-xs text-gray-500 mt-1">Average: {avgTemp}°C</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Wind Speed</div>
          <div className="text-2xl font-bold text-gray-800">{avgWindSpeed} km/h</div>
          <div className="text-xs text-gray-500 mt-1">Average along route</div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Conditions Along Route</h3>
        <div className="flex flex-wrap gap-2">
          {conditions.map((condition, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {condition}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-700 mb-3">Weather Points ({weatherData.length})</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {weatherData.map((weather, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src={getWeatherIcon(weather.icon)}
                alt={weather.description}
                className="w-12 h-12"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  {weather.location.name || `Point ${index + 1}`}
                </div>
                <div className="text-sm text-gray-600">{weather.description}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-gray-800">{weather.temperature}°C</div>
                <div className="text-xs text-gray-500">{weather.windSpeed} km/h</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
