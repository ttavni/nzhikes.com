import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatBounds, LngLatLike } from "mapbox-gl";

import Metrics from "./Metrics";

import { Route } from "../utils/types";
import { calculateTotalDistance } from "../utils/geometry";
import { transformRequest } from "../utils/constants";
import { driveRoute, geojsonPoint } from "../utils/drive";
import * as turf from "@turf/turf";

import { addPlaces } from "../utils/mapboxSources";

import {
  bearingDifferenceThreshold,
  updateBearing,
} from "../utils/mapControls";
import { LineString } from "@turf/turf";
import { IntroCard } from "./IntroCard";
import { useScrollTracker } from "react-scroll-tracker";
import Link from "next/link";
import { Loader } from "./Loading";
import { ScrollDown } from "./ScrollDown";

const ScrollMap = ({ route, info }: { route: Route; info: any }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { introTitle, url, chipMessages } = info;

  const [altitude, setAltitude] = useState(0);
  const [distance, setDistance] = useState(0);
  const [previousBearing, setPreviousBearing] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [initialZoom, setInitialZoom] = useState(12.5);

  const routeCoordinates = (route.features[0].geometry as LineString)
    .coordinates;

  const startingCoordinates = routeCoordinates
    .reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1]], [0, 0])
    .map((sum) => sum / routeCoordinates.length);

  const minLat = Math.min(...routeCoordinates.map((coord) => coord[0]));
  const maxLat = Math.max(...routeCoordinates.map((coord) => coord[0]));
  const minLon = Math.min(...routeCoordinates.map((coord) => coord[1]));
  const maxLon = Math.max(...routeCoordinates.map((coord) => coord[1]));

  const { scrollY } = useScrollTracker();
  const mapContainerHeight = routeCoordinates.length * 15;
  const index = Math.floor((scrollY * routeCoordinates.length) / 100);

  const getZoomLevel = () => {
    const mapWidth = mapContainerRef.current!.clientWidth; // Get the current width of the map container

    // Choose either the latitude or longitude span as the reference
    const referenceSpan = Math.max(maxLat - minLat, maxLon - minLon);

    // Calculate the zoom level based on the span and the map width
    const zoomLevel = Math.log2((360 * mapWidth) / (referenceSpan * 512));

    return Math.round(zoomLevel);
  };

  useEffect(() => {
    // Create the Mapbox map instance
    document.body.style.overflow = "hidden"; //  disable scrolling
    setLoading(true);
    setInitialZoom(getZoomLevel() * 0.85);
    mapboxgl.accessToken = process.env.MAPBOX_TOKEN as string;
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/ttavni/clhr6yfa4003d01r6g61v8prd/draft",
      center: startingCoordinates as LngLatLike,
      zoom: initialZoom,
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
        map.current.setTerrain({ source: "mapbox-dem", exaggeration: 2 });
      }
    });

    // Load the GeoJSON data for the route
    map.current.on("load", () => {
      addPlaces(map, {
        type: "FeatureCollection",
        features: route.features.slice(1),
      });

      if (index === 0) {
        // Add initial route when
        // Add initial route when index is 0
        const { movingLine } = driveRoute(
          routeCoordinates,
          routeCoordinates.length
        );

        if (map.current) {
          map.current.addSource("initialRoute", {
            type: "geojson",
            data: movingLine as Route,
          });

          map.current.addLayer({
            id: "initialLine",
            type: "line",
            source: "initialRoute",
            paint: {
              "line-opacity": 0.6,
              "line-color": "red",
              "line-width": 1,
            },
          });
        }
      }
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

        setLoading(false);
        document.body.style.overflow = "unset"; //  allow scrolling once everything loaded
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

      map.current.setZoom(13.5);
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
    if (index === 0) {
      map.current?.setZoom(initialZoom);
    }
  }, [index, routeCoordinates, previousBearing, initialZoom]);

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  const progress = Math.min((index / routeCoordinates.length) * 100, 100);

  return (
    <>
      <title>{introTitle}</title>
      {isLoading && <Loader />}
      {!isLoading && index === 0 && <ScrollDown />}
      {index !== 0 && (
        <Link
          href="/"
          className="fixed right-5 p-1 top-5 z-50 text-md font-semibold text-gray-800 bg-gray-100 border border-gray-200 dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
        >
          <kbd>← Home</kbd>
        </Link>
      )}
      <div style={{ height: `${mapContainerHeight}px` }}>
        {index === 0 && (
          <IntroCard
            introTitle={introTitle}
            url={url}
            chipMessages={chipMessages}
          />
        )}
        <Metrics progress={progress} altitude={altitude} distance={distance} />
        <div className="h-screen w-screen fixed top-0" ref={mapContainerRef} />
      </div>
    </>
  );
};

export default ScrollMap;
