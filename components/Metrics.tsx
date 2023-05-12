import React from "react";

const Metrics = ({
  progress,
  altitude,
  distance,
}: {
  progress: number;
  altitude: number;
  distance: number;
}) => {
  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center bg-gray-800 rounded-lg h-8 z-50 font-orbitron w-40">
      <div className="flex justify-center items-center w-full pb-2">
        <p className="text-white text-sm md:text-base mr-2">{`${altitude}m`}</p>
        <p
          className="text-white text-base md:text-lg"
          style={{ color: "greenyellow" }}
        >
          •
        </p>
        <p className="text-white text-sm md:text-base ml-2">{`${distance}km`}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Metrics;
