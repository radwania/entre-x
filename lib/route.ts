import { Location } from '@/types';

/**
 * Calculate intermediate points along a route
 * This generates points at regular intervals to fetch weather data
 */
export function calculateIntermediatePoints(
  start: Location,
  end: Location,
  intervalKm: number = 100
): Location[] {
  const points: Location[] = [start];

  const distance = calculateDistance(start, end);
  const numPoints = Math.floor(distance / intervalKm);

  for (let i = 1; i < numPoints; i++) {
    const fraction = i / numPoints;
    const lat = start.lat + (end.lat - start.lat) * fraction;
    const lng = start.lng + (end.lng - start.lng) * fraction;
    points.push({ lat, lng });
  }

  points.push(end);
  return points;
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Get points along a multi-point route
 */
export function getRouteWeatherPoints(waypoints: Location[], intervalKm: number = 100): Location[] {
  const allPoints: Location[] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const segmentPoints = calculateIntermediatePoints(waypoints[i], waypoints[i + 1], intervalKm);
    // Don't duplicate the last point of previous segment with first of next
    allPoints.push(...(i === 0 ? segmentPoints : segmentPoints.slice(1)));
  }

  return allPoints;
}
