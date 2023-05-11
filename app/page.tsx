"use client";

import { InfoChips } from "@/components/IntroCard";
import { Loader } from "@/components/Loading";
import Head from "next/head";
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
      <div className="flex flex-col items-center justify-center min-h-screen p-10">
        <h2 className="text-2xl font-bold dark pb-5">Hikes:</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-5 gap-3">
            {hikes.map((hike: string) => (
              <Link key={hike} href={`/${hike}`}>
                <div className="relative">
                  <InfoChips chipMessage={hike} />
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
