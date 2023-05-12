import mapboxgl from "mapbox-gl";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

export function addPlaces(
  map: React.MutableRefObject<mapboxgl.Map | null>,
  places: FeatureCollection<Geometry, GeoJsonProperties>
) {
  if (!map.current) return;
  map.current.addSource("places", {
    type: "geojson",
    data: places,
  });

  map.current.addLayer({
    id: "circle",
    type: "circle",
    source: "places",
    paint: {
      "circle-color": "#90a0b0",
      "circle-opacity": 0.8,
      "circle-radius": 5,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  map.current.addLayer({
    id: "poi-labels",
    type: "symbol",
    source: "places",
    paint: {
      "text-color": "#ffffff",
      "text-halo-color": "#15006D",
      "text-halo-width": 50,
      "text-halo-blur": 1,
    },
    layout: {
      "text-field": ["get", "name"],
      "text-variable-anchor": ["left", "right"],
      "text-radial-offset": 0.95,
      "text-justify": "auto",
      "text-size": 8,
      "text-font": ["Poppins Black"],
      "text-transform": "uppercase",
      "text-letter-spacing": 0.1,
      "text-max-width": 15,
    },
  });
}
