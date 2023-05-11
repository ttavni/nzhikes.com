import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";

import Metrics from "./Metrics";

import { Route } from "./utils/types";
import { calculateTotalDistance } from "./utils/geometry";
import { transformRequest } from "./utils/constants";
import { useWindowScrollPositions } from "./utils/useScrollPosition";
import { driveRoute, geojsonPoint } from "./utils/drive";
import * as turf from "@turf/turf";

import { addPlaces } from "./utils/mapboxSources";

import { bearingDifferenceThreshold, updateBearing } from "./utils/mapControls";
import { LineString } from "@turf/turf";
import { useScrollBlock } from "./utils/blockScroll";
import { IntroCard } from "./IntroCard";
import { ProgressBar } from "./Progress";

const ScrollMap = ({ route, info }: { route: Route; info: any }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { introTitle, url, chipMessages } = info;

  const [altitude, setAltitude] = useState(0);
  const [distance, setDistance] = useState(0);
  const [previousBearing, setPreviousBearing] = useState(0);

  const { scrollY } = useWindowScrollPositions();
  const index = Math.round(scrollY / 10);
  const routeCoordinates = (route.features[0].geometry as LineString)
    .coordinates;

  const startingCoordinates = routeCoordinates
    .reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1]], [0, 0])
    .map((sum) => sum / routeCoordinates.length);

  useEffect(() => {
    // Create the Mapbox map instance
    mapboxgl.accessToken = process.env.MAPBOX_TOKEN as string;
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/ttavni/clfw18fi4000g01pgluyistb5",
      center: startingCoordinates as LngLatLike,
      zoom: 10.5,
      pitch: 10,
      transformRequest: transformRequest,
      interactive: false,
    });

    map.current.on("style.load", () => {
      if (map.current) {
        map.current.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
        });
        map.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
      }
    });

    // Load the GeoJSON data for the route
    map.current.on("load", () => {
      addPlaces(map, {
        type: "FeatureCollection",
        features: route.features.slice(1, -1),
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    map.current &&
      map.current.on("load", () => {
        if (map.current) {
          if (!map.current.getSource("lineSource")) {
            map.current.addSource("lineSource", {
              type: "geojson",
              data: geojsonPoint,
            });

            map.current.addLayer({
              id: "animatedLine",
              type: "line",
              source: "lineSource",
              paint: {
                "line-opacity": 1,
                "line-color": "yellow",
                "line-width": 5,
              },
            });
          }

          if (!map.current.getSource("pointSource")) {
            map.current.addSource("pointSource", {
              type: "geojson",
              data: geojsonPoint,
            });

            map.current.addLayer({
              id: "animatedPoint",
              type: "circle",
              source: "pointSource",
              paint: {
                "circle-radius": 10,
                "circle-opacity": 1,
                "circle-color": "yellow",
              },
            });
          }
        }
      });

    const { movingLine, center } = driveRoute(routeCoordinates, index);
    if (
      movingLine &&
      map.current &&
      center &&
      map.current.getSource("pointSource") &&
      map.current.getSource("lineSource")
    ) {
      (map.current.getSource("pointSource") as mapboxgl.GeoJSONSource).setData(
        turf.point(center)
      );

      (map.current.getSource("lineSource") as mapboxgl.GeoJSONSource).setData(
        movingLine as Route
      );

      map.current.setZoom(13);
      map.current.setPitch(50);
      map.current.setCenter([center[0], center[1]]);

      const newBearing = updateBearing(index, routeCoordinates);

      if (bearingDifferenceThreshold(0.035, previousBearing, newBearing)) {
        map.current.setBearing(newBearing);
      }

      setPreviousBearing(newBearing);

      setDistance(calculateTotalDistance(routeCoordinates, index));
      const elevation = map.current.queryTerrainElevation(center as LngLatLike);
      setAltitude(Math.round(elevation || 0));
    }
  }, [index, routeCoordinates, previousBearing]);

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  const height = Math.round(routeCoordinates.length * 10.265);
  const mapContainerHeight = `${height}px`;
  const progress = (index / routeCoordinates.length) * 100;

  return (
    <>
      <div style={{ height: mapContainerHeight }}>
        {index === 0 && (
          <IntroCard
            introTitle={introTitle}
            url={url}
            chipMessages={chipMessages}
          />
        )}
        <ProgressBar progress={progress} />
        <Metrics altitude={altitude} distance={distance} />
        <div className="h-screen w-screen fixed top-0" ref={mapContainerRef} />
      </div>
    </>
  );
};

export default ScrollMap;
