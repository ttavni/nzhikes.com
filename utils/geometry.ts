import { Coordinate } from "./types";
import * as turf from "@turf/turf";

function haversineDistance(coord1: Coordinate, coord2: Coordinate) {
  const toRadians = (angle: number) => (angle * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const lat1 = toRadians(coord1[1]);
  const lat2 = toRadians(coord2[1]);
  const dLat = toRadians(coord2[1] - coord1[1]);
  const dLon = toRadians(coord2[0] - coord1[0]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function calculateTotalDistance(
  coordinates: turf.helpers.Position[],
  index: number
) {
  let totalDistance = 0;

  for (let i = 0; i < index - 1; i++) {
    const distance = haversineDistance(coordinates[i], coordinates[i + 1]);
    totalDistance += distance;
  }

  return +totalDistance.toFixed(2);
}
