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
        <h2 className="text-2xl font-bold dark pb-5">Hikes:</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 md:grid-cols-4 gap-3">
            {hikes.map((hike: string) => (
              <Link key={hike} href={`/${hike}`}>
                <div className="relative border-2 border-gray-300 rounded-md p-4 hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                  <h2 className="text-sm text-center font-medium">
                    {formatText(hike)}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        )}

        <footer className="fixed bottom-0 w-full text-center text-gray-600">
          <div className="py-2 text-xs">
            <p>* For scroggin munchers only</p>
          </div>
        </footer>
      </div>
    </>
  );
}
