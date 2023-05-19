import * as turf from "@turf/turf";
import { Coordinates, Route } from "./types";

export const geojsonPoint: Route = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [],
      },
      properties: {},
    },
  ],
};

export function createMovingLine(currentJson: Coordinates) {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: currentJson,
        },
      },
    ],
  };
}

export function bearingBetween(coordinate1: number[], coordinate2: number[]) {
  const point1 = turf.point([coordinate1[0], coordinate1[1]]);
  const point2 = turf.point([coordinate2[0], coordinate2[1]]);
  return turf.bearing(point1, point2);
}

export function driveRoute(route: Coordinates, index: number) {
  const currentRoute = route.slice(0, index);
  const center = route[index];
  if (currentRoute.length > 0) {
    const movingLine = createMovingLine(currentRoute);
    return { movingLine, center };
  }
  return { movingLine: null, center: null };
}
