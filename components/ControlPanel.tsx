import { useState } from "react";

export const ReverseToggle = ({
  toggleReverse,
  setToggleReverse,
}: {
  toggleReverse: boolean;
  setToggleReverse: (value: boolean) => void;
}) => {
  const handleToggle = () => {
    setToggleReverse(!toggleReverse);
  };

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex justify-center items-center bg-gray-800 rounded-lg h-8 z-50 w-40">
      <div className="flex justify-center items-center bg-gray-800 rounded-lg h-8 z-50 font-orbitron w-full p-4">
        <label className="relative inline-flex items-center mr-5 cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={toggleReverse}
            onChange={handleToggle}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
          <span className="ml-3 text-sm font-medium text-white">Reverse</span>
        </label>
      </div>
    </div>
  );
};
