import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import { Coordinates, Places, GeoJSON } from "@/components/utils/types";

type RequestData = {
  walk: string;
  reverse: boolean;
};

const pointCreator = (places: Places) => {
  const points = Object.keys(places).map((name) => ({
    type: "Feature",
    properties: {
      name: name,
    },
    geometry: {
      type: "Point",
      coordinates: places[name],
    },
  }));

  return points;
};

export const trackCreator = (coordinates: Coordinates, places: Places) => {
  return {
    type: "FeatureCollection",
    features: [coordinates, ...pointCreator(places)],
  };
};

function reverseGeoJSONCoordinates(geojson: GeoJSON): GeoJSON {
  const reversedCoordinates = geojson.geometry.coordinates.reverse();
  return {
    ...geojson,
    geometry: {
      ...geojson.geometry,
      coordinates: reversedCoordinates,
    },
  };
}

export async function POST(request: Request) {
  try {
    const { walk, reverse } = (await request.json()) as RequestData;

    const walkDirectory = path.join(process.cwd(), "config");

    let info, pointsOfInterest, route;

    try {
      const infoFilePath = path.resolve(walkDirectory, walk, "meta.json");
      const routeFilePath = path.resolve(walkDirectory, walk, "route.json");

      const meta = JSON.parse(fs.readFileSync(infoFilePath, "utf-8"));
      pointsOfInterest = meta.pointsOfInterest;
      info = meta.info;
      route = JSON.parse(fs.readFileSync(routeFilePath, "utf-8"));

      if (reverse) {
        route = reverseGeoJSONCoordinates(route);
      }
    } catch (error) {
      // Return an error response if walk info or route files are not found
      return new NextResponse("Walk not found", { status: 404 });
    }

    if (!info || !pointsOfInterest || !route)
      return new NextResponse("Walk not found", { status: 404 });
    const track = trackCreator(route, pointsOfInterest);

    return new NextResponse(JSON.stringify({ info, track }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle any other unexpected errors
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
