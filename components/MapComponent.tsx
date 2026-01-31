'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Location, WeatherData } from '@/types';
import { getWeatherIcon } from '@/lib/weather';

interface MapComponentProps {
  waypoints: Location[];
  weatherData: WeatherData[];
  onMapReady?: (map: L.Map) => void;
}

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapComponent({ waypoints, weatherData, onMapReady }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<any>(null);
  const weatherMarkersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Initialize map only once
    if (!mapRef.current) {
      const map = L.map('map').setView([45.4215, -75.6972], 6); // Default to Ottawa area

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      if (onMapReady) onMapReady(map);
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onMapReady]);

  // Update route when waypoints change
  useEffect(() => {
    if (!mapRef.current || waypoints.length < 2) return;

    // Remove existing routing control
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }

    // Create new routing control
    const control = (L as any).Routing.control({
      waypoints: waypoints.map(wp => L.latLng(wp.lat, wp.lng)),
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      lineOptions: {
        styles: [{ color: '#3b82f6', weight: 5, opacity: 0.7 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      show: false, // Hide the default routing instructions panel
      createMarker: function (i: number, wp: any) {
        const isStart = i === 0;
        const isEnd = i === waypoints.length - 1;
        let label = `Waypoint ${i + 1}`;
        if (isStart) label = 'Start';
        if (isEnd) label = 'End';

        return L.marker(wp.latLng, {
          draggable: false,
          icon: L.divIcon({
            className: 'custom-marker',
            html: `<div class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
              ${isStart ? 'S' : isEnd ? 'E' : i + 1}
            </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          }),
        }).bindPopup(label);
      },
    }).addTo(mapRef.current);

    routingControlRef.current = control;

    // Fit bounds to show entire route
    if (waypoints.length > 0) {
      const bounds = L.latLngBounds(waypoints.map(wp => [wp.lat, wp.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [waypoints]);

  // Update weather markers when weather data changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing weather markers
    weatherMarkersRef.current.forEach(marker => marker.remove());
    weatherMarkersRef.current = [];

    // Add new weather markers
    weatherData.forEach((weather, index) => {
      if (!mapRef.current) return;

      const customIcon = L.divIcon({
        className: 'weather-marker',
        html: `
          <div class="bg-white rounded-lg shadow-lg p-2 border-2 border-blue-400 min-w-[120px]">
            <div class="flex items-center gap-2">
              <img src="${getWeatherIcon(weather.icon)}" alt="${weather.description}" class="w-12 h-12" />
              <div class="flex-1">
                <div class="font-bold text-lg">${weather.temperature}°C</div>
                <div class="text-xs text-gray-600">${weather.condition}</div>
              </div>
            </div>
            <div class="text-xs mt-1 space-y-0.5">
              <div class="flex justify-between">
                <span class="text-gray-500">Wind:</span>
                <span class="font-medium">${weather.windSpeed} km/h</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Visibility:</span>
                <span class="font-medium">${weather.visibility} km</span>
              </div>
            </div>
          </div>
        `,
        iconSize: [140, 120],
        iconAnchor: [70, 60],
      });

      const marker = L.marker([weather.location.lat, weather.location.lng], {
        icon: customIcon,
        zIndexOffset: 1000,
      }).addTo(mapRef.current);

      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold text-lg mb-2">${weather.location.name || 'Weather Point ' + (index + 1)}</h3>
          <p class="mb-1"><strong>Condition:</strong> ${weather.description}</p>
          <p class="mb-1"><strong>Temperature:</strong> ${weather.temperature}°C</p>
          <p class="mb-1"><strong>Humidity:</strong> ${weather.humidity}%</p>
          <p class="mb-1"><strong>Wind Speed:</strong> ${weather.windSpeed} km/h</p>
          <p class="mb-1"><strong>Visibility:</strong> ${weather.visibility} km</p>
        </div>
      `;

      marker.bindPopup(popupContent);
      weatherMarkersRef.current.push(marker);
    });
  }, [weatherData]);

  return <div id="map" className="w-full h-full rounded-lg shadow-lg" />;
}
