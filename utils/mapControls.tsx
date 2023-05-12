import { bearingBetween } from "./drive";
import { Coordinates } from "./types";

export const bearingDifferenceThreshold = (
  thresholdPercentage: number,
  previousBearing: number,
  newBearing: number
) => {
  // Calculate the absolute difference between the bearings
  const difference = Math.abs(newBearing - previousBearing);

  // Calculate the 5% threshold
  const threshold = (360 * thresholdPercentage) % 360;

  // Check if the difference is greater than or equal to the threshold
  return difference >= threshold;
};

export function updateBearing(index: number, routeCoordinates: Coordinates) {
  const numCoordinatesToAverage = 60;
  const startRouteCoordinates = routeCoordinates.slice(
    Math.max(0, index - numCoordinatesToAverage),
    index
  );
  const endRouteCoordinates = routeCoordinates.slice(
    index,
    Math.max(0, index + numCoordinatesToAverage)
  );

  const startingAverage = startRouteCoordinates
    .reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1]], [0, 0])
    .map((sum) => sum / startRouteCoordinates.length);

  const endingAverage = endRouteCoordinates
    .reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1]], [0, 0])
    .map((sum) => sum / endRouteCoordinates.length);

  return bearingBetween(startingAverage, endingAverage);
}
