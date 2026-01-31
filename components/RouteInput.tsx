'use client';

import { useState } from 'react';
import { Location } from '@/types';

interface RouteInputProps {
  onRouteSubmit: (waypoints: Location[]) => void;
  loading?: boolean;
}

interface WaypointInput {
  id: string;
  address: string;
  lat: string;
  lng: string;
}

export default function RouteInput({ onRouteSubmit, loading }: RouteInputProps) {
  const [waypoints, setWaypoints] = useState<WaypointInput[]>([
    { id: '1', address: '', lat: '', lng: '' },
    { id: '2', address: '', lat: '', lng: '' },
  ]);

  const addWaypoint = () => {
    const newId = (waypoints.length + 1).toString();
    setWaypoints([...waypoints, { id: newId, address: '', lat: '', lng: '' }]);
  };

  const removeWaypoint = (id: string) => {
    if (waypoints.length <= 2) return; // Keep at least start and end
    setWaypoints(waypoints.filter(wp => wp.id !== id));
  };

  const updateWaypoint = (id: string, field: keyof WaypointInput, value: string) => {
    setWaypoints(waypoints.map(wp =>
      wp.id === id ? { ...wp, [field]: value } : wp
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const locations: Location[] = waypoints
      .filter(wp => wp.lat && wp.lng)
      .map(wp => ({
        lat: parseFloat(wp.lat),
        lng: parseFloat(wp.lng),
        name: wp.address || undefined,
      }));

    if (locations.length >= 2) {
      onRouteSubmit(locations);
    } else {
      alert('Please enter at least a start and end point with valid coordinates.');
    }
  };

  const loadSampleRoute = () => {
    // Sample route: Toronto to Montreal via Ottawa
    setWaypoints([
      { id: '1', address: 'Toronto, ON', lat: '43.6532', lng: '-79.3832' },
      { id: '2', address: 'Ottawa, ON', lat: '45.4215', lng: '-75.6972' },
      { id: '3', address: 'Montreal, QC', lat: '45.5017', lng: '-73.5673' },
    ]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Plan Your Route</h2>

      <button
        type="button"
        onClick={loadSampleRoute}
        className="mb-4 text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Load Sample Route (Toronto → Ottawa → Montreal)
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        {waypoints.map((waypoint, index) => (
          <div key={waypoint.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">
                {index === 0 ? 'Start' : index === waypoints.length - 1 ? 'End' : `Waypoint ${index}`}
              </h3>
              {waypoints.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeWaypoint(waypoint.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="City/Address (optional)"
                value={waypoint.address}
                onChange={(e) => updateWaypoint(waypoint.id, 'address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={waypoint.lat}
                  onChange={(e) => updateWaypoint(waypoint.id, 'lat', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={waypoint.lng}
                  onChange={(e) => updateWaypoint(waypoint.id, 'lng', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addWaypoint}
          className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          + Add Waypoint
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Loading Weather...' : 'Get Weather Along Route'}
        </button>
      </form>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
        <p className="font-semibold mb-1">Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>You can find coordinates using Google Maps (right-click → coordinates)</li>
          <li>Add waypoints for stops along your route</li>
          <li>Weather is checked every ~100km along the route</li>
        </ul>
      </div>
    </div>
  );
}
