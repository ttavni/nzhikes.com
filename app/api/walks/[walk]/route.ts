import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import { Coordinates, Places } from "@/components/utils/types";

type RequestData = {
  walk: string;
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

export async function POST(request: Request) {
  const { walk } = (await request.json()) as RequestData;
  const walkDirectory = path.join(process.cwd(), "config");

  const { info, pointsOfInterest } = JSON.parse(
    fs.readFileSync(path.resolve(walkDirectory + `/${walk}/info.json`), "utf-8")
  );

  const route = JSON.parse(
    fs.readFileSync(
      path.resolve(walkDirectory + `/${walk}/route.json`),
      "utf-8"
    )
  );

  const track = trackCreator(route, pointsOfInterest);

  return NextResponse.json({ info, track });
}
