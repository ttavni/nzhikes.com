"use client";

import { ReverseToggle } from "@/components/ControlPanel";
import ErrorPage from "@/components/ErrorPage";
import { useEffect, useState } from "react";
import ScrollMap from "../../components/ScrollMap";

export default function Page({ params }: any) {
  const [track, setTrack] = useState();
  const [info, setInfo] = useState({ reverseAble: false });
  const [loading, setLoading] = useState(false);
  const [toggleReverse, setToggleReverse] = useState(false);
  const { walk } = params;

  const fetchWalk = async () => {
    setLoading(true);
    const response = await fetch(`/api/walks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walk: walk,
        reverse: toggleReverse,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      const { track, info } = data;
      setTrack(track);
      setInfo(info);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWalk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleReverse]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!track) {
    return <ErrorPage />;
  }

  return (
    <>
      <title>Hiking Track</title>
      <ScrollMap route={track} info={info} />
      {info.reverseAble && (
        <ReverseToggle
          toggleReverse={toggleReverse}
          setToggleReverse={setToggleReverse}
        />
      )}
    </>
  );
}
