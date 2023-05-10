"use client";

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold dark pb-5">Available Users:</h2>
      <div className="grid grid-cols-5 sm:grid-cols-5 gap-3">
        {hikes.map((hike: string) => (
          <Link key={hike} href={`/${hike}`}>
            <div className="relative">
              <div className="font-medium text-center text-xs mt-2">
                {`${hike} track`}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <footer className="fixed bottom-0 w-full text-center text-gray-600">
        <div className="py-2 text-xs">
          <p>
            * No responsibility is taken for the text generated. For
            entertainment purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
