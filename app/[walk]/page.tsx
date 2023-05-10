"use client";

import { useEffect, useState } from "react";
import ScrollMap from "../../components/ScrollMap";

export default function Page({ params }: any) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const { walk } = params;

  const fetchWalk = async () => {
    setLoading(true);

    await fetch(`/api/walks/${walk}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });

    setLoading(false);
  };

  useEffect(() => {
    fetchWalk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!walk && !data) {
    return <p>No walk found</p>;
  }

  if (data) {
    return <ScrollMap route={data} />;
  }
}
