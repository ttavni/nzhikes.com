import { Coordinates, Places } from "./types";

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

const routeCreator = (title: string, coordinates: Coordinates) => {
  return {
    type: "Feature",
    properties: {
      name: title,
    },
    geometry: {
      type: "LineString",
      coordinates: coordinates,
    },
  };
};

export const trackCreator = (
  title: string,
  coordinates: Coordinates,
  places: Places
) => {
  return {
    type: "FeatureCollection",
    features: [routeCreator(title, coordinates), ...pointCreator(places)],
  };
};
