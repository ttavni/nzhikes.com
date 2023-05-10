"use client";

import { useEffect, useState } from "react";
import ScrollMap from "../../components/ScrollMap";

export default function Page({ params }: any) {
  const [track, setTrack] = useState();
  const [info, setInfo] = useState();
  const { walk } = params;

  const fetchWalk = async () => {
    await fetch(`/api/walks/${walk}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walk: walk,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const { track, info } = data;
        setTrack(track);
        setInfo(info);
      });
  };

  useEffect(() => {
    fetchWalk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!walk && !track) {
    return <p>No walk found</p>;
  }

  if (track) {
    return <ScrollMap route={track} info={info} />;
  }
}
