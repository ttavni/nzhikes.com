import React from "react";

const InfoChips = (chipMessage: string) => {
  return (
    <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
      {chipMessage}
    </span>
  );
};
export const IntroCard = ({
  introTitle,
  url,
  chipMessages,
}: {
  introTitle: string;
  url: string;
  chipMessages: string[];
}) => {
  return (
    <div className="z-10 p-2 fixed w-full flex flex-col items-start justify-start min-h-screen">
      <a
        href={url}
        className=" md:w-auto max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {introTitle}
        </h5>
        <div className="flex flex-wrap">
          {chipMessages.map((chipMessage) => InfoChips(chipMessage))}
        </div>
      </a>
    </div>
  );
};
