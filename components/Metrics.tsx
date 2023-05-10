import React from "react";

const Metrics = ({
  altitude,
  distance,
}: {
  altitude: number;
  distance: number;
}) => {
  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex justify-center items-center bg-gray-800 rounded-lg h-8 z-50 font-orbitron w-40">
      <p className="text-white text-sm md:text-base altitude">{`${altitude}m`}</p>
      <p
        className="text-white text-base md:text-lg mx-2"
        style={{ color: "greenyellow" }}
      >
        •
      </p>
      <p className="text-white text-sm md:text-base altitude">{`${distance}km`}</p>
    </div>
  );
};

export default Metrics;
