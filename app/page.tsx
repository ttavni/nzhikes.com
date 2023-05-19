"use client";

import { Loader } from "@/components/Loading";
import { formatText } from "@/utils/formatText";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWalks = async () => {
    setLoading(true);
    await fetch(`/api/getWalks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setHikes(data.hikes);
      });

    setLoading(false);
  };

  useEffect(() => {
    fetchWalks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <title>NZ Hikes</title>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {hikes.map((hike: { name: string; info: any }) => {
              const isGreatWalk = hike.info.tags.includes("Great Walk");
              return (
                <Link key={hike.name} href={`/${hike.name}`}>
                  <div className="stats shadow w-full sm:max-w-sm">
                    <div className="stat p-5">
                      <div className={`stat-title font-normal`}>
                        {hike.info.tags.join(" • ")}
                      </div>
                      <div
                        className={`stat-value ${
                          isGreatWalk ? "text-primary" : "text-secondary"
                        }`}
                      >
                        {formatText(hike.name)}
                      </div>
                      <div className="stat-desc text font-black">
                        {hike.info.info.chipMessages.slice(0, 3).join(" • ")}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
