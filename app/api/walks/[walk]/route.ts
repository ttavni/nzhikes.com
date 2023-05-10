import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { Coordinates, Places } from "@/components/utils/types";

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

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const walk = req.url?.split("/").slice(-1)[0];
  const walkDirectory = path.join(process.cwd(), "config");

  const placesOfInterest = JSON.parse(
    fs.readFileSync(
      path.resolve(walkDirectory + `/${walk}/pointsOfInterest.json`),
      "utf-8"
    )
  );

  const route = JSON.parse(
    fs.readFileSync(
      path.resolve(walkDirectory + `/${walk}/route.json`),
      "utf-8"
    )
  );

  const track = trackCreator(route, placesOfInterest);

  return NextResponse.json(track);
}
