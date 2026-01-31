'use client';

import { useState } from 'react';
import { Location } from '@/types';
import { searchAddress, GeocodingResult, geocodingResultToLocation } from '@/lib/geocoding';

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
  const [searchResults, setSearchResults] = useState<{ [key: string]: GeocodingResult[] }>({});
  const [searching, setSearching] = useState<{ [key: string]: boolean }>({});

  const addWaypoint = () => {
    const newId = (waypoints.length + 1).toString();
    setWaypoints([...waypoints, { id: newId, address: '', lat: '', lng: '' }]);
  };

  const removeWaypoint = (id: string) => {
    if (waypoints.length <= 2) return;
    setWaypoints(waypoints.filter(wp => wp.id !== id));
    // Clear search results for removed waypoint
    const newSearchResults = { ...searchResults };
    delete newSearchResults[id];
    setSearchResults(newSearchResults);
  };

  const updateWaypoint = (id: string, field: keyof WaypointInput, value: string) => {
    setWaypoints(waypoints.map(wp =>
      wp.id === id ? { ...wp, [field]: value } : wp
    ));
  };

  const handleAddressSearch = async (waypointId: string, address: string) => {
    if (!address.trim()) {
      alert('Please enter an address to search');
      return;
    }

    setSearching({ ...searching, [waypointId]: true });

    try {
      const results = await searchAddress(address);
      setSearchResults({ ...searchResults, [waypointId]: results });

      if (results.length === 0) {
        alert('No results found. Try a different address or city name.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search address. Please try again.');
    } finally {
      setSearching({ ...searching, [waypointId]: false });
    }
  };

  const selectSearchResult = (waypointId: string, result: GeocodingResult) => {
    const location = geocodingResultToLocation(result);
    updateWaypoint(waypointId, 'lat', location.lat.toString());
    updateWaypoint(waypointId, 'lng', location.lng.toString());
    updateWaypoint(waypointId, 'address', location.name || '');

    // Clear search results
    const newSearchResults = { ...searchResults };
    delete newSearchResults[waypointId];
    setSearchResults(newSearchResults);
  };

  const clearSearchResults = (waypointId: string) => {
    const newSearchResults = { ...searchResults };
    delete newSearchResults[waypointId];
    setSearchResults(newSearchResults);
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
      alert('Please search for addresses or enter coordinates for at least start and end points.');
    }
  };

  const loadSampleRoute = () => {
    setWaypoints([
      { id: '1', address: 'Toronto, Ontario', lat: '43.6532', lng: '-79.3832' },
      { id: '2', address: 'Ottawa, Ontario', lat: '45.4215', lng: '-75.6972' },
      { id: '3', address: 'Montreal, Quebec', lat: '45.5017', lng: '-73.5673' },
    ]);
    setSearchResults({});
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
              {/* Address Search */}
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter city or address (e.g., 'Toronto, ON')"
                    value={waypoint.address}
                    onChange={(e) => updateWaypoint(waypoint.id, 'address', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddressSearch(waypoint.id, waypoint.address);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddressSearch(waypoint.id, waypoint.address)}
                    disabled={searching[waypoint.id]}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 whitespace-nowrap"
                  >
                    {searching[waypoint.id] ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </span>
                    ) : (
                      '🔍 Search'
                    )}
                  </button>
                </div>

                {/* Search Results Dropdown */}
                {searchResults[waypoint.id] && searchResults[waypoint.id].length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <span className="text-sm font-semibold text-gray-700">Select a location:</span>
                      <button
                        type="button"
                        onClick={() => clearSearchResults(waypoint.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        ✕ Close
                      </button>
                    </div>
                    {searchResults[waypoint.id].map((result, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectSearchResult(waypoint.id, result)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="text-sm font-medium text-gray-800">
                          {result.address?.city || result.address?.town || result.address?.village || 'Unknown'}
                          {result.address?.state && `, ${result.address.state}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{result.display_name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Coordinates (auto-filled from search or manual entry) */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude (auto-filled)"
                  value={waypoint.lat}
                  onChange={(e) => updateWaypoint(waypoint.id, 'lat', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude (auto-filled)"
                  value={waypoint.lng}
                  onChange={(e) => updateWaypoint(waypoint.id, 'lng', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
        <p className="font-semibold mb-1">How to use:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Type an address or city name and click Search</li>
          <li>Or enter coordinates manually if you prefer</li>
          <li>Add waypoints for stops along your route</li>
          <li>Weather is checked every ~100km along the route</li>
        </ul>
      </div>
    </div>
  );
}
