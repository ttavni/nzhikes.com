import { Position } from "@turf/turf";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

export type Coordinate = Position;
export type Coordinates = Coordinate[];

export interface Places {
  [key: string]: [number, number];
}

export interface GeoJSON {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  properties: {
    name: string;
  };
}

export type Route = FeatureCollection<Geometry, GeoJsonProperties>;
